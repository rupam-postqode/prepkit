-- Migration to replace Razorpay with Stripe
-- Rename Razorpay fields to Stripe equivalents

-- Subscription table
ALTER TABLE "Subscription" RENAME COLUMN "razorpaySubscriptionId" TO "stripeSubscriptionId";
ALTER TABLE "Subscription" RENAME COLUMN "razorpayCustomerId" TO "stripeCustomerId";

-- Payment table
ALTER TABLE "Payment" RENAME COLUMN "razorpayPaymentId" TO "stripePaymentId";
ALTER TABLE "Payment" RENAME COLUMN "razorpayOrderId" TO "stripePaymentIntentId";

-- Refund table
ALTER TABLE "Refund" RENAME COLUMN "razorpayRefundId" TO "stripeRefundId";
