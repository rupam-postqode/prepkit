import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PathType, MasteryLevel } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      fromPathId, 
      toPathId, 
      preserveProgress = true,
      interviewDate,
      reason 
    } = await request.json();

    if (!fromPathId || !toPathId) {
      return NextResponse.json(
        { error: "Both fromPathId and toPathId are required" },
        { status: 400 }
      );
    }

    // Get current path progress
    const currentProgress = await prisma.userPathProgress.findFirst({
      where: {
        userId: session.user.id,
        learningPathId: fromPathId,
        isActive: true,
      },
      include: {
        learningPath: {
          include: {
            pathLessons: {
              include: {
                lesson: true,
              },
            },
          },
        },
      },
    });

    if (!currentProgress) {
      return NextResponse.json(
        { error: "Current path progress not found" },
        { status: 404 }
      );
    }

    // Get target path details
    const targetPath = await prisma.learningPath.findUnique({
      where: { id: toPathId },
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
    });

    if (!targetPath) {
      return NextResponse.json(
        { error: "Target path not found" },
        { status: 404 }
      );
    }

    // Start transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Deactivate current path
      await tx.userPathProgress.update({
        where: {
          id: currentProgress.id,
        },
        data: {
          isActive: false,
        },
      });

      // Map completed lessons from old path to new path
      let mappedProgress = {
        completedLessons: 0,
        currentWeek: 1,
        currentDay: 1,
        completedLessonsList: [] as string[],
      };

      if (preserveProgress) {
        mappedProgress = await mapProgressBetweenPaths(
          currentProgress,
          targetPath,
          tx
        );
      }

      // Create new progress entry
      const newProgress = await tx.userPathProgress.create({
        data: {
          userId: session.user.id,
          learningPathId: toPathId,
          currentWeek: mappedProgress.currentWeek,
          currentDay: mappedProgress.currentDay,
          completedLessons: mappedProgress.completedLessons,
          totalLessons: targetPath.pathLessons.length,
          completedMilestones: mappedProgress.completedLessonsList.join(','),
          targetInterviewDate: interviewDate ? new Date(interviewDate) : null,
          originalTargetDate: interviewDate ? new Date(interviewDate) : null,
          weeklyGoals: {
            targetHoursPerDay: targetPath.estimatedHoursPerDay,
            daysPerWeek: getDaysPerWeek(targetPath.pathType),
            intensityLevel: targetPath.intensityLevel,
          },
          isActive: true,
        },
        include: {
          learningPath: true,
        },
      });

      // Record the path switch
      await tx.resetHistory.create({
        data: {
          userId: session.user.id,
          type: "PATH",
          pathId: fromPathId,
          reason: reason || `Switched from path ${fromPathId} to ${toPathId}`,
        },
      });

      // Create timeline alerts for the switch
      if (preserveProgress && mappedProgress.completedLessons > 0) {
        await tx.timelineAlert.create({
          data: {
            userPathProgressId: newProgress.id,
            alertType: "PATH_SWITCH",
            severity: "INFO",
            message: `Progress preserved: ${mappedProgress.completedLessons} lessons transferred from previous path`,
            actionRequired: false,
          },
        });
      }

      return newProgress;
    });

    // Generate content adaptations for the new path
    if (preserveProgress) {
      await generateContentAdaptationsForPath(
        session.user.id,
        toPathId,
        targetPath.pathType
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully switched learning paths",
      previousPath: currentProgress.learningPath,
      newPath: result.learningPath,
      progress: result,
      preservedLessons: preserveProgress ? result.completedLessons : 0,
    });
  } catch (error) {
    console.error("Error switching learning paths:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function mapProgressBetweenPaths(
  currentProgress: {
    userId: string;
    learningPathId: string;
  },
  targetPath: {
    pathLessons: Array<{
      lessonId: string;
      lesson: {
        title: string;
        slug: string;
        chapterId: string;
      };
    }>;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any // Use any for transaction parameter to avoid complex type issues
) {
  const completedLessonsList: string[] = [];
  let completedLessons = 0;

  // Get completed lesson IDs from current path
  const completedLessonProgress = await tx.lessonProgress.findMany({
    where: {
      userId: currentProgress.userId,
      lesson: {
        pathLessons: {
          some: {
            learningPathId: currentProgress.learningPathId,
          },
        },
      },
      completedAt: {
        not: null,
      },
    },
  });

  const completedLessonIds = completedLessonProgress.map((lp: { lessonId: string }) => lp.lessonId);

  // Find matching lessons in target path
  for (const completedLessonId of completedLessonIds) {
    const completedLesson = await tx.lesson.findUnique({
      where: { id: completedLessonId },
    });

    if (!completedLesson) continue;

    // Look for equivalent lesson in target path
    const equivalentLesson = targetPath.pathLessons.find((pathLesson: {
      lessonId: string;
      lesson: {
        title: string;
        slug: string;
        chapterId: string;
      };
    }) => {
      return (
        pathLesson.lesson.title.toLowerCase() === completedLesson.title.toLowerCase() ||
        pathLesson.lesson.slug === completedLesson.slug ||
        pathLesson.lesson.chapterId === completedLesson.chapterId
      );
    });

    if (equivalentLesson) {
      completedLessonsList.push(equivalentLesson.lessonId);
      completedLessons++;

      // Mark lesson as completed in the new path context
      await tx.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: currentProgress.userId,
            lessonId: equivalentLesson.lessonId,
          },
        },
        update: {
          completedAt: new Date(),
        },
        create: {
          userId: currentProgress.userId,
          lessonId: equivalentLesson.lessonId,
          completedAt: new Date(),
        },
      });
    }
  }

  // Calculate current week and day based on completed lessons
  const totalLessonsInTargetPath = targetPath.pathLessons.length;
  const progressPercentage = totalLessonsInTargetPath > 0 
    ? (completedLessons / totalLessonsInTargetPath) * 100 
    : 0;

  // Estimate current week and day (assuming 5 lessons per week)
  const lessonsPerWeek = 5;
  const estimatedWeek = Math.floor(completedLessons / lessonsPerWeek) + 1;
  const estimatedDay = (completedLessons % lessonsPerWeek) + 1;

  return {
    completedLessons,
    currentWeek: estimatedWeek,
    currentDay: estimatedDay,
    completedLessonsList,
  };
}

