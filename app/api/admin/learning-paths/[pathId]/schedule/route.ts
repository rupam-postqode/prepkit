import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pathId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { pathId } = await params;
    const { pathLessons } = await request.json();

    if (!pathLessons || !Array.isArray(pathLessons)) {
      return NextResponse.json(
        { error: "Invalid pathLessons data" },
        { status: 400 }
      );
    }

    // Validate each path lesson
    for (const lesson of pathLessons) {
      if (!lesson.lessonId || !lesson.weekNumber || !lesson.dayNumber) {
        return NextResponse.json(
          { error: "Each lesson must have lessonId, weekNumber, and dayNumber" },
          { status: 400 }
        );
      }
    }

    // Delete existing path lessons
    await prisma.pathLesson.deleteMany({
      where: { learningPathId: pathId },
    });

    // Create new path lessons with proper ordering
    const pathLessonData = pathLessons.map((lesson: {
      lessonId: string;
      weekNumber: number;
      dayNumber: number;
      orderIndex?: number;
      isRequired?: boolean;
      estimatedHours?: number;
    }) => ({
      learningPathId: pathId,
      lessonId: lesson.lessonId,
      weekNumber: lesson.weekNumber,
      dayNumber: lesson.dayNumber,
      orderIndex: lesson.orderIndex || 1,
      isRequired: lesson.isRequired !== undefined ? lesson.isRequired : true,
      estimatedHours: lesson.estimatedHours || 1.0,
      dependencies: "", // Add empty dependencies as required field
    }));

    if (pathLessonData.length > 0) {
      await prisma.pathLesson.createMany({
        data: pathLessonData,
      });
    }

    // Update the path's total lessons count
    await prisma.learningPath.update({
      where: { id: pathId },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, lessonsCreated: pathLessonData.length });
  } catch (error) {
    console.error("Error updating path schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}