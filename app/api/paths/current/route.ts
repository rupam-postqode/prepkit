import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's current learning path
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        learningPath: true,
        learningPathProgress: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate progress for each path
    const progress: Record<string, number> = {};
    
    if (user.learningPathProgress) {
      try {
        const pathProgress = JSON.parse(user.learningPathProgress as string);
        Object.keys(pathProgress).forEach(pathId => {
          progress[pathId] = pathProgress[pathId] || 0;
        });
      } catch (error) {
        console.error('Failed to parse learning path progress:', error);
      }
    }

    return NextResponse.json({
      success: true,
      path: user.learningPath ? {
        id: user.learningPath,
        // Frontend will match this ID with the LEARNING_PATHS array
      } : null,
      progress,
    });

  } catch (error) {
    console.error('Failed to get current path:', error);
    return NextResponse.json(
      { error: 'Failed to get current path' },
      { status: 500 }
    );
  }
}
