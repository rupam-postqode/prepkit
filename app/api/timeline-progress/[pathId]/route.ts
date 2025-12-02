import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PathType } from "@prisma/client";

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

    // Get user's progress for this path
    const userProgress = await prisma.userPathProgress.findFirst({
      where: {
        userId: session.user.id,
        learningPathId: pathId,
        isActive: true,
      },
      include: {
        learningPath: {
          include: {
            pathLessons: {
              include: {
                lesson: true,
              },
              orderBy: {
                orderIndex: "asc",
              },
            },
          },
        },
        studySessions: {
          orderBy: {
            startTime: "desc",
          },
          take: 10,
        },
        timelineAlerts: {
          where: {
            isRead: false,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!userProgress) {
      return NextResponse.json(
        { error: "Progress not found for this path" },
        { status: 404 }
      );
    }

    // Calculate timeline-specific metrics
    const timelineProgress = calculateTimelineProgress({
      targetInterviewDate: userProgress.targetInterviewDate,
      startedAt: userProgress.startedAt,
      completedLessons: userProgress.completedLessons,
      totalLessons: userProgress.totalLessons,
      studyStreak: userProgress.studyStreak,
      longestStreak: userProgress.longestStreak,
      weeklyGoals: userProgress.weeklyGoals as Record<string, unknown> | null,
    });

    // Get upcoming milestones
    const upcomingMilestones = await prisma.timelineMilestone.findMany({
      where: {
        learningPathId: pathId,
        targetDate: {
          gte: new Date(),
        },
        isActive: true,
      },
      orderBy: {
        targetDate: "asc",
      },
      take: 3,
    });

    // Get recent study sessions with effectiveness data
    const recentSessions = await prisma.studySession.findMany({
      where: {
        userPathProgressId: userProgress.id,
      },
      orderBy: {
        startTime: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      progress: userProgress,
      timelineMetrics: timelineProgress,
      upcomingMilestones,
      recentSessions,
    });
  } catch (error) {
    console.error("Error fetching timeline progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
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

    // Get user's progress
    const userProgress = await prisma.userPathProgress.findFirst({
      where: {
        userId: session.user.id,
        learningPathId: pathId,
        isActive: true,
      },
    });

    if (!userProgress) {
      return NextResponse.json(
        { error: "Progress not found for this path" },
        { status: 404 }
      );
    }

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case "update_progress":
        updateData = {
          currentWeek: data.currentWeek || userProgress.currentWeek,
          currentDay: data.currentDay || userProgress.currentDay,
          completedLessons: data.completedLessons || userProgress.completedLessons,
          lastActivityAt: new Date(),
        };
        break;

      case "record_study_session":
        // Create a new study session
        const studySession = await prisma.studySession.create({
          data: {
            userId: session.user.id,
            userPathProgressId: userProgress.id,
            startTime: data.startTime ? new Date(data.startTime) : new Date(),
            endTime: data.endTime ? new Date(data.endTime) : new Date(),
            lessonsStudied: data.lessonsStudied || '',
            topicsCovered: data.topicsCovered || '',
            timeSpent: data.timeSpent || 0,
            focusScore: data.focusScore || 0,
            comprehensionScore: data.comprehensionScore || 0,
            effectiveness: data.effectiveness || 0,
          },
        });

        // Update streak if session was productive
        if (data.effectiveness && data.effectiveness > 70) {
          const currentStreak = userProgress.studyStreak + 1;
          updateData.studyStreak = currentStreak;
          updateData.longestStreak = Math.max(currentStreak, userProgress.longestStreak);
        }

        return NextResponse.json({
          success: true,
          studySession,
        });

      case "adjust_pace":
        // Create a pace adjustment record
        await prisma.paceAdjustment.create({
          data: {
            userPathProgressId: userProgress.id,
            adjustmentType: data.adjustmentType,
            oldPace: data.oldPace,
            newPace: data.newPace,
            reason: data.reason,
            impact: data.impact,
            automatic: data.automatic || false,
          },
        });

        // Update weekly goals
        updateData.weeklyGoals = {
          ...(userProgress.weeklyGoals as Record<string, unknown> || {}),
          targetHoursPerDay: data.newPace,
        };
        break;

      case "complete_milestone":
        const milestoneId = data.milestoneId;
        if (milestoneId) {
          // Update completed milestones
          const completedMilestones = userProgress.completedMilestones 
            ? `${userProgress.completedMilestones},${milestoneId}`
            : milestoneId;
          
          updateData.completedMilestones = completedMilestones;

          // Create achievement if milestone is completed
          await prisma.achievement.create({
            data: {
              userId: session.user.id,
              milestoneId,
              pathId,
            },
          });
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    // Update progress if there's data to update
    if (Object.keys(updateData).length > 0) {
      await prisma.userPathProgress.update({
        where: {
          id: userProgress.id,
        },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Timeline progress updated successfully",
    });
  } catch (error) {
    console.error("Error updating timeline progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateTimelineProgress(userProgress: {
  targetInterviewDate: Date | null;
  startedAt: Date;
  completedLessons: number;
  totalLessons: number;
  studyStreak: number;
  longestStreak: number;
  weeklyGoals: Record<string, unknown> | null;
}) {
  const today = new Date();
  const targetDate = userProgress.targetInterviewDate;
  const startedDate = userProgress.startedAt;
  
  // Calculate days elapsed and remaining
  const totalDays = targetDate 
    ? Math.ceil((targetDate.getTime() - startedDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const daysElapsed = Math.ceil((today.getTime() - startedDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = targetDate 
    ? Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculate progress percentage based on lessons
  const progressPercentage = userProgress.totalLessons > 0 
    ? (userProgress.completedLessons / userProgress.totalLessons) * 100 
    : 0;

  // Determine if user is on track
  const expectedProgress = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;
  const isOnTrack = progressPercentage >= expectedProgress - 5; // 5% tolerance

  // Calculate risk level
  let riskLevel = "LOW";
  if (progressPercentage < expectedProgress - 15) {
    riskLevel = "HIGH";
  } else if (progressPercentage < expectedProgress - 5) {
    riskLevel = "MEDIUM";
  }

  // Calculate completion probability
  let completionProbability = 100;
  if (daysRemaining > 0) {
    const requiredDailyProgress = (100 - progressPercentage) / daysRemaining;
    const currentDailyProgress = progressPercentage / Math.max(daysElapsed, 1);
    completionProbability = Math.min(100, (currentDailyProgress / requiredDailyProgress) * 100);
  }

  // Calculate buffer days
  const bufferDays = Math.max(0, daysRemaining - Math.ceil((100 - progressPercentage) / Math.max(progressPercentage / Math.max(daysElapsed, 1), 1)));

  return {
    totalDays,
    daysElapsed,
    daysRemaining,
    progressPercentage: Math.round(progressPercentage),
    expectedProgress: Math.round(expectedProgress),
    isOnTrack,
    riskLevel,
    completionProbability: Math.round(completionProbability),
    bufferDays,
    studyStreak: userProgress.studyStreak,
    longestStreak: userProgress.longestStreak,
    paceStatus: isOnTrack ? "ON_TRACK" : "BEHIND_SCHEDULE",
  };
}