import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    // Publish all unpublished lessons
    const result = await prisma.lesson.updateMany({
      where: {
        publishedAt: null,
      },
      data: {
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Published ${result.count} lessons`,
      count: result.count
    });
  } catch (error) {
    console.error('Error publishing lessons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
