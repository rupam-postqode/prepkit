import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    // Check admin access
    await requireAdmin();

    const chapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        module: true,
        lessons: {
          orderBy: { orderIndex: 'asc' },
          include: {
            _count: {
              select: {
                progress: true,
                practiceLinks: true,
              },
            },
          },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Get chapter error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
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

    // Generate new slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists in this module (excluding current chapter)
    const existingChapter = await prisma.chapter.findFirst({
      where: {
        moduleId,
        slug,
        id: { not: params.chapterId },
      },
    });

    if (existingChapter) {
      return NextResponse.json(
        { error: "Chapter with this title already exists in this module" },
        { status: 400 }
      );
    }

    // Update the chapter
    const chapter = await prisma.chapter.update({
      where: { id: params.chapterId },
      data: {
        title,
        slug,
        description,
        moduleId,
        difficultyLevel,
        estimatedHours: estimatedHours || 1,
        orderIndex: orderIndex || undefined,
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

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Update chapter error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    // Check admin access
    await requireAdmin();

    // Check if chapter has lessons
    const chapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    if (chapter._count.lessons > 0) {
      return NextResponse.json(
        { error: "Cannot delete chapter with existing lessons. Delete lessons first." },
        { status: 400 }
      );
    }

    // Delete the chapter
    await prisma.chapter.delete({
      where: { id: params.chapterId },
    });

    return NextResponse.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    console.error("Delete chapter error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
