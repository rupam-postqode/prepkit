import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's active path progress
    const progress = await prisma.userPathProgress.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        learningPath: {
          include: {
            pathLessons: {
              where: {
                lesson: {
                  publishedAt: { not: null }, // Only published lessons
                },
              },
              include: {
                lesson: {
                  include: {
                    chapter: {
                      include: {
                        module: true,
                      },
                    },
                    progress: {
                      where: {
                        userId,
                        completedAt: { not: null },
                      },
                    },
                  },
                },
              },
              orderBy: [
                { weekNumber: "asc" },
                { dayNumber: "asc" },
                { orderIndex: "asc" },
              ],
            },
          },
        },
      },
    });

    if (!progress) {
      return NextResponse.json({
        enrolled: false,
        message: "No active learning path found",
      });
    }

    // Calculate progress statistics
    const totalLessons = progress.learningPath.pathLessons.length;
    const completedLessons = progress.learningPath.pathLessons.filter(
      (pl) => pl.lesson.progress.length > 0
    ).length;

    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Group lessons by week
    const lessonsByWeek = progress.learningPath.pathLessons.reduce((acc, pathLesson) => {
      const weekKey = `Week ${pathLesson.weekNumber}`;
      if (!acc[weekKey]) {
        acc[weekKey] = [];
      }
      acc[weekKey].push({
        id: pathLesson.lesson.id,
        title: pathLesson.lesson.title,
        description: pathLesson.lesson.description,
        completed: pathLesson.lesson.progress.length > 0,
        dayNumber: pathLesson.dayNumber,
        estimatedHours: pathLesson.estimatedHours,
        module: pathLesson.lesson.chapter.module.title,
        difficulty: pathLesson.lesson.difficulty,
      });
      return acc;
    }, {} as Record<string, Array<{
      id: string;
      title: string;
      description: string;
      completed: boolean;
      dayNumber: number;
      estimatedHours: number;
      module: string;
      difficulty: string;
    }>>);

    return NextResponse.json({
      enrolled: true,
      path: {
        id: progress.learningPath.id,
        title: progress.learningPath.title,
        description: progress.learningPath.description,
        emoji: progress.learningPath.emoji,
        durationWeeks: progress.learningPath.durationWeeks,
        difficulty: progress.learningPath.difficulty,
        targetCompanies: progress.learningPath.targetCompanies,
      },
      progress: {
        currentWeek: progress.currentWeek,
        currentDay: progress.currentDay,
        completedLessons,
        totalLessons,
        progressPercentage: Math.round(progressPercentage),
        startedAt: progress.startedAt,
        lastActivityAt: progress.lastActivityAt,
      },
      lessonsByWeek,
    });
  } catch (error) {
    console.error("Error fetching user path progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