function getDaysPerWeek(pathType: PathType): number {
  switch (pathType) {
    case "TIMELINE_1_MONTH":
      return 7; // Every day for intensive 1-month path
    case "TIMELINE_3_MONTHS":
      return 6; // 6 days a week for balanced 3-month path
    case "TIMELINE_6_MONTHS":
      return 5; // 5 days a week for comprehensive 6-month path
    default:
      return 5; // Default to 5 days a week
  }
}

async function generateContentAdaptationsForPath(
  userId: string,
  pathId: string,
  pathType: PathType
) {
  try {
    // Get all lessons in the path
    const pathLessons = await prisma.pathLesson.findMany({
      where: {
        learningPathId: pathId,
      },
      include: {
        lesson: true,
      },
    });

    // Determine mastery level based on path type
    let masteryLevel: MasteryLevel = MasteryLevel.STANDARD;
    switch (pathType) {
      case "TIMELINE_1_MONTH":
        masteryLevel = MasteryLevel.BASIC;
        break;
      case "TIMELINE_3_MONTHS":
        masteryLevel = MasteryLevel.STANDARD;
        break;
      case "TIMELINE_6_MONTHS":
        masteryLevel = MasteryLevel.ADVANCED;
        break;
    }

    // Generate content adaptations for each lesson
    for (const pathLesson of pathLessons) {
      // Check if adaptation already exists
      const existingAdaptation = await prisma.contentAdaptation.findFirst({
        where: {
          lessonId: pathLesson.lessonId,
          pathType,
          masteryLevel,
        },
      });

      if (!existingAdaptation) {
        // Create content adaptation
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/content-adaptation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessonId: pathLesson.lessonId,
            pathType,
            masteryLevel,
          }),
        });
      }
    }
  } catch (error) {
    console.error("Error generating content adaptations:", error);
    // Don't fail the path switch if content adaptation fails
  }
}