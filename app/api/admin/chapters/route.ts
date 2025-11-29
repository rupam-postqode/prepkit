import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin();

    const { title, description, moduleId, difficultyLevel, estimatedHours, orderIndex } = await request.json();

    // Validate input
    if (!title || !description || !moduleId || !difficultyLevel) {
      return NextResponse.json(
        { error: "Title, description, module, and difficulty level are required" },
        { status: 400 }
      );
    }

    // Verify module exists
    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleData) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists in this module
    const existingChapter = await prisma.chapter.findUnique({
      where: {
        moduleId_slug: {
          moduleId,
          slug,
        },
      },
    });

    if (existingChapter) {
      return NextResponse.json(
        { error: "Chapter with this title already exists in this module" },
        { status: 400 }
      );
    }

    // Get the highest order index for this module if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const lastChapter = await prisma.chapter.findFirst({
        where: { moduleId },
        orderBy: { orderIndex: 'desc' },
      });
      finalOrderIndex = lastChapter ? lastChapter.orderIndex + 1 : 1;
    }

    // Create the chapter
    const chapter = await prisma.chapter.create({
      data: {
        title,
        slug,
        description,
        moduleId,
        difficultyLevel,
        estimatedHours: estimatedHours || 1,
        orderIndex: finalOrderIndex,
      },
      include: {
        module: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error("Create chapter error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    const where = moduleId ? { moduleId } : {};

    const chapters = await prisma.chapter.findMany({
      where,
      include: {
        module: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy: [
        { module: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Get chapters error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
