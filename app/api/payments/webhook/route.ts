import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("Webhook received without signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("Received webhook event:", event.type);

    // Handle different webhook events
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log("Unhandled webhook event:", event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log("Processing checkout session completed:", session.id);

    const userId = session.client_reference_id;
    if (!userId) {
      console.error("No user ID in checkout session");
      return;
    }

    // Find the payment record
    const existingPayment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: session.id },
      include: { subscription: true },
    });

    if (!existingPayment) {
      console.error("Payment record not found for session:", session.id);
      return;
    }

    const paymentIntentId = session.payment_intent as string;

    // Update payment status
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        stripePaymentId: paymentIntentId,
        stripePaymentIntentId: paymentIntentId,
        status: "CAPTURED",
        method: session.payment_method_types?.[0] || 'card',
        updatedAt: new Date(),
      },
    });

    // Update subscription if payment is for subscription
    if (session.metadata?.plan === "YEARLY") {
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);

      const existingSubscription = await prisma.subscription.findFirst({
        where: { userId },
      });

      if (existingSubscription) {
        await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            status: "ACTIVE",
            endDate: subscriptionEndDate,
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId,
            plan: "YEARLY",
            status: "ACTIVE",
            endDate: subscriptionEndDate,
            amount: 99900,
            payments: {
              connect: { id: existingPayment.id },
            },
          },
        });
      }

      // Update user subscription status
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "ACTIVE",
          subscriptionPlan: "YEARLY",
          subscriptionEndDate: subscriptionEndDate,
          updatedAt: new Date(),
        },
      });

      console.log("Subscription activated for user:", userId);
    }

  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Processing payment intent succeeded:", paymentIntent.id);

    // Find payment by payment intent ID
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (!payment) {
      console.log("No payment record found for payment intent:", paymentIntent.id);
      return;
    }

    // Update payment status if not already captured
    if (payment.status !== "CAPTURED") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "CAPTURED",
          updatedAt: new Date(),
        },
      });
      console.log("Payment status updated to CAPTURED:", payment.id);
    }

  } catch (error) {
    console.error("Error handling payment intent succeeded:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Processing payment intent failed:", paymentIntent.id);

    // Find payment by payment intent ID or session ID
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { stripePaymentId: paymentIntent.id },
          { stripePaymentIntentId: paymentIntent.id },
        ],
      },
    });

    if (!payment) {
      console.log("No payment record found for failed payment intent:", paymentIntent.id);
      return;
    }

    // Update payment status to failed
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        updatedAt: new Date(),
      },
    });

    console.log("Payment marked as failed:", payment.id);

  } catch (error) {
    console.error("Error handling payment intent failed:", error);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    console.log("Processing charge refunded:", charge.id);

    const paymentIntentId = charge.payment_intent as string;

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntentId },
      include: { subscription: true },
    });

    if (!payment) {
      console.error("Payment record not found for refunded charge:", charge.id);
      return;
    }

    // Update payment status to refunded
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "REFUNDED",
        updatedAt: new Date(),
      },
    });

    // Cancel subscription if exists
    if (payment.subscription) {
      await prisma.subscription.update({
        where: { id: payment.subscription.id },
        data: {
          status: "CANCELLED",
          updatedAt: new Date(),
        },
      });

      // Update user subscription status
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          subscriptionStatus: "FREE",
          subscriptionPlan: null,
          subscriptionEndDate: null,
          updatedAt: new Date(),
        },
      });

      console.log("Subscription cancelled due to refund for user:", payment.userId);
    }

  } catch (error) {
    console.error("Error handling charge refunded:", error);
  }
}
