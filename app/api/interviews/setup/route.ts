import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { interviewService } from '@/lib/services/interview/interviewService';
import { z } from 'zod';

const setupSchema = z.object({
  type: z.enum(['javascript', 'machine-coding', 'dsa', 'system-design', 'behavioral']),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  focusAreas: z.array(z.string()).min(1),
  specificRequirements: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = setupSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.issues
        },
        { status: 400 }
      );
    }

    const { type, difficulty, focusAreas, specificRequirements } = validation.data;

    // Create interview session
    const result = await interviewService.createInterviewSession({
      userId: session.user.id,
      type,
      difficulty,
      focusAreas,
      specificRequirements
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in interview setup:', error);
    return NextResponse.json(
      { error: 'Failed to setup interview' },
      { status: 500 }
    );
  }
}
