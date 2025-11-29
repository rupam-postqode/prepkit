import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin();

    const { title, description, markdownContent, difficulty, chapterId } = await request.json();

    // Validate input
    if (!title || !description || !markdownContent || !difficulty || !chapterId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Get the highest order index for this chapter
    const lastLesson = await prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { orderIndex: 'desc' },
    });

    const orderIndex = lastLesson ? lastLesson.orderIndex + 1 : 1;

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        slug,
        description,
        markdownContent,
        difficulty,
        chapterId,
        orderIndex,
        publishedAt: new Date(), // Auto-publish for now
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Create lesson error:", error);
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

    const lessons = await prisma.lesson.findMany({
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
      orderBy: [
        { chapter: { module: { orderIndex: 'asc' } } },
        { chapter: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Get lessons error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
