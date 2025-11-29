import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user?.id || "",
          lessonId,
        },
      },
      update: {
        completedAt: completed ? new Date() : null,
        timeSpentSeconds: timeSpentSeconds || 0,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user?.id || "",
        lessonId,
        completedAt: completed ? new Date() : null,
        timeSpentSeconds: timeSpentSeconds || 0,
      },
    });

    return NextResponse.json(progress);
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
