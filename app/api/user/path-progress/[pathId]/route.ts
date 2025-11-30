import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pathId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pathId } = await params;
    const userId = session.user.id;

    // Get user's path progress with detailed information
    const pathProgress = await prisma.userPathProgress.findUnique({
      where: {
        userId_learningPathId: {
          userId,
          learningPathId: pathId,
        },
      },
      include: {
        learningPath: {
          include: {
            pathLessons: {
              where: {
                lesson: {
                  publishedAt: { not: null },
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

    if (!pathProgress) {
      return NextResponse.json(
        { error: "Not enrolled in this path" },
        { status: 404 }
      );
    }

    // Calculate detailed progress statistics
    const totalLessons = pathProgress.learningPath.pathLessons.length;
    const completedLessons = pathProgress.learningPath.pathLessons.filter(
      (pl) => pl.lesson.progress.length > 0
    ).length;

    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Calculate study streak
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        updatedAt: { gte: sevenDaysAgo },
        completedAt: { not: null },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const uniqueStudyDays = new Set(
      recentProgress.map(p => p.updatedAt.toDateString())
    ).size;

    const studyStreak = calculateStudyStreak(recentProgress);

    // Calculate total study time
    const allLessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lesson: {
          pathLessons: {
            some: {
              learningPathId: pathId,
            },
          },
        },
      },
    });

    const totalStudyTime = allLessonProgress.reduce((acc, p) => acc + p.timeSpentSeconds, 0);

    // Calculate weekly progress
    const weeklyProgress = calculateWeeklyProgress(pathProgress.learningPath.pathLessons);

    // Get learning velocity (lessons per day)
    const daysSinceStart = Math.max(1, Math.ceil(
      (new Date().getTime() - pathProgress.startedAt.getTime()) / (1000 * 60 * 60 * 24)
    ));
    const learningVelocity = completedLessons / daysSinceStart;

    // Calculate estimated completion date
    const estimatedDaysRemaining = Math.ceil((totalLessons - completedLessons) / Math.max(0.1, learningVelocity));
    const estimatedCompletionDate = new Date();
    estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + estimatedDaysRemaining);

    // Get current week lessons
    const currentWeekLessons = pathProgress.learningPath.pathLessons.filter(
      pl => pl.weekNumber === pathProgress.currentWeek
    );

    // Get next upcoming lesson
    const nextLesson = findNextLesson(pathProgress.learningPath.pathLessons, pathProgress);

    return NextResponse.json({
      // Basic progress info
      currentWeek: pathProgress.currentWeek,
      currentDay: pathProgress.currentDay,
      completedLessons,
      totalLessons,
      progressPercentage: Math.round(progressPercentage),
      startedAt: pathProgress.startedAt,
      lastActivityAt: pathProgress.lastActivityAt,
      completedAt: pathProgress.completedAt,
      isActive: pathProgress.isActive,

      // Enhanced analytics
      studyStreak,
      totalStudyTime,
      learningVelocity: Math.round(learningVelocity * 10) / 10,
      estimatedCompletionDate,
      weeklyProgress,

      // Current week info
      currentWeekLessons: currentWeekLessons.length,
      currentWeekCompleted: currentWeekLessons.filter(
        pl => pl.lesson.progress.length > 0
      ).length,

      // Next lesson
      nextLesson,

      // Path info
      path: {
        id: pathProgress.learningPath.id,
        title: pathProgress.learningPath.title,
        description: pathProgress.learningPath.description,
        emoji: pathProgress.learningPath.emoji,
        durationWeeks: pathProgress.learningPath.durationWeeks,
        difficulty: pathProgress.learningPath.difficulty,
        targetCompanies: pathProgress.learningPath.targetCompanies,
      },

      // Performance metrics
      performanceMetrics: {
        averageTimePerLesson: totalStudyTime / Math.max(1, completedLessons),
        onTrackPace: learningVelocity >= (totalLessons / (pathProgress.learningPath.durationWeeks * 7)),
        consistencyScore: Math.min(100, (uniqueStudyDays / 7) * 100),
      },
    });
  } catch (error) {
    console.error("Error fetching user path progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

  function calculateStudyStreak(progress: Array<{ updatedAt: Date }>): number {
    if (progress.length === 0) return 0;

    const sortedDates = progress
      .map(p => p.updatedAt.toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const uniqueDates = [...new Set(sortedDates)];
    let streak = 0;

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);

      if (currentDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  function calculateWeeklyProgress(pathLessons: Array<{
    weekNumber: number;
    lesson: { progress: Array<unknown> };
  }>): Array<{ week: number; total: number; completed: number; percentage: number }> {
  const weeklyData: { [key: number]: { total: number; completed: number } } = {};

  pathLessons.forEach(pathLesson => {
    const week = pathLesson.weekNumber;
    if (!weeklyData[week]) {
      weeklyData[week] = { total: 0, completed: 0 };
    }
    weeklyData[week].total++;
    if (pathLesson.lesson.progress.length > 0) {
      weeklyData[week].completed++;
    }
  });

  return Object.entries(weeklyData).map(([week, data]) => ({
    week: parseInt(week),
    total: data.total,
    completed: data.completed,
    percentage: Math.round((data.completed / data.total) * 100),
  }));
}

  function findNextLesson(pathLessons: Array<{
    weekNumber: number;
    dayNumber: number;
    estimatedHours: number;
    lesson: {
      id: string;
      title: string;
      progress: Array<unknown>;
      chapter: {
        module: {
          title: string;
        };
      };
    };
  }>, userProgress: { currentWeek: number; currentDay: number }): {
    id: string;
    title: string;
    weekNumber: number;
    dayNumber: number;
    estimatedHours: number;
    module: string;
  } | null {
    // Find the first lesson that hasn't been completed
    for (const pathLesson of pathLessons) {
      if (pathLesson.lesson.progress.length === 0) {
        return {
          id: pathLesson.lesson.id,
          title: pathLesson.lesson.title,
          weekNumber: pathLesson.weekNumber,
          dayNumber: pathLesson.dayNumber,
          estimatedHours: pathLesson.estimatedHours,
          module: pathLesson.lesson.chapter.module.title,
        };
      }
    }
    return null;
  }

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pathId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pathId } = await params;
    const { action, data } = await request.json();
    const userId = session.user.id;

    switch (action) {
      case "UPDATE_WEEKLY_GOAL":
        // Update user's weekly study goal
        const { weeklyGoal } = data;
        await prisma.user.update({
          where: { id: userId },
          data: {
            // Assuming we add a weeklyGoal field to the User model
            // For now, we'll store it in a user preference or settings table
          },
        });
        return NextResponse.json({ success: true });

      case "LOG_STUDY_SESSION":
        // Log a study session
        const { lessonsCompleted, timeSpentMinutes, focusAreas } = data;
        // This would create a study session record
        // For now, return success
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error updating path progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
