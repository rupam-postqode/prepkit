import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createInterviewCheckout } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId } = await req.json();

    // Get interview session
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId }
    });

    if (!interviewSession) {
      return NextResponse.json(
        { error: 'Interview session not found' },
        { status: 404 }
      );
    }

    if (interviewSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create Stripe Checkout Session
    const checkoutSession = await createInterviewCheckout(
      session.user.id,
      sessionId,
      interviewSession.costCalculated || 149,
      session.user.email || '',
      interviewSession.type,
      interviewSession.difficulty
    );

    // Create payment record
    await prisma.interviewPayment.create({
      data: {
        userId: session.user.id,
        sessionId,
        amount: interviewSession.costCalculated || 149,
        currency: 'INR',
        status: 'CREATED',
        paymentMethodId: checkoutSession.id
      }
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      amount: Math.round((interviewSession.costCalculated || 149) * 100),
      currency: 'INR'
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
