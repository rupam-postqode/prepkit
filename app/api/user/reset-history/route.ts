import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, pathId, weekNumber, reason } = await request.json();

    // Validate required fields
    if (!type || !reason) {
      return NextResponse.json({ 
        error: "Missing required fields: type and reason are required" 
      }, { status: 400 });
    }

    // Validate type
    if (!['PATH', 'WEEK', 'ALL'].includes(type)) {
      return NextResponse.json({ 
        error: "Invalid reset type. Must be PATH, WEEK, or ALL" 
      }, { status: 400 });
    }

    // Create reset history record
    const resetRecord = await prisma.resetHistory.create({
      data: {
        userId: session.user.id,
        type: type as 'PATH' | 'WEEK' | 'ALL',
        pathId: pathId || null,
        weekNumber: weekNumber || null,
        reason: reason,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      resetRecord: {
        id: resetRecord.id,
        type: resetRecord.type,
        timestamp: resetRecord.timestamp,
        reason: resetRecord.reason,
      }
    });

  } catch (error) {
    console.error("Failed to log reset history:", error);
    return NextResponse.json(
      { error: "Failed to log reset history" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get user's reset history
    const [resetHistory, totalCount] = await Promise.all([
      prisma.resetHistory.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
        include: {
          path: {
            select: {
              title: true,
              emoji: true,
            },
          },
        },
      }),
      prisma.resetHistory.count({
        where: { userId: session.user.id },
      }),
    ]);

    return NextResponse.json({
      resetHistory,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error("Failed to fetch reset history:", error);
    return NextResponse.json(
      { error: "Failed to fetch reset history" },
      { status: 500 }
    );
  }
}
