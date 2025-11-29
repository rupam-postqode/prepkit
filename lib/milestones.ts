import { prisma } from './db';

export interface MilestoneCheck {
  userId: string;
  pathId?: string;
  type: 'lesson_completed' | 'streak_updated' | 'week_completed' | 'path_completed';
  data?: Record<string, unknown>;
}

export interface AchievementResult {
  unlocked: boolean;
  milestone?: {
    id: string;
    title: string;
    description: string;
    emoji: string;
  };
}

// Check for new achievements when user actions occur
export async function checkMilestones({ userId, pathId, type, data }: MilestoneCheck): Promise<AchievementResult[]> {
  const achievements: AchievementResult[] = [];

  try {
    // Get all active milestones
    const milestones = await prisma.milestone.findMany({
      where: { isActive: true },
    });

    for (const milestone of milestones) {
      // Check if user already has this achievement
      const existingAchievement = await prisma.achievement.findUnique({
        where: {
          userId_milestoneId: {
            userId,
            milestoneId: milestone.id,
          },
        },
      });

      if (existingAchievement) continue; // Already unlocked

      // Check if milestone conditions are met
      const shouldUnlock = await checkMilestoneCondition(milestone, userId, pathId, type, data);

      if (shouldUnlock) {
        // Create achievement
        await prisma.achievement.create({
          data: {
            userId,
            milestoneId: milestone.id,
            pathId: pathId || null,
          },
        });

        achievements.push({
          unlocked: true,
          milestone: {
            id: milestone.id,
            title: milestone.title,
            description: milestone.description,
            emoji: milestone.emoji,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error checking milestones:', error);
  }

  return achievements;
}

// Check if a specific milestone condition is met
async function checkMilestoneCondition(
  milestone: { id: string; type: string; threshold: number },
  userId: string,
  pathId: string | undefined,
  type: string,
  data: Record<string, unknown> | undefined
): Promise<boolean> {
  switch (milestone.type) {
    case 'FIRST_LESSON':
      if (type === 'lesson_completed') {
        // Check if this is the user's first completed lesson
        const completedCount = await prisma.lessonProgress.count({
          where: {
            userId,
            completedAt: { not: null },
          },
        });
        return completedCount === 1; // Just completed their first lesson
      }
      break;

    case 'LESSONS_COMPLETED':
      if (type === 'lesson_completed') {
        // Check total completed lessons
        const completedCount = await prisma.lessonProgress.count({
          where: {
            userId,
            completedAt: { not: null },
          },
        });
        return completedCount >= milestone.threshold;
      }
      break;

    case 'CONSECUTIVE_DAYS':
      if (type === 'streak_updated') {
        // Check current streak
        const streak = await calculateCurrentStreak(userId);
        return streak >= milestone.threshold;
      }
      break;

    case 'WEEK_COMPLETED':
      if (type === 'week_completed' && pathId) {
        // Check if user completed all lessons in a week
        const pathProgress = await prisma.userPathProgress.findFirst({
          where: { userId, learningPathId: pathId },
        });

        if (pathProgress) {
          const weekLessons = await prisma.pathLesson.count({
            where: {
              learningPathId: pathId,
              weekNumber: pathProgress.currentWeek,
            },
          });

          const completedWeekLessons = await prisma.lessonProgress.count({
            where: {
              userId,
              completedAt: { not: null },
              lesson: {
                pathLessons: {
                  some: {
                    learningPathId: pathId,
                    weekNumber: pathProgress.currentWeek,
                  },
                },
              },
            },
          });

          return completedWeekLessons >= weekLessons;
        }
      }
      break;

    case 'PATH_COMPLETED':
      if (type === 'path_completed' && pathId) {
        // Check if user completed entire path
        const pathProgress = await prisma.userPathProgress.findFirst({
          where: { userId, learningPathId: pathId },
        });
        return pathProgress?.completedAt !== null;
      }
      break;

    case 'SPEED_LEARNER':
      if (type === 'lesson_completed' && data?.lessonsToday && typeof data.lessonsToday === 'number') {
        // Check if user completed multiple lessons in one day
        return data.lessonsToday >= milestone.threshold;
      }
      break;
  }

  return false;
}

// Calculate current study streak for a user
export async function calculateCurrentStreak(userId: string): Promise<number> {
  const activities = await prisma.lessonProgress.findMany({
    where: { userId },
    select: { updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  if (activities.length === 0) return 0;

  const uniqueDays = [...new Set(
    activities.map(a => a.updatedAt.toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  // Check if user studied today or yesterday
  if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
    streak = 1;

    // Count consecutive days
    for (let i = 1; i < uniqueDays.length; i++) {
      const currentDay = new Date(uniqueDays[i - 1]);
      const previousDay = new Date(uniqueDays[i]);
      const diffTime = currentDay.getTime() - previousDay.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
}

// Get user's achievements
export async function getUserAchievements(userId: string) {
  return await prisma.achievement.findMany({
    where: { userId },
    include: {
      milestone: true,
    },
    orderBy: { unlockedAt: 'desc' },
  });
}

// Create default milestones
export async function createDefaultMilestones() {
  const milestones = [
    {
      title: "First Steps",
      description: "Completed your first lesson",
      emoji: "👶",
      type: "FIRST_LESSON" as const,
      threshold: 1,
    },
    {
      title: "Getting Started",
      description: "Completed 5 lessons",
      emoji: "🌱",
      type: "LESSONS_COMPLETED" as const,
      threshold: 5,
    },
    {
      title: "Dedicated Learner",
      description: "Completed 25 lessons",
      emoji: "📚",
      type: "LESSONS_COMPLETED" as const,
      threshold: 25,
    },
    {
      title: "Interview Ready",
      description: "Completed 50 lessons",
      emoji: "🎯",
      type: "LESSONS_COMPLETED" as const,
      threshold: 50,
    },
    {
      title: "Consistency Champion",
      description: "Maintained a 7-day study streak",
      emoji: "🔥",
      type: "CONSECUTIVE_DAYS" as const,
      threshold: 7,
    },
    {
      title: "Week Warrior",
      description: "Completed all lessons in a week",
      emoji: "⚔️",
      type: "WEEK_COMPLETED" as const,
      threshold: 1,
    },
    {
      title: "Path Complete",
      description: "Finished an entire learning path",
      emoji: "🏆",
      type: "PATH_COMPLETED" as const,
      threshold: 1,
    },
    {
      title: "Speed Demon",
      description: "Completed 3 lessons in one day",
      emoji: "⚡",
      type: "SPEED_LEARNER" as const,
      threshold: 3,
    },
  ];

  // Check if milestones already exist
  const existingCount = await prisma.milestone.count();
  if (existingCount > 0) {
    return; // Already seeded
  }

  // Create milestones
  await prisma.milestone.createMany({
    data: milestones,
  });
}
