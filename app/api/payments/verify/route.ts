import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withPaymentSecurity, addSecurityHeaders } from "@/lib/payment-security";
import { getCheckoutSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    // Parse request body first for validation
    const requestBody = await request.json();
    const { session_id } = requestBody;

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

    // Validate session_id
    if (!session_id || typeof session_id !== 'string') {
      console.error("Missing or invalid session_id", { userId });
      return NextResponse.json(
        { error: "Missing or invalid session ID" },
        { status: 400 }
      );
    }

    // Retrieve the Stripe checkout session
    let checkoutSession;
    try {
      checkoutSession = await getCheckoutSession(session_id);
    } catch (error) {
      console.error("Failed to retrieve Stripe session", { session_id, userId, error });
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 400 }
      );
    }

    // Verify the payment was successful
    if (checkoutSession.payment_status !== 'paid') {
      console.error("Payment not completed", { 
        session_id, 
        userId, 
        payment_status: checkoutSession.payment_status 
      });
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Verify the user matches
    if (checkoutSession.client_reference_id !== userId) {
      console.error("User ID mismatch", { 
        session_id, 
        userId, 
        client_reference_id: checkoutSession.client_reference_id 
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: {
        stripePaymentIntentId: session_id,
        userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!payment) {
      console.error("Payment record not found", { session_id, userId });
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Check for idempotency - if payment is already captured, return success
    if (payment.status === "CAPTURED") {
      console.log("Payment already verified", {
        paymentId: payment.id,
        session_id
      });
      return NextResponse.json({
        success: true,
        message: "Payment already verified successfully",
        subscription: {
          plan: payment.subscription?.plan || "YEARLY",
          status: payment.subscription?.status || "ACTIVE",
          access: "yearly",
        },
      });
    }

    // Update payment record with payment intent ID
    const paymentIntentId = checkoutSession.payment_intent as string;
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripePaymentId: paymentIntentId,
        stripePaymentIntentId: paymentIntentId,
        status: "CAPTURED",
        method: checkoutSession.payment_method_types?.[0] || 'card',
      },
    });

    console.log("Payment updated to CAPTURED", {
      paymentId: payment.id,
      stripePaymentId: paymentIntentId
    });

    // Calculate subscription end date (1 year from now)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);

    // Handle subscription creation/update
    try {
      const existingSubscription = await prisma.subscription.findFirst({
        where: { userId },
      });

      if (existingSubscription) {
        // Update existing subscription
        if (existingSubscription.status === "ACTIVE" && existingSubscription.plan === "YEARLY") {
          // Extend existing subscription by 1 year
          const newEndDate = new Date(existingSubscription.endDate || new Date());
          newEndDate.setFullYear(newEndDate.getFullYear() + 1);
          
          await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              endDate: newEndDate,
            },
          });
          console.log("Yearly subscription extended", {
            subscriptionId: existingSubscription.id,
            userId,
            newEndDate
          });
        } else {
          // Update existing subscription to yearly
          await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              plan: "YEARLY",
              status: "ACTIVE",
              endDate: subscriptionEndDate,
              amount: 99900,
            },
          });
          console.log("Subscription updated to yearly", {
            subscriptionId: existingSubscription.id,
            userId,
            endDate: subscriptionEndDate
          });
        }
      } else {
        // Create new yearly subscription
        const newSubscription = await prisma.subscription.create({
          data: {
            userId,
            plan: "YEARLY",
            status: "ACTIVE",
            endDate: subscriptionEndDate,
            amount: 99900,
            payments: {
              connect: { id: payment.id },
            },
          },
        });
        console.log("New yearly subscription created", {
          subscriptionId: newSubscription.id,
          userId,
          endDate: subscriptionEndDate
        });
      }

      // Update user subscription status
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "ACTIVE",
          subscriptionPlan: "YEARLY",
          subscriptionEndDate: subscriptionEndDate,
        },
      });

      console.log("User subscription status updated", { userId });

    } catch (subscriptionError) {
      console.error("Error handling subscription:", subscriptionError);
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully, but subscription activation may be delayed. Please contact support if you don't see yearly access.",
        subscription: {
          plan: "YEARLY",
          status: "PENDING",
          access: "pending",
        },
        warning: "Subscription activation encountered an issue. Please check your account or contact support.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. 1 year access granted!",
      subscription: {
        plan: "YEARLY",
        status: "ACTIVE",
        access: "yearly",
        endDate: subscriptionEndDate.toISOString(),
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
