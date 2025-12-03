import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DynamicPathGenerator, PathGenerationRule } from "@/lib/dynamic-path-generator";

export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { preview = false, title, description, emoji } = body;

    // Fetch the template
    const template = await prisma.pathTemplate.findUnique({
      where: { id: params.templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    if (!template.isActive) {
      return NextResponse.json(
        { error: "Template is not active" },
        { status: 400 }
      );
    }

    // Parse the rules
    const rules = template.rules as PathGenerationRule;

    // Initialize the generator
    const generator = new DynamicPathGenerator();

    // Generate the path
    const generated = await generator.generatePath(rules);

    // If this is a preview request, just return the generation results
    if (preview) {
      return NextResponse.json({
        preview: true,
        template: {
          id: template.id,
          name: template.name,
          description: template.description,
          emoji: template.emoji,
        },
        generation: {
          totalLessons: generated.totalLessons,
          totalEstimatedHours: generated.totalEstimatedHours,
          actualDurationWeeks: generated.actualDurationWeeks,
          plannedDurationWeeks: template.durationWeeks,
          contentSummary: generated.contentSummary,
          schedule: generated.schedule,
        },
      });
    }

    // Create the learning path
    if (!title) {
      return NextResponse.json(
        { error: "Title is required to create path" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingPath = await prisma.learningPath.findUnique({
      where: { slug },
    });

    if (existingPath) {
      return NextResponse.json(
        { error: "A path with this slug already exists. Please use a different title." },
        { status: 409 }
      );
    }

    // Create the path using the generator
    const pathId = await generator.createPathFromSchedule(
      template.id,
      generated.schedule,
      title,
      description || template.description,
      emoji || template.emoji
    );

    // Fetch the created path with details
    const createdPath = await prisma.learningPath.findUnique({
      where: { id: pathId },
      include: {
        _count: {
          select: {
            pathLessons: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      path: createdPath,
      generation: {
        totalLessons: generated.totalLessons,
        totalEstimatedHours: generated.totalEstimatedHours,
        actualDurationWeeks: generated.actualDurationWeeks,
        contentSummary: generated.contentSummary,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error generating learning path:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate learning path",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
