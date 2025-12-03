import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withPaymentSecurity, addSecurityHeaders } from "@/lib/payment-security";
import { createYearlySubscriptionCheckout, PRICING_CONFIG } from "@/lib/stripe";

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

    // Create Stripe Checkout Session
    const checkoutSession = await createYearlySubscriptionCheckout(
      userId,
      session.user?.email || "",
      session.user?.name || ""
    );

    // Store order details in database for verification
    await prisma.payment.create({
      data: {
        userId,
        stripePaymentIntentId: checkoutSession.id, // Store session ID temporarily
        amount: PRICING_CONFIG.YEARLY.amount,
        currency: "INR",
        status: "CREATED",
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      amount: PRICING_CONFIG.YEARLY.amount,
      currency: "INR",
      plan: PRICING_CONFIG.YEARLY.name,
    });

  } catch (error) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
