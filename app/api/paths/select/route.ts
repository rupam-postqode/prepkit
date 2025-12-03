import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pathId } = body;

    if (!pathId) {
      return NextResponse.json({ error: 'Path ID is required' }, { status: 400 });
    }

    // Update user's learning path
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        learningPath: pathId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Learning path selected successfully',
      pathId,
    });

  } catch (error) {
    console.error('Failed to select path:', error);
    return NextResponse.json(
      { error: 'Failed to select path' },
      { status: 500 }
    );
  }
}
