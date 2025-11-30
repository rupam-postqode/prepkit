import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only allow admin or cron job to access this endpoint
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "dev-secret"}` && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Find users with subscriptions expiring in the next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSubscriptions = await prisma.user.findMany({
      where: {
        subscriptionStatus: "ACTIVE",
        subscriptionPlan: "YEARLY",
        subscriptionEndDate: {
          lte: sevenDaysFromNow,
          gte: new Date(),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionEndDate: true,
      },
    });

    // Find expired subscriptions
    const expiredSubscriptions = await prisma.user.findMany({
      where: {
        subscriptionStatus: "ACTIVE",
        subscriptionPlan: "YEARLY",
        subscriptionEndDate: {
          lt: new Date(),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionEndDate: true,
      },
    });

    // Update expired subscriptions to FREE status
    if (expiredSubscriptions.length > 0) {
      await prisma.user.updateMany({
        where: {
          id: {
            in: expiredSubscriptions.map(u => u.id),
          },
        },
        data: {
          subscriptionStatus: "FREE",
          subscriptionPlan: null,
          subscriptionEndDate: null,
          updatedAt: new Date(),
        },
      });

      // Also update the subscription records
      await prisma.subscription.updateMany({
        where: {
          userId: {
            in: expiredSubscriptions.map(u => u.id),
          },
        },
        data: {
          status: "EXPIRED",
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      expiringSoon: expiringSubscriptions.length,
      expired: expiredSubscriptions.length,
      expiringUsers: expiringSubscriptions.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        expiryDate: u.subscriptionEndDate,
      })),
      expiredUsers: expiredSubscriptions.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        expiryDate: u.subscriptionEndDate,
      })),
    });

  } catch (error) {
    console.error("Error checking subscription expiry:", error);
    return NextResponse.json(
      { error: "Failed to check subscription expiry" },
      { status: 500 }
    );
  }
}

// GET endpoint to check a specific user's subscription status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionEndDate: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const isExpired = user.subscriptionEndDate ? user.subscriptionEndDate < now : false;
    const daysUntilExpiry = user.subscriptionEndDate 
      ? Math.ceil((user.subscriptionEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return NextResponse.json({
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionEndDate: user.subscriptionEndDate?.toISOString(),
      isExpired,
      daysUntilExpiry,
    });

  } catch (error) {
    console.error("Error checking subscription status:", error);
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}