import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pathId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please login first" }, { status: 401 });
    }

    const userId = session.user.id;
    const { pathId } = await params;

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return NextResponse.json({ 
        error: "User not found - Please sign up first" 
      }, { status: 404 });
    }

    // Check if path exists and is active
    const path = await prisma.learningPath.findUnique({
      where: { id: pathId },
      include: {
        _count: {
          select: {
            pathLessons: true,
          },
        },
      },
    });

    if (!path || !path.isActive) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const existingProgress = await prisma.userPathProgress.findUnique({
      where: {
        userId_learningPathId: {
          userId,
          learningPathId: pathId,
        },
      },
    });

    if (existingProgress) {
      return NextResponse.json(
        { error: "Already enrolled in this path" },
        { status: 400 }
      );
    }

    // Create enrollment record
    const progress = await prisma.userPathProgress.create({
      data: {
        userId,
        learningPathId: pathId,
        totalLessons: path._count.pathLessons,
        completedMilestones: "", // Add empty completedMilestones as required field
      },
    });

    // Send welcome email with path information (don't block on email failure)
    try {
      await sendWelcomeEmail(session.user.email!, session.user.name!, path.title);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the enrollment if email fails
    }

    return NextResponse.json({
      success: true,
      progress,
      message: `Successfully enrolled in ${path.title}`,
    });
  } catch (error) {
    console.error("Error enrolling in path:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
