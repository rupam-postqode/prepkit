import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withPaymentSecurity, addSecurityHeaders } from "@/lib/payment-security";
import { createRefund } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { paymentId, reason } = requestBody;

    // Apply security middleware
    const securityResponse = withPaymentSecurity(request, "REFUND", {
      validateInput: { type: "refund", data: requestBody },
    });

    if (securityResponse) {
      return securityResponse;
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return addSecurityHeaders(NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ));
    }

    const userId = session.user?.id || "";

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        subscription: true,
        refunds: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Check if payment is eligible for refund
    if (payment.status === "REFUNDED") {
      return NextResponse.json(
        { error: "Payment has already been refunded" },
        { status: 400 }
      );
    }

    if (payment.status !== "CAPTURED") {
      return NextResponse.json(
        { error: "Only captured payments can be refunded" },
        { status: 400 }
      );
    }

    // Check if payment has Stripe payment ID
    if (!payment.stripePaymentId) {
      return NextResponse.json(
        { error: "Payment does not have a valid Stripe payment ID" },
        { status: 400 }
      );
    }

    // Process refund with Stripe
    const refundAmount = payment.amount; // Full refund

    try {
      const refundResponse = await createRefund(
        payment.stripePaymentId,
        refundAmount,
        reason
      );

      // Create refund record
      const refund = await prisma.refund.create({
        data: {
          paymentId: payment.id,
          stripeRefundId: refundResponse.id,
          amount: refundAmount,
          currency: payment.currency,
          status: "PROCESSED",
          reason: reason || "Requested by admin",
          processedBy: userId,
        },
      });

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "REFUNDED",
        },
      });

      // Cancel subscription if exists
      if (payment.subscription) {
        await prisma.subscription.update({
          where: { id: payment.subscription.id },
          data: {
            status: "CANCELLED",
          },
        });

        // Update user subscription status
        await prisma.user.update({
          where: { id: payment.userId },
          data: {
            subscriptionStatus: "FREE",
            subscriptionPlan: null,
            subscriptionEndDate: null,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Refund processed successfully",
        refund: {
          id: refund.id,
          stripeRefundId: refund.stripeRefundId,
          amount: refund.amount,
          currency: refund.currency,
          status: refund.status,
          processedAt: refund.processedAt,
        },
      });

    } catch (error: any) {
      console.error("Refund error:", error);

      if (error && typeof error === "object" && "code" in error) {
        const stripeError = error as { code: string; message?: string };

        if (stripeError.code === "charge_already_refunded") {
          return NextResponse.json(
            { error: "This payment has already been refunded" },
            { status: 400 }
          );
        }

        if (stripeError.code === "charge_not_found") {
          return NextResponse.json(
            { error: "Payment not found in Stripe" },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        { error: "Failed to process refund. Please try again later." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Refund processing error:", error);
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 }
    );
  }
}
