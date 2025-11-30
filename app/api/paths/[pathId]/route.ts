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
        // Pause learning path
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
        // Resume learning path
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

      case "RESET_PATH":
        // Reset path progress to beginning
        // First, delete all lesson progress for this path
        const pathLessons = await prisma.pathLesson.findMany({
          where: { learningPathId: pathId },
          select: { lessonId: true }
        });

        if (pathLessons.length > 0) {
          await prisma.lessonProgress.deleteMany({
            where: {
              userId: session.user.id,
              lessonId: {
                in: pathLessons.map(pl => pl.lessonId)
              }
            }
          });
        }

        // Reset path progress to initial state
        updatedProgress = await prisma.userPathProgress.update({
          where: {
            userId_learningPathId: {
              userId: session.user.id,
              learningPathId: pathId,
            },
          },
          data: {
            currentWeek: 1,
            currentDay: 1,
            completedLessons: 0,
            completedAt: null,
            lastActivityAt: new Date(),
          },
        });

        // Log reset history
        await prisma.resetHistory.create({
          data: {
            userId: session.user.id,
            type: 'PATH',
            pathId: pathId,
            reason: 'User requested path reset',
            timestamp: new Date(),
          },
        });
        break;

      case "RESET_WEEK":
        // Reset progress for a specific week
        const { weekNumber: resetWeekNumber } = data;
        const weekLessons = await prisma.pathLesson.findMany({
          where: { 
            learningPathId: pathId,
            weekNumber: resetWeekNumber
          },
          select: { lessonId: true }
        });

        if (weekLessons.length > 0) {
          await prisma.lessonProgress.deleteMany({
            where: {
              userId: session.user.id,
              lessonId: {
                in: weekLessons.map(pl => pl.lessonId)
              }
            }
          });
        }

        // Update path progress to beginning of week
        updatedProgress = await prisma.userPathProgress.update({
          where: {
            userId_learningPathId: {
              userId: session.user.id,
              learningPathId: pathId,
            },
          },
          data: {
            currentWeek: resetWeekNumber,
            currentDay: 1,
            lastActivityAt: new Date(),
          },
        });

        // Log reset history
        await prisma.resetHistory.create({
          data: {
            userId: session.user.id,
            type: 'WEEK',
            pathId: pathId,
            weekNumber: resetWeekNumber,
            reason: 'User requested week reset',
            timestamp: new Date(),
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
