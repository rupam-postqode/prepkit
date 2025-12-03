import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

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

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round((interviewSession.costCalculated || 149) * 100), // Convert to paise
      currency: 'INR',
      receipt: sessionId,
      notes: {
        sessionId,
        userId: session.user.id,
        type: interviewSession.type,
        difficulty: interviewSession.difficulty
      }
    });

    // Create payment record
    await prisma.interviewPayment.create({
      data: {
        userId: session.user.id,
        sessionId,
        amount: interviewSession.costCalculated || 149,
        currency: 'INR',
        status: 'CREATED',
        paymentMethodId: order.id
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
