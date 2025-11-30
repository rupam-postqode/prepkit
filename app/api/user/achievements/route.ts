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

    // Get user's achievements
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      include: {
        milestone: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    // Get available milestones that user hasn't achieved yet
    const availableMilestones = await prisma.milestone.findMany({
      where: {
        isActive: true,
        achievements: {
          none: {
            userId,
          },
        },
      },
      orderBy: { type: 'asc' },
    });

    // Check for any new achievements to unlock
    const newAchievements = await checkAndUnlockAchievements(userId, availableMilestones);

    // Get all achievements including newly unlocked ones
    const allAchievements = [...achievements, ...newAchievements];

    return NextResponse.json({
      achievements: allAchievements.map(achievement => ({
        id: achievement.id,
        title: achievement.milestone.title,
        description: achievement.milestone.description,
        emoji: achievement.milestone.emoji,
        unlockedAt: achievement.unlockedAt,
        category: achievement.milestone.type,
        milestoneId: achievement.milestoneId,
      })),
      totalAchievements: allAchievements.length,
      availableMilestones: availableMilestones.length,
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

  async function checkAndUnlockAchievements(
    userId: string,
    availableMilestones: Array<{
      id: string;
      type: string;
      threshold: number;
    }>
  ): Promise<Array<{
    id: string;
    milestoneId: string;
    milestone: {
      title: string;
      description: string;
      emoji: string;
      type: string;
    };
    unlockedAt: Date;
  }>> {
  const newAchievements = [];

  for (const milestone of availableMilestones) {
    let shouldUnlock = false;

    switch (milestone.type) {
      case "LESSONS_COMPLETED":
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            userId,
            completedAt: { not: null },
          },
        });
        shouldUnlock = completedLessons >= milestone.threshold;
        break;

      case "CONSECUTIVE_DAYS":
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

        const studyStreak = calculateStudyStreak(recentProgress);
        shouldUnlock = studyStreak >= milestone.threshold;
        break;

      case "FIRST_LESSON":
        const firstLessonCompleted = await prisma.lessonProgress.findFirst({
          where: {
            userId,
            completedAt: { not: null },
          },
        });
        shouldUnlock = !!firstLessonCompleted;
        break;

      case "WEEK_COMPLETED":
        // Check if user completed a full week in any learning path
        const pathProgress = await prisma.userPathProgress.findFirst({
          where: { userId },
          include: {
            learningPath: {
              include: {
                pathLessons: {
                  include: {
                    lesson: {
                      include: {
                        progress: {
                          where: {
                            userId,
                            completedAt: { not: null },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (pathProgress) {
          for (let week = 1; week <= pathProgress.learningPath.durationWeeks; week++) {
            const weekLessons = pathProgress.learningPath.pathLessons.filter(
              pl => pl.weekNumber === week
            );
            const completedWeekLessons = weekLessons.filter(
              pl => pl.lesson.progress.length > 0
            );

            if (completedWeekLessons.length === weekLessons.length) {
              shouldUnlock = true;
              break;
            }
          }
        }
        break;

      case "PATH_COMPLETED":
        const completedPath = await prisma.userPathProgress.findFirst({
          where: {
            userId,
            completedAt: { not: null },
          },
        });
        shouldUnlock = !!completedPath;
        break;

      case "SPEED_LEARNER":
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const lessonsCompletedToday = await prisma.lessonProgress.count({
          where: {
            userId,
            completedAt: {
              gte: startOfDay,
              lt: endOfDay,
            },
          },
        });
        shouldUnlock = lessonsCompletedToday >= milestone.threshold;
        break;

      case "STREAK_MAINTAINED":
        const longStreakProgress = await prisma.lessonProgress.findMany({
          where: {
            userId,
            completedAt: { not: null },
          },
          orderBy: { completedAt: 'desc' },
          take: milestone.threshold * 2, // Get enough days to check streak
        });

        const longStreak = calculateStudyStreak(longStreakProgress);
        shouldUnlock = longStreak >= milestone.threshold;
        break;

      default:
        shouldUnlock = false;
    }

    if (shouldUnlock) {
      const newAchievement = await prisma.achievement.create({
        data: {
          userId,
          milestoneId: milestone.id,
        },
        include: {
          milestone: true,
        },
      });

      newAchievements.push(newAchievement);
    }
  }

  return newAchievements;
}

function calculateStudyStreak(progress: Array<{ updatedAt: Date; completedAt?: Date | null }>): number {
  if (progress.length === 0) return 0;

  const sortedDates = progress
    .filter(p => p.completedAt) // Only count completed lessons
    .map(p => p.completedAt!.toDateString())
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    switch (action) {
      case "CHECK_ACHIEVEMENTS":
        // Manually trigger achievement check (e.g., after completing a lesson)
        const availableMilestones = await prisma.milestone.findMany({
          where: {
            isActive: true,
            achievements: {
              none: {
                userId: session.user.id,
              },
            },
          },
        });

        const newAchievements = await checkAndUnlockAchievements(
          session.user.id,
          availableMilestones
        );

        return NextResponse.json({
          newAchievements: newAchievements.map(achievement => ({
            id: achievement.id,
            title: achievement.milestone.title,
            description: achievement.milestone.description,
            emoji: achievement.milestone.emoji,
            unlockedAt: achievement.unlockedAt,
            category: achievement.milestone.type,
          })),
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in achievements API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
