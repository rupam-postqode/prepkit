import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        console.log('PaymentIntent succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const sessionId = session.client_reference_id;
    const transactionId = session.id;

    if (!sessionId) {
      console.error('No session ID in checkout session');
      return;
    }

    // Update payment record
    await prisma.interviewPayment.updateMany({
      where: { transactionId },
      data: {
        status: 'CAPTURED',
        completedAt: new Date(),
      },
    });

    // Update interview session
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        paymentStatus: 'CAPTURED',
      },
    });

    console.log(`Payment completed for session: ${sessionId}`);

    // TODO: Send confirmation email
    // TODO: Trigger any post-payment actions

  } catch (error) {
    console.error('Error handling checkout completed:', error);
    throw error;
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  try {
    const sessionId = session.client_reference_id;
    const transactionId = session.id;

    if (!sessionId) {
      console.error('No session ID in expired checkout');
      return;
    }

    // Update payment record
    await prisma.interviewPayment.updateMany({
      where: { transactionId },
      data: {
        status: 'FAILED',
      },
    });

    // Update interview session
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        paymentStatus: 'FAILED',
      },
    });

    console.log(`Checkout expired for session: ${sessionId}`);

  } catch (error) {
    console.error('Error handling checkout expired:', error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const metadata = paymentIntent.metadata;
    const sessionId = metadata.sessionId;

    if (!sessionId) {
      console.error('No session ID in payment intent metadata');
      return;
    }

    // Update payment record
    await prisma.interviewPayment.updateMany({
      where: { sessionId },
      data: {
        status: 'FAILED',
      },
    });

    // Update interview session
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        paymentStatus: 'FAILED',
      },
    });

    console.log(`Payment failed for session: ${sessionId}`);

  } catch (error) {
    console.error('Error handling payment failed:', error);
    throw error;
  }
}
