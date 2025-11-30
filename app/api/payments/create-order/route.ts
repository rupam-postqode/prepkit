import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withPaymentSecurity, addSecurityHeaders } from "@/lib/payment-security";
import Razorpay from "razorpay";

// Initialize Razorpay (lazy initialization)
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
};

// Single pricing plan (in rupees)
const PRICING_PLAN = {
  amount: 99900, // ₹999 in paise
  name: "1 Year Access",
  duration: 365, // 1 year in days
};

export async function POST(request: NextRequest) {
  try {
    // Apply security middleware
    const securityResponse = withPaymentSecurity(request, "CREATE_ORDER", {
      validateInput: { type: "create-order", data: {} },
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

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        endDate: {
          gt: new Date(), // Only check for non-expired subscriptions
        },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      );
    }

    // Create Razorpay order for ₹999 yearly access
    const options = {
      amount: PRICING_PLAN.amount,
      currency: "INR",
      receipt: `rcpt_${userId}_${Date.now()}`,
      notes: {
        userId,
        plan: "YEARLY",
        planName: PRICING_PLAN.name,
      },
    };

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create(options);

    // Store order details in database for verification
    await prisma.payment.create({
      data: {
        userId,
        razorpayOrderId: order.id,
        amount: PRICING_PLAN.amount,
        currency: "INR",
        status: "CREATED",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: PRICING_PLAN.amount,
      currency: "INR",
      plan: PRICING_PLAN.name,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
