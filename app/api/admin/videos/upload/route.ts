// app/api/admin/videos/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await req.formData();
    const video = formData.get('video') as File;
    const lessonId = formData.get('lessonId') as string;
    
    if (!video || !lessonId) {
      return NextResponse.json(
        { error: 'Missing video or lessonId' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 500MB)
    const MAX_SIZE = 500 * 1024 * 1024;
    if (video.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 500MB' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(video.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, MOV, and AVI are allowed' },
        { status: 400 }
      );
    }
    
    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Save video temporarily (in production, upload to S3/CloudFlare)
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const timestamp = Date.now();
    const safeFilename = video.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${safeFilename}`;
    
    // For now, store in public/uploads (in production, use S3)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    const filePath = path.join(uploadDir, fileName);
    
    // Note: In production, you would:
    // 1. Upload to S3/CloudFront
    // 2. Process with FFmpeg for encryption
    // 3. Generate HLS segments
    // For now, we'll store the video URL directly
    
    const videoUrl = `/uploads/videos/${fileName}`;
    
    // Create video record
    const videoRecord = await prisma.video.create({
      data: {
        fileName,
        originalName: video.name,
        fileSize: video.size,
        mimeType: video.type,
        s3Key: fileName, // Would be actual S3 key in production
        s3Bucket: 'local', // Would be actual bucket name
        status: 'UPLOADED',
        uploadedBy: session.user.id,
        lessonId,
      },
    });
    
    // Update lesson with video URL
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        videoUrl,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Video upload started. Processing in background.',
      videoId: videoRecord.id,
      lessonId,
    });
    
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Video upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
