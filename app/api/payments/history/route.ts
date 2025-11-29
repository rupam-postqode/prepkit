import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user's payments with refunds
    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        refunds: {
          orderBy: {
            createdAt: "desc",
          },
        },
        subscription: {
          select: {
            plan: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response
    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      razorpayPaymentId: payment.razorpayPaymentId,
      razorpayOrderId: payment.razorpayOrderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      createdAt: payment.createdAt.toISOString(),
      refunds: payment.refunds.map((refund) => ({
        id: refund.id,
        razorpayRefundId: refund.razorpayRefundId,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        processedAt: refund.processedAt.toISOString(),
      })),
      subscription: payment.subscription,
    }));

    return NextResponse.json({
      payments: formattedPayments,
    });

  } catch (error) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment history" },
      { status: 500 }
    );
  }
}
