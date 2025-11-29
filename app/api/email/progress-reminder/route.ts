import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendProgressReminder } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's active path progress
    const pathProgress = await prisma.userPathProgress.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        learningPath: {
          include: {
            pathLessons: {
              include: {
                lesson: {
                  include: {
                    progress: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!pathProgress) {
      return NextResponse.json(
        { error: "No active learning path found" },
        { status: 404 }
      );
    }

    const path = pathProgress.learningPath;
    const totalLessons = path.pathLessons.length;
    const completedLessons = path.pathLessons.filter(
      (pl) => pl.lesson.progress.length > 0
    ).length;

    // Send progress reminder email
    const result = await sendProgressReminder(
      session.user.email!,
      session.user.name!,
      path.title,
      pathProgress.currentWeek,
      path.durationWeeks,
      completedLessons,
      totalLessons
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Progress reminder email sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending progress reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
