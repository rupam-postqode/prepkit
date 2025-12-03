// app/api/videos/playback-token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { DeviceFingerprintService } from '@/lib/services/device-fingerprinting';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { lessonId } = await req.json();
    
    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }
    
    // 1. Verify subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        subscriptionStatus: true, 
        subscriptionEndDate: true,
        email: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (user.subscriptionStatus !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'No active subscription' },
        { status: 403 }
      );
    }
    
    // Check subscription expiry
    if (user.subscriptionEndDate && user.subscriptionEndDate < new Date()) {
      return NextResponse.json(
        { error: 'Subscription expired' },
        { status: 403 }
      );
    }
    
    // 2. Verify lesson access
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { 
        premium: true, 
        videoUrl: true,
        encryptionKey: true,
      },
    });
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    
    if (!lesson.videoUrl) {
      return NextResponse.json({ error: 'No video available for this lesson' }, { status: 404 });
    }
    
    if (lesson.premium && user.subscriptionStatus !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Premium content requires active subscription' },
        { status: 403 }
      );
    }
    
    // 3. Device fingerprinting and limit check
    const deviceService = new DeviceFingerprintService();
    const deviceFingerprint = await deviceService.generateFingerprint(req);
    
    const deviceCount = await deviceService.getActiveDeviceCount(session.user.id);
    
    const MAX_DEVICES = 2;
    
    if (deviceCount >= MAX_DEVICES) {
      const isRegistered = await deviceService.verifyDevice(
        session.user.id,
        deviceFingerprint
      );
      
      if (!isRegistered) {
        return NextResponse.json({
          error: 'Device limit reached. Please logout from another device.',
          code: 'DEVICE_LIMIT_EXCEEDED',
          maxDevices: MAX_DEVICES,
          currentDevices: deviceCount,
        }, { status: 403 });
      }
    } else {
      // Register new device
      await deviceService.registerDevice(session.user.id, deviceFingerprint);
    }
    
    // 4. Generate playback token (JWT)
    const playbackToken = jwt.sign(
      {
        user_id: session.user.id,
        lesson_id: lessonId,
        device_id: deviceFingerprint,
        email: user.email,
        watermark_text: `${user.email} | ${new Date().toISOString()}`,
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      },
      process.env.VIDEO_JWT_SECRET || 'fallback-secret-change-in-production'
    );
    
    // 5. Get video URL (in real scenario, would be CloudFront signed URL)
    const videoUrl = lesson.videoUrl;
    
    // 6. Log access
    await prisma.videoAccessLog.create({
      data: {
        userId: session.user.id,
        lessonId,
        deviceFingerprint,
        ipAddress: req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        accessedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      playbackUrl: videoUrl,
      token: playbackToken,
      expiresIn: 900, // 15 minutes in seconds
      watermarkText: user.email,
    });
    
  } catch (error) {
    console.error('Playback token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate playback token' },
      { status: 500 }
    );
  }
}
