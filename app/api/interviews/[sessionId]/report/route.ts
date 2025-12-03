import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { interviewService } from '@/lib/services/interview/interviewService';

export async function GET(
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

    const report = await interviewService.getInterviewReport(sessionId, session.user.id);

    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error getting interview report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get report' },
      { status: 500 }
    );
  }
}
