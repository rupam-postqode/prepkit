import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { interviewService } from '@/lib/services/interview/interviewService';

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId } = params;

    const result = await interviewService.startInterview(sessionId, session.user.id);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start interview' },
      { status: 500 }
    );
  }
}
