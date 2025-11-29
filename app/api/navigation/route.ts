import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all published modules with chapters and lessons
    const modules = await prisma.module.findMany({
      include: {
        _count: {
          select: {
            chapters: true,
          },
        },
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              where: {
                publishedAt: { not: null }, // Only published lessons
              },
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    // Get user's lesson progress to mark completed lessons
    const userProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        completedAt: { not: null }, // Only completed lessons
      },
      select: {
        lessonId: true,
      },
    });

    const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

    // Add completion status to lessons
    const modulesWithProgress = modules.map(module => ({
      ...module,
      chapters: module.chapters.map(chapter => ({
        ...chapter,
        lessons: chapter.lessons.map(lesson => ({
          ...lesson,
          completed: completedLessonIds.has(lesson.id),
        })),
      })),
    }));

    return NextResponse.json(modulesWithProgress);
  } catch (error) {
    console.error("Navigation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
