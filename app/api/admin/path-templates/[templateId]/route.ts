import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
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

    const template = await prisma.pathTemplate.findUnique({
      where: { id: params.templateId },
      include: {
        generatedPaths: {
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            isActive: true,
            _count: {
              select: {
                pathLessons: true,
                userProgress: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching path template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const {
      name,
      description,
      emoji,
      durationWeeks,
      difficulty,
      targetAudience,
      includeModules,
      excludeModules,
      minDifficulty,
      maxDifficulty,
      lessonsPerDay,
      daysPerWeek,
      estimatedHoursPerDay,
      balanceTheoryPractice,
      companyFocus,
      isActive,
    } = body;

    // Build rules object
    const rules = {
      includeModules: includeModules || [],
      excludeModules: excludeModules || [],
      minDifficulty: minDifficulty || null,
      maxDifficulty: maxDifficulty || null,
      lessonsPerDay: lessonsPerDay || 2,
      daysPerWeek: daysPerWeek || 5,
      estimatedHoursPerDay: estimatedHoursPerDay || 2.0,
      targetDurationWeeks: durationWeeks,
      balanceTheoryPractice: balanceTheoryPractice || false,
      companyFocus: companyFocus || [],
    };

    const template = await prisma.pathTemplate.update({
      where: { id: params.templateId },
      data: {
        name,
        description,
        emoji,
        durationWeeks: durationWeeks ? parseInt(durationWeeks) : undefined,
        difficulty,
        targetAudience,
        rules,
        includeModules: includeModules ? includeModules.join(",") : undefined,
        excludeModules: excludeModules ? excludeModules.join(",") : undefined,
        minDifficulty,
        maxDifficulty,
        lessonsPerDay,
        daysPerWeek,
        estimatedHoursPerDay,
        isActive,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error updating path template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if template has generated paths
    const template = await prisma.pathTemplate.findUnique({
      where: { id: params.templateId },
      include: {
        _count: {
          select: {
            generatedPaths: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    if (template._count.generatedPaths > 0) {
      // Soft delete by marking as inactive
      await prisma.pathTemplate.update({
        where: { id: params.templateId },
        data: { isActive: false },
      });

      return NextResponse.json({
        message: "Template deactivated (has generated paths)",
        deactivated: true,
      });
    }

    // Hard delete if no paths generated
    await prisma.pathTemplate.delete({
      where: { id: params.templateId },
    });

    return NextResponse.json({
      message: "Template deleted successfully",
      deleted: true,
    });
  } catch (error) {
    console.error("Error deleting path template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
