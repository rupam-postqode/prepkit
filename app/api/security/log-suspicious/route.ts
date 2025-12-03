// app/api/security/log-suspicious/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { lessonId, activityType, details } = await req.json();
    
    if (!lessonId || !activityType) {
      return NextResponse.json(
        { error: 'lessonId and activityType are required' },
        { status: 400 }
      );
    }
    
    // Log suspicious activity
    await prisma.suspiciousActivity.create({
      data: {
        userId: session.user.id,
        lessonId,
        activityType,
        details: details || null,
        timestamp: new Date(),
        resolved: false,
      },
    });
    
    // Check if user has multiple suspicious activities
    const recentActivities = await prisma.suspiciousActivity.count({
      where: {
        userId: session.user.id,
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });
    
    // If user has 3+ suspicious activities in last 24 hours, flag for review
    if (recentActivities >= 3) {
      console.warn(`User ${session.user.id} has ${recentActivities} suspicious activities in last 24h`);
      
      // In production, you might want to:
      // - Send alert to admin
      // - Temporarily suspend account
      // - Require additional verification
    }
    
    return NextResponse.json({
      success: true,
      message: 'Activity logged',
    });
    
  } catch (error) {
    console.error('Log suspicious activity error:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}
