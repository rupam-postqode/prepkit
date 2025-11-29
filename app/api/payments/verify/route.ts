import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { withPaymentSecurity, addSecurityHeaders } from "@/lib/payment-security";

export async function POST(request: NextRequest) {
  try {
    // Parse request body first for validation
    const requestBody = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = requestBody;

    // Apply security middleware
    const securityResponse = withPaymentSecurity(request, "VERIFY_PAYMENT", {
      validateInput: { type: "verify-payment", data: requestBody },
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

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: "CAPTURED",
      },
    });

    // Create or update subscription for lifetime access
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (existingSubscription) {
      // Update existing subscription
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          plan: "LIFETIME",
          status: "ACTIVE",
          endDate: null, // No expiration for lifetime
          amount: 99900, // ₹999 in paise
        },
      });
    } else {
      // Create new lifetime subscription
      await prisma.subscription.create({
        data: {
          userId,
          plan: "LIFETIME",
          status: "ACTIVE",
          endDate: null, // No expiration for lifetime
          amount: 99900, // ₹999 in paise
          payments: {
            connect: { id: payment.id },
          },
        },
      });
    }

    // Update user subscription status
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "ACTIVE",
        subscriptionPlan: "LIFETIME",
        subscriptionEndDate: null, // No expiration
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. Lifetime access granted!",
      subscription: {
        plan: "LIFETIME",
        status: "ACTIVE",
        access: "lifetime",
      },
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
