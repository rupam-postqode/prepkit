import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { withPaymentSecurity, addSecurityHeaders } from "@/lib/payment-security";

// Initialize Razorpay (lazy initialization)
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body first for validation
    const requestBody = await request.json();
    const { paymentId, reason, amount } = requestBody;

    // Apply security middleware
    const securityResponse = withPaymentSecurity(request, "REFUND", {
      validateInput: { type: "refund", data: requestBody },
    });

    if (securityResponse) {
      return securityResponse;
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return addSecurityHeaders(NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ));
    }

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: session.user.id,
        status: "CAPTURED", // Only captured payments can be refunded
      },
      include: {
        subscription: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found or not eligible for refund" },
        { status: 404 }
      );
    }

    // Check refund eligibility based on subscription type and time
    const refundEligibility = await checkRefundEligibility(payment);

    if (!refundEligibility.eligible) {
      return NextResponse.json(
        {
          error: refundEligibility.reason,
          details: refundEligibility.details
        },
        { status: 400 }
      );
    }

    // Calculate refund amount
    const refundAmount = amount || payment.amount; // Full refund by default

    if (refundAmount > payment.amount) {
      return NextResponse.json(
        { error: "Refund amount cannot exceed payment amount" },
        { status: 400 }
      );
    }

    // Check if payment has Razorpay payment ID
    if (!payment.razorpayPaymentId) {
      return NextResponse.json(
        { error: "Payment cannot be refunded - missing payment reference" },
        { status: 400 }
      );
    }

    // Process refund with Razorpay
    const razorpay = getRazorpay();

    const refundOptions = {
      payment_id: payment.razorpayPaymentId,
      amount: refundAmount, // Amount in paise
      notes: {
        userId: session.user.id,
        reason: reason || "Customer requested refund",
        originalPaymentId: payment.id,
      },
    };

    const refundResponse = await razorpay.payments.refund(payment.razorpayPaymentId, refundOptions);

    // Create refund record in database
    await prisma.refund.create({
      data: {
        paymentId: payment.id,
        razorpayRefundId: refundResponse.id,
        amount: refundAmount,
        currency: payment.currency,
        status: "PROCESSED",
        reason: reason || "Customer requested refund",
        processedBy: session.user.id,
        processedAt: new Date(),
      },
    });

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "REFUNDED",
        updatedAt: new Date(),
      },
    });

    // Handle subscription cancellation for lifetime subscriptions
    if (payment.subscription && payment.subscription.plan === "LIFETIME") {
      await prisma.subscription.update({
        where: { id: payment.subscription.id },
        data: {
          status: "CANCELLED",
          updatedAt: new Date(),
        },
      });

      // Update user subscription status
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          subscriptionStatus: "FREE",
          subscriptionPlan: null,
          subscriptionEndDate: null,
          updatedAt: new Date(),
        },
      });
    }

    // Log refund activity
    console.log("Refund processed successfully:", {
      refundId: refundResponse.id,
      paymentId: payment.id,
      userId: session.user.id,
      amount: refundAmount,
    });

    return NextResponse.json({
      success: true,
      message: "Refund processed successfully",
      refund: {
        id: refundResponse.id,
        amount: refundAmount,
        currency: payment.currency,
        status: "PROCESSED",
      },
    });

  } catch (error: unknown) {
    console.error("Refund processing error:", error);

    // Handle specific Razorpay errors
    if (error && typeof error === "object" && "code" in error) {
      const razorpayError = error as { code: string };

      if (razorpayError.code === "BAD_REQUEST_ERROR") {
        return NextResponse.json(
          { error: "Invalid refund request. Payment may not be eligible for refund." },
          { status: 400 }
        );
      }

      if (razorpayError.code === "PAYMENT_NOT_FOUND_ERROR") {
        return NextResponse.json(
          { error: "Payment not found in Razorpay" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process refund. Please try again or contact support." },
      { status: 500 }
    );
  }
}

interface PaymentWithSubscription {
  id: string;
  createdAt: Date;
  subscription?: {
    plan: string;
  } | null;
}

async function checkRefundEligibility(payment: PaymentWithSubscription) {
  const now = new Date();
  const paymentDate = payment.createdAt;
  const daysSincePayment = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));

  // For lifetime subscriptions
  if (payment.subscription?.plan === "LIFETIME") {
    if (daysSincePayment <= 30) {
      return {
        eligible: true,
        reason: null,
        details: `Lifetime subscription refund within ${daysSincePayment} days`,
      };
    } else {
      return {
        eligible: false,
        reason: "Refund period expired",
        details: "Lifetime subscriptions can only be refunded within 30 days of purchase",
      };
    }
  }

  // For monthly subscriptions
  if (payment.subscription?.plan === "MONTHLY") {
    if (daysSincePayment <= 7) {
      return {
        eligible: true,
        reason: null,
        details: `Monthly subscription refund within ${daysSincePayment} days`,
      };
    } else {
      return {
        eligible: false,
        reason: "Refund period expired",
        details: "Monthly subscriptions can only be refunded within 7 days of purchase",
      };
    }
  }

  // For quarterly/annual subscriptions
  if (payment.subscription?.plan === "QUARTERLY" || payment.subscription?.plan === "YEARLY") {
    if (daysSincePayment <= 14) {
      return {
        eligible: true,
        reason: null,
        details: `${payment.subscription.plan} subscription refund within ${daysSincePayment} days`,
      };
    } else {
      return {
        eligible: false,
        reason: "Refund period expired",
        details: `${payment.subscription.plan} subscriptions can only be refunded within 14 days of purchase`,
      };
    }
  }

  // Default case - allow refund within 7 days
  if (daysSincePayment <= 7) {
    return {
      eligible: true,
      reason: null,
      details: `Refund within ${daysSincePayment} days`,
    };
  }

  return {
    eligible: false,
    reason: "Refund period expired",
    details: "Refunds are only available within 7 days of purchase",
  };
}

// GET endpoint to retrieve user's refund history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const refunds = await prisma.refund.findMany({
      where: {
        payment: {
          userId: session.user.id,
        },
      },
      include: {
        payment: {
          select: {
            amount: true,
            currency: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      refunds: refunds.map(refund => ({
        id: refund.id,
        razorpayRefundId: refund.razorpayRefundId,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        processedAt: refund.processedAt,
        payment: refund.payment,
      })),
    });

  } catch (error) {
    console.error("Error fetching refund history:", error);
    return NextResponse.json(
      { error: "Failed to fetch refund history" },
      { status: 500 }
    );
  }
}
