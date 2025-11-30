import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";

// Type definitions for Razorpay webhook payloads
interface RazorpayPayment {
  id: string;
  order_id: string;
  subscription_id?: string;
  method: string;
}

interface RazorpayOrder {
  id: string;
}

interface RazorpayRefund {
  id: string;
  payment_id: string;
}

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment?: { entity: RazorpayPayment };
    order?: { entity: RazorpayOrder };
    refund?: { entity: RazorpayRefund };
  };
}

// Initialize Razorpay (lazy initialization)
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("Webhook received without signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Received webhook event:", event.event);

    // Handle different webhook events
    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity);
        break;

      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;

      case "order.paid":
        await handleOrderPaid(event.payload.order.entity);
        break;

      case "refund.created":
        await handleRefundCreated(event.payload.refund.entity);
        break;

      case "refund.processed":
        await handleRefundProcessed(event.payload.refund.entity);
        break;

      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: RazorpayPayment) {
  try {
    console.log("Processing payment captured:", payment.id);

    // Find the payment record
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayOrderId: payment.order_id },
      include: { subscription: true },
    });

    if (!existingPayment) {
      console.error("Payment record not found for order:", payment.order_id);
      return;
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        razorpayPaymentId: payment.id,
        status: "CAPTURED",
        method: payment.method,
        updatedAt: new Date(),
      },
    });

    // Update subscription status if not already active
    if (existingPayment.subscription && existingPayment.subscription.status !== "ACTIVE") {
      // For yearly subscriptions, ensure we have an end date
      let subscriptionEndDate = existingPayment.subscription.endDate;
      if (existingPayment.subscription.plan === "YEARLY" && !subscriptionEndDate) {
        subscriptionEndDate = new Date();
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      }

      await prisma.subscription.update({
        where: { id: existingPayment.subscription.id },
        data: {
          status: "ACTIVE",
          razorpaySubscriptionId: payment.subscription_id || null,
          endDate: subscriptionEndDate,
          updatedAt: new Date(),
        },
      });

      // Update user subscription status
      await prisma.user.update({
        where: { id: existingPayment.userId },
        data: {
          subscriptionStatus: "ACTIVE",
          subscriptionPlan: existingPayment.subscription.plan,
          subscriptionEndDate: subscriptionEndDate,
          updatedAt: new Date(),
        },
      });

      console.log("Subscription activated for user:", existingPayment.userId, "Plan:", existingPayment.subscription.plan);
    }

  } catch (error) {
    console.error("Error handling payment captured:", error);
  }
}

async function handlePaymentFailed(payment: RazorpayPayment) {
  try {
    console.log("Processing payment failed:", payment.id);

    // Find the payment record
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayOrderId: payment.order_id },
    });

    if (!existingPayment) {
      console.error("Payment record not found for order:", payment.order_id);
      return;
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        razorpayPaymentId: payment.id,
        status: "FAILED",
        method: payment.method,
        updatedAt: new Date(),
      },
    });

    console.log("Payment marked as failed:", payment.id);

  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}

async function handleOrderPaid(order: RazorpayOrder) {
  try {
    console.log("Processing order paid:", order.id);

    // Find the payment record
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayOrderId: order.id },
      include: { subscription: true },
    });

    if (!existingPayment) {
      console.error("Payment record not found for order:", order.id);
      return;
    }

    // Update payment status if not already captured
    if (existingPayment.status !== "CAPTURED") {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          status: "CAPTURED",
          updatedAt: new Date(),
        },
      });
    }

    // Ensure subscription is active
    if (existingPayment.subscription && existingPayment.subscription.status !== "ACTIVE") {
      // For yearly subscriptions, ensure we have an end date
      let subscriptionEndDate = existingPayment.subscription.endDate;
      if (existingPayment.subscription.plan === "YEARLY" && !subscriptionEndDate) {
        subscriptionEndDate = new Date();
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      }

      await prisma.subscription.update({
        where: { id: existingPayment.subscription.id },
        data: {
          status: "ACTIVE",
          endDate: subscriptionEndDate,
          updatedAt: new Date(),
        },
      });

      // Update user subscription status
      await prisma.user.update({
        where: { id: existingPayment.userId },
        data: {
          subscriptionStatus: "ACTIVE",
          subscriptionPlan: existingPayment.subscription.plan,
          subscriptionEndDate: subscriptionEndDate,
          updatedAt: new Date(),
        },
      });

      console.log("Subscription activated via order paid for user:", existingPayment.userId, "Plan:", existingPayment.subscription.plan);
    }

  } catch (error) {
    console.error("Error handling order paid:", error);
  }
}

async function handleRefundCreated(refund: RazorpayRefund) {
  try {
    console.log("Processing refund created:", refund.id);

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: { razorpayPaymentId: refund.payment_id },
      include: { subscription: true },
    });

    if (!payment) {
      console.error("Payment record not found for refund:", refund.payment_id);
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

    // Cancel subscription for any refunded payment
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

      console.log("Subscription cancelled due to refund for user:", payment.userId, "Plan was:", payment.subscription.plan);
    }

  } catch (error) {
    console.error("Error handling refund created:", error);
  }
}

async function handleRefundProcessed(refund: RazorpayRefund) {
  try {
    console.log("Processing refund processed:", refund.id);

    // Additional processing if needed for completed refunds
    // This event indicates the refund has been successfully processed

  } catch (error) {
    console.error("Error handling refund processed:", error);
  }
}
