import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { interviewService } from '@/lib/services/interview/interviewService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    await interviewService.completeInterview(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Interview completed and report generated'
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete interview' },
      { status: 500 }
    );
  }
}
