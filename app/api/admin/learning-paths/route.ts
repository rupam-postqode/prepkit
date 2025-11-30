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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const learningPaths = await prisma.learningPath.findMany({
      include: {
        _count: {
          select: {
            pathLessons: true,
            userProgress: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(learningPaths);
  } catch (error) {
    console.error("Error fetching learning paths:", error);
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { 
      title, 
      slug, 
      description, 
      emoji, 
      durationWeeks, 
      difficulty, 
      targetCompanies, 
      selectedLessons 
    } = await request.json();

    // Validate required fields
    if (!title || !slug || !description || !durationWeeks || !selectedLessons || selectedLessons.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existingPath = await prisma.learningPath.findUnique({
      where: { slug },
    });

    if (existingPath) {
      return NextResponse.json(
        { error: "A learning path with this slug already exists" },
        { status: 409 }
      );
    }

    // Create the learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        title,
        slug,
        description,
        emoji: emoji || "🎯",
        durationWeeks: parseInt(durationWeeks),
        difficulty: difficulty || "MEDIUM",
        targetCompanies: targetCompanies || [],
        isActive: true,
      },
    });

    // Create path lessons for selected lessons
    const pathLessons = selectedLessons.map((lessonId: string, index: number) => {
      // Calculate week and day based on index (assuming 2 lessons per day, 5 days per week)
      const lessonIndex = index;
      const dayIndex = Math.floor(lessonIndex / 2) + 1; // 2 lessons per day
      const weekNumber = Math.floor((dayIndex - 1) / 5) + 1; // 5 days per week
      const dayNumber = ((dayIndex - 1) % 5) + 1;
      const orderIndex = (lessonIndex % 2) + 1; // Order within the day

      return {
        learningPathId: learningPath.id,
        lessonId,
        weekNumber,
        dayNumber,
        orderIndex,
        isRequired: true,
        estimatedHours: 1.0, // Default, can be customized later
      };
    });

    if (pathLessons.length > 0) {
      await prisma.pathLesson.createMany({
        data: pathLessons,
      });
    }

    // Return the created path with lesson count
    const createdPath = await prisma.learningPath.findUnique({
      where: { id: learningPath.id },
      include: {
        _count: {
          select: {
            pathLessons: true,
          },
        },
      },
    });

    return NextResponse.json(createdPath, { status: 201 });
  } catch (error) {
    console.error("Error creating learning path:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}