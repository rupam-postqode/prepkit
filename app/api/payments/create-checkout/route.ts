import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Interview pricing in INR (paise)
const INTERVIEW_PRICING: Record<string, { amount: number; description: string }> = {
  JAVASCRIPT: {
    amount: 9900, // ₹99
    description: 'JavaScript Interview Session',
  },
  MACHINE_CODING: {
    amount: 14900, // ₹149
    description: 'Machine Coding Round',
  },
  DSA: {
    amount: 12900, // ₹129
    description: 'Data Structures & Algorithms Interview',
  },
  SYSTEM_DESIGN: {
    amount: 19900, // ₹199
    description: 'System Design Interview',
  },
  BEHAVIORAL: {
    amount: 9900, // ₹99
    description: 'Behavioral Interview',
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, interviewType } = body;

    if (!sessionId || !interviewType) {
      return NextResponse.json(
        { error: 'Session ID and interview type are required' },
        { status: 400 }
      );
    }

    // Get interview session
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!interviewSession) {
      return NextResponse.json(
        { error: 'Interview session not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (interviewSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to this session' },
        { status: 403 }
      );
    }

    // Check if already paid
    if (interviewSession.paymentStatus === 'CAPTURED') {
      return NextResponse.json(
        { error: 'This interview has already been paid for' },
        { status: 400 }
      );
    }

    // Get pricing
    const pricing = INTERVIEW_PRICING[interviewType];
    if (!pricing) {
      return NextResponse.json(
        { error: 'Invalid interview type' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: pricing.description,
              description: `Mock Interview Session - ${interviewType}`,
              images: ['https://your-domain.com/interview-icon.png'], // Add your logo
            },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mock-interview/${sessionId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mock-interview/${sessionId}/payment?payment=cancelled`,
      customer_email: session.user.email || undefined,
      client_reference_id: sessionId,
      metadata: {
        sessionId,
        userId: session.user.id,
        interviewType,
      },
    });

    // Create payment record
    await prisma.interviewPayment.create({
      data: {
        userId: session.user.id,
        sessionId: sessionId,
        amount: pricing.amount / 100, // Convert paise to rupees
        currency: 'INR',
        status: 'CREATED',
        transactionId: checkoutSession.id,
      },
    });

    // Update interview session
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        paymentStatus: 'CREATED',
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });

  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
