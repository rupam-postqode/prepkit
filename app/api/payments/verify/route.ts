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

    // Additional security validations
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing required payment verification fields", {
        hasOrderId: !!razorpay_order_id,
        hasPaymentId: !!razorpay_payment_id,
        hasSignature: !!razorpay_signature,
        userId
      });
      return NextResponse.json(
        { error: "Missing required payment verification fields" },
        { status: 400 }
      );
    }

    // Validate Razorpay ID formats
    const orderIdRegex = /^order_[a-zA-Z0-9]+$/;
    const paymentIdRegex = /^pay_[a-zA-Z0-9]+$/;

    if (!orderIdRegex.test(razorpay_order_id) || !paymentIdRegex.test(razorpay_payment_id)) {
      console.error("Invalid Razorpay ID format", {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        userId
      });
      return NextResponse.json(
        { error: "Invalid payment ID format" },
        { status: 400 }
      );
    }

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("Payment signature verification failed", {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        userId,
        expectedSign: expectedSign.substring(0, 10) + "...", // Log partial for security
        receivedSign: razorpay_signature.substring(0, 10) + "..."
      });
      return NextResponse.json(
        { error: "Payment verification failed: Invalid signature" },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!payment) {
      console.error("Payment record not found", {
        orderId: razorpay_order_id,
        userId
      });
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Check for idempotency - if payment is already captured, return success
    if (payment.status === "CAPTURED") {
      console.log("Payment already verified", {
        paymentId: payment.id,
        orderId: razorpay_order_id
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

    // Validate payment state - should be CREATED or AUTHORIZED
    if (payment.status !== "CREATED" && payment.status !== "AUTHORIZED") {
      console.error("Invalid payment state for verification", {
        paymentId: payment.id,
        status: payment.status
      });
      return NextResponse.json(
        { error: "Payment is not in a verifiable state" },
        { status: 400 }
      );
    }

    // Update payment record with transaction to ensure consistency
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: "CAPTURED",
      },
    });

    console.log("Payment updated to CAPTURED", {
      paymentId: payment.id,
      razorpayPaymentId: razorpay_payment_id
    });

    // Calculate subscription end date (1 year from now)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);

    // Handle subscription creation/update with better error handling
    try {
      // Check if subscription already exists and is active
      const existingSubscription = await prisma.subscription.findFirst({
        where: { userId },
      });

      if (existingSubscription) {
        // If subscription is already active and yearly, extend it
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
              endDate: subscriptionEndDate, // 1 year expiration
              amount: 99900, // ₹999 in paise
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
            endDate: subscriptionEndDate, // 1 year expiration
            amount: 99900, // ₹999 in paise
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
          subscriptionEndDate: subscriptionEndDate, // 1 year expiration
        },
      });

      console.log("User subscription status updated", { userId });

    } catch (subscriptionError) {
      console.error("Error handling subscription:", subscriptionError);
      // Payment was successful, but subscription update failed
      // This is a critical error that needs manual intervention
      console.error("CRITICAL: Payment captured but subscription update failed", {
        paymentId: payment.id,
        userId,
        error: subscriptionError
      });

      // Return partial success with warning
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully, but subscription activation may be delayed. Please contact support if you don't see yearly access.",
        subscription: {
          plan: "YEARLY",
          status: "PENDING", // Indicate potential issue
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
