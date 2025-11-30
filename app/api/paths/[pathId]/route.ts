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

    // Get learning path with all lessons
    const learningPath = await prisma.learningPath.findUnique({
      where: { 
        id: pathId,
        isActive: true 
      },
      include: {
        pathLessons: {
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
                    userId: session.user.id,
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
    });

    if (!learningPath) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(learningPath);
  } catch (error) {
    console.error("Error fetching learning path:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Get user's progress for this path
    const userProgress = await prisma.userPathProgress.findUnique({
      where: {
        userId_learningPathId: {
          userId: session.user.id,
          learningPathId: pathId,
        },
      },
    });

    if (!userProgress) {
      return NextResponse.json(
        { error: "Not enrolled in this path" },
        { status: 400 }
      );
    }

    let updatedProgress;

    switch (action) {
      case "UPDATE_WEEK_DAY":
        // Update current week and day
        const { weekNumber, dayNumber } = data;
        updatedProgress = await prisma.userPathProgress.update({
          where: {
            userId_learningPathId: {
              userId: session.user.id,
              learningPathId: pathId,
            },
          },
          data: {
            currentWeek: weekNumber,
            currentDay: dayNumber,
            lastActivityAt: new Date(),
          },
        });
        break;

      case "PAUSE_PATH":
        // Pause the learning path
        updatedProgress = await prisma.userPathProgress.update({
          where: {
            userId_learningPathId: {
              userId: session.user.id,
              learningPathId: pathId,
            },
          },
          data: {
            isActive: false,
          },
        });
        break;

      case "RESUME_PATH":
        // Resume the learning path
        updatedProgress = await prisma.userPathProgress.update({
          where: {
            userId_learningPathId: {
              userId: session.user.id,
              learningPathId: pathId,
            },
          },
          data: {
            isActive: true,
            lastActivityAt: new Date(),
          },
        });
        break;

      case "COMPLETE_PATH":
        // Mark path as completed
        updatedProgress = await prisma.userPathProgress.update({
          where: {
            userId_learningPathId: {
              userId: session.user.id,
              learningPathId: pathId,
            },
          },
          data: {
            completedAt: new Date(),
            currentWeek: 999, // Signal completion
            lastActivityAt: new Date(),
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error("Error updating path progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
