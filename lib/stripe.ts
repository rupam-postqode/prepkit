import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Initialize Stripe with API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Pricing configuration
export const PRICING_CONFIG = {
  YEARLY: {
    amount: 99900, // ₹999 in paise
    currency: 'INR',
    name: '1 Year Access',
    duration: 365, // days
  },
  INTERVIEW: {
    baseCost: 14900, // ₹149 in paise
    currency: 'INR',
  },
};

// Helper to create a Stripe Checkout Session for yearly subscription
export async function createYearlySubscriptionCheckout(
  userId: string,
  userEmail: string,
  userName: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: PRICING_CONFIG.YEARLY.currency.toLowerCase(),
          product_data: {
            name: 'PrepKit - 1 Year Access',
            description: 'Complete access to interview preparation materials for 1 year',
          },
          unit_amount: PRICING_CONFIG.YEARLY.amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId,
      userName,
      plan: 'YEARLY',
    },
  });

  return session;
}

// Helper to create a Stripe Checkout Session for mock interview
export async function createInterviewCheckout(
  userId: string,
  sessionId: string,
  amount: number,
  userEmail: string,
  interviewType: string,
  interviewDifficulty: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: PRICING_CONFIG.INTERVIEW.currency.toLowerCase(),
          product_data: {
            name: `Mock Interview - ${interviewType}`,
            description: `${interviewDifficulty} difficulty mock interview session`,
          },
          unit_amount: Math.round(amount * 100), // Convert to paise
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/mock-interview/${sessionId}/result?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/mock-interview/${sessionId}/payment?canceled=true`,
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId,
      interviewSessionId: sessionId,
      interviewType,
      interviewDifficulty,
    },
  });

  return session;
}

// Helper to retrieve a checkout session
export async function getCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId);
}

// Helper to create a refund
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
) {
  const refundData: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    refundData.amount = amount;
  }

  if (reason) {
    refundData.reason = reason as Stripe.RefundCreateParams.Reason;
  }

  return await stripe.refunds.create(refundData);
}

// Helper to verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

// Helper to get payment intent details
export async function getPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}
