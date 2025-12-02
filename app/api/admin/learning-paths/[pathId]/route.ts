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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { pathId } = await params;

    // Get learning path with lessons
    const learningPath = await prisma.learningPath.findUnique({
      where: { id: pathId },
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

    return NextResponse.json({
      path: learningPath,
      pathLessons: learningPath.pathLessons,
    });
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

    // Delete existing path lessons
    await prisma.pathLesson.deleteMany({
      where: { learningPathId: pathId },
    });

    // Create new path lessons
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating path schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if path has any enrolled users
    const enrolledUsers = await prisma.userPathProgress.count({
      where: { learningPathId: pathId },
    });

    if (enrolledUsers > 0) {
      return NextResponse.json(
        { error: "Cannot delete path with enrolled users" },
        { status: 400 }
      );
    }

    // Delete path lessons first
    await prisma.pathLesson.deleteMany({
      where: { learningPathId: pathId },
    });

    // Delete the learning path
    await prisma.learningPath.delete({
      where: { id: pathId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting learning path:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}