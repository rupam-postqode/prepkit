import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { interviewService } from '@/lib/services/interview/interviewService';
import crypto from 'crypto';

// Verify Vapi webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-vapi-signature');
    
    // Verify webhook signature if secret is configured
    if (process.env.VAPI_WEBHOOK_SECRET && signature) {
      const isValid = verifyWebhookSignature(
        body,
        signature,
        process.env.VAPI_WEBHOOK_SECRET
      );
      
      if (!isValid) {
        console.error('Invalid Vapi webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(body);
    console.log('Vapi webhook event:', event.type, event);

    const callId = event.call?.id || event.callId;
    
    // Find session by Vapi call ID
    const session = await prisma.interviewSession.findFirst({
      where: { vapiCallId: callId }
    });

    if (!session) {
      console.warn('Session not found for Vapi call:', callId);
      return NextResponse.json({ received: true });
    }

    switch (event.type) {
      case 'call-start':
      case 'call.started':
        await prisma.interviewSession.update({
          where: { id: session.id },
          data: {
            status: 'IN_PROGRESS',
            startedAt: new Date()
          }
        });
        break;

      case 'call-end':
      case 'call.ended':
        await prisma.interviewSession.update({
          where: { id: session.id },
          data: {
            status: 'COMPLETED',
            endedAt: new Date(),
            durationSeconds: event.call?.duration || event.duration || 0
          }
        });
        
        // Trigger report generation asynchronously
        // In production, use a job queue like Bull/BullMQ
        interviewService.completeInterview(session.id).catch((error) => {
          console.error('Error generating report:', error);
        });
        break;

      case 'transcript':
      case 'call.transcript':
        // Transcript is handled in completeInterview
        break;

      case 'recording':
      case 'call.recording':
        if (event.recordingUrl || event.recording?.url) {
          await prisma.interviewSession.update({
            where: { id: session.id },
            data: {
              vapiRecordingUrl: event.recordingUrl || event.recording?.url
            }
          });
        }
        break;

      case 'call-failed':
      case 'call.failed':
        await prisma.interviewSession.update({
          where: { id: session.id },
          data: {
            status: 'FAILED',
            metadata: {
              ...((session.metadata as object) || {}),
              error: event.error || event.message,
              failureReason: event.reason
            }
          }
        });
        break;

      default:
        console.log('Unhandled Vapi webhook event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Vapi webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
