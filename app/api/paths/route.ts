import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's current path progress to check enrollment status
    const userProgress = await prisma.userPathProgress.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        learningPathId: true,
        isActive: true,
      },
    });

    const enrolledPathIds = userProgress
      .filter(progress => progress.isActive)
      .map(progress => progress.learningPathId);

    const paths = await prisma.learningPath.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            pathLessons: true,
            userProgress: true,
          },
        },
      },
      orderBy: {
        durationWeeks: "asc",
      },
    });

    // Add enrollment status to each path
    const pathsWithEnrollment = paths.map(path => ({
      ...path,
      enrolled: enrolledPathIds.includes(path.id),
    }));

    return NextResponse.json(pathsWithEnrollment);
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

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { title, slug, description, emoji, durationWeeks, difficulty, targetCompanies } = await request.json();

    // Validate required fields
    if (!title || !slug || !description || !durationWeeks) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const path = await prisma.learningPath.create({
      data: {
        title,
        slug,
        description,
        emoji: emoji || "🎯",
        durationWeeks: parseInt(durationWeeks),
        difficulty: difficulty || "MEDIUM",
        targetCompanies: targetCompanies || ["All"],
      },
    });

    return NextResponse.json(path, { status: 201 });
  } catch (error) {
    console.error("Error creating learning path:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
