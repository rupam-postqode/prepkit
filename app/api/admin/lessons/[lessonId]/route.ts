import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    // Check admin access
    await requireAdmin();

    const { published } = await request.json();

    if (typeof published !== 'boolean') {
      return NextResponse.json(
        { error: "Published status must be a boolean" },
        { status: 400 }
      );
    }

    // Update the lesson
    const lesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: {
        publishedAt: published ? new Date() : null,
      },
      include: {
        chapter: {
          include: {
            module: true,
          },
        },
        _count: {
          select: {
            progress: true,
            practiceLinks: true,
          },
        },
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Update lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    // Check admin access
    await requireAdmin();

    // Check if lesson has progress records
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: {
        _count: {
          select: {
            progress: true,
            practiceLinks: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    if (lesson._count.progress > 0) {
      return NextResponse.json(
        { error: "Cannot delete lesson with existing student progress. Unpublish instead." },
        { status: 400 }
      );
    }

    // Delete practice links first (cascade delete should handle this, but being explicit)
    await prisma.practiceLink.deleteMany({
      where: { lessonId: params.lessonId },
    });

    // Delete the lesson
    await prisma.lesson.delete({
      where: { id: params.lessonId },
    });

    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Delete lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
