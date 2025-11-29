import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkMilestones, type AchievementResult } from "@/lib/milestones";

export async function POST(request: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { completed, timeSpentSeconds } = await request.json();
    const { lessonId } = await params;

    const userId = session.user?.id || "";

    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completedAt: completed ? new Date() : null,
        timeSpentSeconds: timeSpentSeconds || 0,
        updatedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completedAt: completed ? new Date() : null,
        timeSpentSeconds: timeSpentSeconds || 0,
      },
    });

    // Check for milestone achievements if lesson was just completed
    let achievements: AchievementResult[] = [];
    if (completed && progress.completedAt) {
      // Get user's active path for path-specific milestones
      const userPath = await prisma.userPathProgress.findFirst({
        where: { userId, isActive: true },
      });

      // Count lessons completed today for speed learner milestone
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const lessonsToday = await prisma.lessonProgress.count({
        where: {
          userId,
          completedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      achievements = await checkMilestones({
        userId,
        pathId: userPath?.learningPathId,
        type: 'lesson_completed',
        data: { lessonsToday },
      });
    }

    return NextResponse.json({
      progress,
      achievements,
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { lessonId } = await params;

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user?.id || "",
          lessonId,
        },
      },
    });

    return NextResponse.json(progress || {
      userId: session.user?.id,
      lessonId,
      timeSpentSeconds: 0,
      videoWatchedPercent: 0,
      completedAt: null,
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
