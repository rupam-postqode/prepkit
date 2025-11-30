import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please login first" }, { status: 401 });
    }

    const userId = session.user.id;
    const { oldPathId, newPathId } = await request.json();

    // Validate required fields
    if (!oldPathId || !newPathId) {
      return NextResponse.json(
        { error: "Both oldPathId and newPathId are required" },
        { status: 400 }
      );
    }

    if (oldPathId === newPathId) {
      return NextResponse.json(
        { error: "Cannot switch to the same path" },
        { status: 400 }
      );
    }

    // Verify both paths exist
    const [oldPath, newPath] = await Promise.all([
      prisma.learningPath.findUnique({
        where: { id: oldPathId },
        select: { id: true, isActive: true }
      }),
      prisma.learningPath.findUnique({
        where: { id: newPathId },
        select: { id: true, isActive: true }
      })
    ]);

    if (!oldPath || !newPath) {
      return NextResponse.json(
        { error: "One or both learning paths not found" },
        { status: 404 }
      );
    }

    // Deactivate the old path and activate the new one
    await prisma.$transaction(async (tx) => {
      // Deactivate old path
      await tx.userPathProgress.updateMany({
        where: {
          userId_learningPathId: {
            userId,
            learningPathId: oldPathId,
          },
        },
        data: {
          isActive: false,
        },
      });

      // Activate new path
      await tx.userPathProgress.update({
        where: {
          userId_learningPathId: {
            userId,
            learningPathId: newPathId,
          },
        },
        data: {
          isActive: true,
          lastActivityAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Successfully switched learning paths",
      oldPathId,
      newPathId,
    });
  } catch (error) {
    console.error("Error switching learning paths:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}