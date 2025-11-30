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
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');

    // Get study sessions for the last N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get lesson progress data to create study sessions
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        OR: [
          { updatedAt: { gte: startDate } },
          { completedAt: { gte: startDate } },
        ],
      },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                module: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Group lesson progress by date to create study sessions
    const sessionsByDate = lessonProgress.reduce((acc, progress) => {
      const date = progress.updatedAt.toDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          lessonsCompleted: 0,
          timeSpentMinutes: 0,
          focusAreas: [] as string[],
        };
      }

      acc[date].timeSpentMinutes += Math.round(progress.timeSpentSeconds / 60);
      
      if (progress.completedAt) {
        acc[date].lessonsCompleted++;
        
        // Add focus area (module title)
        const moduleTitle = progress.lesson.chapter.module.title;
        if (!acc[date].focusAreas.includes(moduleTitle)) {
          acc[date].focusAreas.push(moduleTitle);
        }
      }

      return acc;
    }, {} as Record<string, {
      date: string;
      lessonsCompleted: number;
      timeSpentMinutes: number;
      focusAreas: string[];
    }>);

    // Convert to array and sort by date
    const sessions = Object.values(sessionsByDate).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate analytics
    const totalLessonsCompleted = sessions.reduce((sum, session) => sum + session.lessonsCompleted, 0);
    const totalStudyTime = sessions.reduce((sum, session) => sum + session.timeSpentMinutes, 0);
    const averageStudyTime = sessions.length > 0 ? Math.round(totalStudyTime / sessions.length) : 0;

    // Calculate study streak
    const studyStreak = calculateStudyStreak(sessions);

    // Get most recent focus areas
    const recentFocusAreas = sessions
      .slice(0, 7)
      .flatMap(session => session.focusAreas)
      .reduce((acc, area) => {
        acc[area] = (acc[area] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topFocusAreas = Object.entries(recentFocusAreas)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([area]) => area);

    return NextResponse.json({
      sessions,
      analytics: {
        totalLessonsCompleted,
        totalStudyTime,
        averageStudyTime,
        studyStreak,
        totalStudyDays: sessions.length,
        topFocusAreas,
      },
    });
  } catch (error) {
    console.error("Error fetching study sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { action, data } = await request.json();

    switch (action) {
      case "LOG_STUDY_SESSION":
        // This would be used if we have a separate study sessions table
        // For now, we update lesson progress directly
        const { lessonId, timeSpentMinutes, completed } = data;

        const updatedProgress = await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: {
              userId,
              lessonId,
            },
          },
          update: {
            timeSpentSeconds: {
              increment: timeSpentMinutes * 60,
            },
            ...(completed && {
              completedAt: new Date(),
              markdownRead: true,
              videoWatchedPercent: 100,
            }),
            updatedAt: new Date(),
          },
          create: {
            userId,
            lessonId,
            timeSpentSeconds: timeSpentMinutes * 60,
            ...(completed && {
              completedAt: new Date(),
              markdownRead: true,
              videoWatchedPercent: 100,
            }),
          },
        });

        // Check for new achievements after completing a lesson
        if (completed) {
          try {
            await fetch(`${process.env.NEXTAUTH_URL}/api/user/achievements`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ action: 'CHECK_ACHIEVEMENTS' }),
            });
          } catch (error) {
            console.error("Error checking achievements:", error);
          }
        }

        return NextResponse.json({
          success: true,
          progress: updatedProgress,
        });

      case "SET_WEEKLY_GOAL":
        // Update user's weekly study goal
        const { weeklyGoal } = data;
        
        // For now, we'll store this in a user settings approach
        // In a real implementation, you might have a UserSettings table
        return NextResponse.json({
          success: true,
          weeklyGoal,
        });

      case "UPDATE_STUDY_PREFERENCES":
        // Update study preferences
        const { preferences } = data;
        
        // Store study preferences
        // This could include preferred study times, notification settings, etc.
        return NextResponse.json({
          success: true,
          preferences,
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in study sessions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateStudyStreak(sessions: Array<{ date: string; lessonsCompleted: number }>): number {
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions
    .filter(session => session.lessonsCompleted > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  const today = new Date().toDateString();

  for (let i = 0; i < sortedSessions.length; i++) {
    const sessionDate = new Date(sortedSessions[i].date).toDateString();
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);

    if (sessionDate === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
