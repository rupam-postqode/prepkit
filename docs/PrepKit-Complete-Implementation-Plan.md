# PrepKit - Complete Implementation Plan & Technical Specification

**Document Version:** 2.0  
**Last Updated:** December 3, 2025  
**Status:** Production Implementation Ready  
**Estimated Timeline:** 11 weeks  
**Priority:** Critical Path to Launch

---

## 📋 Executive Summary

This document provides a comprehensive, production-ready implementation plan for completing PrepKit's remaining features. Based on the current state analysis, PrepKit is **75% complete** with excellent content and backend infrastructure. This plan focuses on the critical 25% needed for competitive launch.

### Current State
✅ **Complete:**
- 5 learning modules (231 lessons, 300+ problems)
- Database schema and backend APIs
- Authentication and subscription system
- Basic content protection
- Mock interview backend services

🚧 **In Progress:**
- Video DRM and encryption
- Mock interview frontend
- Assessment system
- Advanced analytics

### Implementation Phases

| Phase | Focus | Duration | Priority | Status |
|-------|-------|----------|----------|--------|
| 1 | Enterprise-Grade Video DRM | 4 weeks | 🔴 Critical | Not Started |
| 2 | Mock Interview Completion | 2 weeks | 🔴 Critical | Backend Done |
| 3 | Assessment & Validation | 2 weeks | 🟡 High | Not Started |
| 4 | Advanced Analytics | 2 weeks | 🟡 High | Not Started |
| 5 | Admin Panel Enhancement | 1 week | 🟢 Medium | Partial |

**Total Duration:** 11 weeks  
**Launch Ready:** End of Week 11

---

## 🎯 Key Decisions Made

### ✅ What to Build
1. **Enterprise-Grade Video DRM** - AWS S3 + CloudFront with HLS encryption
2. **Mock Interview Frontend** - Complete the revenue-generating feature
3. **Chapter Quizzes** - Validate learning outcomes
4. **Analytics Dashboard** - Track progress and performance

### ❌ What NOT to Build
1. **In-Platform Code Editor** - External links sufficient (LeetCode, CodeSandbox)
2. **Community Features** - Forums, social features (future phase)
3. **Mobile Apps** - Web-first, mobile later
4. **Job Board** - Different business model
5. **Live Classes** - Not scalable

This focused approach allows launch in 11 weeks with competitive feature parity.

---

# PHASE 1: ENTERPRISE-GRADE VIDEO DRM PROTECTION

**Duration:** 4 weeks  
**Priority:** 🔴 Critical  
**Goal:** Implement multi-layer video protection preventing piracy

## 1.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     VIDEO SECURITY ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  USER REQUEST: "Play video for Lesson X"                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: AUTHENTICATION & AUTHORIZATION                         │
│  ├─ Verify JWT session token                                    │
│  ├─ Check subscription status (active/expired)                  │
│  ├─ Verify lesson access (premium content check)                │
│  └─ Check device limit (max 2 devices)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: DEVICE FINGERPRINTING                                  │
│  ├─ Generate device fingerprint (browser + OS + hardware)       │
│  ├─ Check against registered devices                            │
│  ├─ Auto-register if < 2 devices                                │
│  └─ Reject if device limit exceeded                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: PLAYBACK TOKEN GENERATION                              │
│  ├─ Create time-limited JWT (15 min expiry)                     │
│  ├─ Include: user_id, lesson_id, device_id, watermark_text     │
│  ├─ Generate CloudFront signed URL                              │
│  └─ Return playback URL + token + encryption key endpoint       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: VIDEO STREAMING (AWS CloudFront)                       │
│  ├─ Serve encrypted HLS segments (.ts files)                    │
│  ├─ Validate signed URL on each segment request                 │
│  ├─ Return encrypted manifest (.m3u8)                           │
│  └─ Serve encryption keys via secure endpoint                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 5: CLIENT-SIDE PLAYBACK                                   │
│  ├─ Custom video player (Video.js with DRM)                     │
│  ├─ Decrypt video segments using fetched keys                   │
│  ├─ Apply dynamic watermark overlay                             │
│  └─ Monitor for suspicious activity                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 6: BROWSER SECURITY                                       │
│  ├─ Disable right-click on video                               │
│  ├─ Disable DevTools (detect & pause video)                    │
│  ├─ Prevent screenshot (PrintScreen key interception)          │
│  ├─ Prevent screen recording (API detection)                   │
│  ├─ Blur video on window focus loss                            │
│  └─ Pause video on suspicious activity                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 7: DYNAMIC WATERMARKING                                   │
│  ├─ Display user email + timestamp                             │
│  ├─ Rotate position every 30 seconds                           │
│  ├─ Semi-transparent (40% opacity)                             │
│  └─ Traceable if content leaked                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 8: MONITORING & ENFORCEMENT                               │
│  ├─ Log all video access events                                │
│  ├─ Detect suspicious patterns (multiple IPs, rapid device     │
│  │   changes, unusual access times)                             │
│  ├─ Auto-suspend accounts on violations                        │
│  ├─ Scan web for leaked content (Google, Telegram)            │
│  └─ DMCA takedown automation                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 AWS Infrastructure Setup

### S3 Bucket Configuration

```bash
# Create S3 bucket via AWS CLI
aws s3api create-bucket \
  --bucket prepkit-videos-encrypted \
  --region us-east-1 \
  --acl private

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket prepkit-videos-encrypted \
  --versioning-configuration Status=Enabled

# Enable server-side encryption
aws s3api put-bucket-encryption \
  --bucket prepkit-videos-encrypted \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block all public access
aws s3api put-public-access-block \
  --bucket prepkit-videos-encrypted \
  --public-access-block-configuration \
    BlockPublicAcls=true,\
    IgnorePublicAcls=true,\
    BlockPublicPolicy=true,\
    RestrictPublicBuckets=true

# Set lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket prepkit-videos-encrypted \
  --lifecycle-configuration file://lifecycle.json
```

**lifecycle.json:**
```json
{
  "Rules": [
    {
      "Id": "TransitionToIA",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

### CloudFront Distribution

```typescript
// CloudFront configuration using AWS CDK or Terraform

const distribution = new cloudfront.Distribution(stack, 'VideoCDN', {
  defaultBehavior: {
    origin: new origins.S3Origin(videoBucket, {
      originAccessIdentity: oai, // No direct S3 access
    }),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
    allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
    cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
    compress: true,
    cachePolicy: new cloudfront.CachePolicy(stack, 'VideoCache', {
      minTtl: Duration.seconds(0),
      defaultTtl: Duration.minutes(15),
      maxTtl: Duration.minutes(30),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
        'Authorization',
        'X-Video-Token'
      ),
    }),
  },
  priceClass: cloudfront.PriceClass.PRICE_CLASS_200, // US, Europe, Asia
  geoRestriction: cloudfront.GeoRestriction.allowlist('IN', 'US', 'GB', 'CA'), // Restrict by country if needed
  webAclId: wafArn, // AWS WAF for additional security
});
```

### IAM Roles & Permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::prepkit-videos-encrypted/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetDistribution"
      ],
      "Resource": "arn:aws:cloudfront::*:distribution/*"
    }
  ]
}
```

## 1.3 Video Processing Pipeline

### Upload & Encryption Service

```typescript
// lib/services/video/videoEncryptionService.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import ffmpeg from 'fluent-ffmpeg';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db';

export class VideoEncryptionService {
  private s3Client: S3Client;
  private readonly BUCKET_NAME = 'prepkit-videos-encrypted';
  private readonly SEGMENT_DURATION = 10; // seconds
  
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  
  /**
   * Main processing function
   * Flow: Raw Video → Encrypted HLS → S3 Upload → Database Update
   */
  async processVideo(
    videoPath: string,
    lessonId: string,
    originalFilename: string
  ): Promise<void> {
    const workDir = path.join('/tmp', `video_${lessonId}_${Date.now()}`);
    
    try {
      // 1. Create working directory
      fs.mkdirSync(workDir, { recursive: true });
      
      // 2. Generate encryption key and IV
      const encryptionKey = crypto.randomBytes(16);
      const iv = crypto.randomBytes(16);
      
      // 3. Create key info file for FFmpeg
      const keyInfoPath = await this.createKeyInfoFile(
        workDir,
        encryptionKey,
        iv,
        lessonId
      );
      
      // 4. Convert to encrypted HLS
      await this.convertToEncryptedHLS(
        videoPath,
        workDir,
        keyInfoPath
      );
      
      // 5. Upload all files to S3
      await this.uploadToS3(workDir, lessonId);
      
      // 6. Store encryption metadata in database
      await this.storeEncryptionMetadata(
        lessonId,
        encryptionKey,
        iv,
        originalFilename
      );
      
      // 7. Cleanup
      await this.cleanup(workDir, videoPath);
      
      console.log(`Video processed successfully for lesson: ${lessonId}`);
    } catch (error) {
      console.error('Video processing failed:', error);
      await this.cleanup(workDir, videoPath);
      throw error;
    }
  }
  
  /**
   * Create key info file required by FFmpeg for HLS encryption
   */
  private async createKeyInfoFile(
    workDir: string,
    key: Buffer,
    iv: Buffer,
    lessonId: string
  ): Promise<string> {
    const keyPath = path.join(workDir, 'encryption.key');
    const keyInfoPath = path.join(workDir, 'key_info.txt');
    
    // Write encryption key to file
    fs.writeFileSync(keyPath, key);
    
    // Key info format for FFmpeg:
    // Line 1: Key URI (URL where player will fetch the key)
    // Line 2: Path to key file
    // Line 3: IV in hex format
    const keyUri = `${process.env.NEXT_PUBLIC_API_URL}/api/video-keys/${lessonId}`;
    const keyInfoContent = `${keyUri}\n${keyPath}\n${iv.toString('hex')}`;
    
    fs.writeFileSync(keyInfoPath, keyInfoContent);
    
    return keyInfoPath;
  }
  
  /**
   * Convert video to encrypted HLS format
   */
  private convertToEncryptedHLS(
    inputPath: string,
    outputDir: string,
    keyInfoPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const outputPath = path.join(outputDir, 'playlist.m3u8');
      
      ffmpeg(inputPath)
        // Video codec settings
        .videoCodec('libx264')
        .outputOptions([
          '-profile:v baseline', // Compatible with most devices
          '-level 3.0',
          '-pix_fmt yuv420p',
          '-movflags +faststart',
        ])
        // Audio codec settings
        .audioCodec('aac')
        .audioBitrate('128k')
        .audioChannels(2)
        // HLS settings
        .outputOptions([
          '-f hls',
          '-hls_time ' + this.SEGMENT_DURATION,
          '-hls_list_size 0', // Include all segments in playlist
          '-hls_segment_filename ' + path.join(outputDir, 'segment_%03d.ts'),
          '-hls_key_info_file ' + keyInfoPath,
          '-hls_flags independent_segments', // Each segment is independently decodable
        ])
        // Multiple quality levels (adaptive bitrate)
        .outputOptions([
          '-b:v:0 800k', '-maxrate:v:0 856k', '-bufsize:v:0 1200k', // 720p
          '-b:v:1 400k', '-maxrate:v:1 428k', '-bufsize:v:1 600k',  // 480p
          '-b:a:0 128k',
          '-b:a:1 64k',
        ])
        .output(outputPath)
        .on('start', (cmd) => {
          console.log('FFmpeg command:', cmd);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent?.toFixed(2)}% done`);
        })
        .on('end', () => {
          console.log('Video conversion completed');
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .run();
    });
  }
  
  /**
   * Upload all HLS files to S3
   */
  private async uploadToS3(workDir: string, lessonId: string): Promise<void> {
    const files = fs.readdirSync(workDir);
    const uploads: Promise<void>[] = [];
    
    for (const file of files) {
      // Skip key files (never upload encryption keys to S3)
      if (file.endsWith('.key') || file.endsWith('key_info.txt')) {
        continue;
      }
      
      const filePath = path.join(workDir, file);
      const fileContent = fs.readFileSync(filePath);
      const s3Key = `lessons/${lessonId}/${file}`;
      
      const contentType = this.getContentType(file);
      
      const uploadPromise = this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.BUCKET_NAME,
          Key: s3Key,
          Body: fileContent,
          ContentType: contentType,
          ServerSideEncryption: 'AES256',
          Metadata: {
            lessonId,
            uploadedAt: new Date().toISOString(),
          },
        })
      ).then(() => {
        console.log(`Uploaded: ${s3Key}`);
      });
      
      uploads.push(uploadPromise);
    }
    
    await Promise.all(uploads);
    console.log(`All files uploaded for lesson ${lessonId}`);
  }
  
  /**
   * Store encryption metadata in database
   */
  private async storeEncryptionMetadata(
    lessonId: string,
    encryptionKey: Buffer,
    iv: Buffer,
    originalFilename: string
  ): Promise<void> {
    // Encrypt the encryption key before storing (meta-encryption)
    const masterKey = Buffer.from(process.env.MASTER_ENCRYPTION_KEY!, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', masterKey, iv);
    
    let encryptedKey = cipher.update(encryptionKey);
    encryptedKey = Buffer.concat([encryptedKey, cipher.final()]);
    
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        videoUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/lessons/${lessonId}/playlist.m3u8`,
        encryptionKey: encryptedKey.toString('base64'),
        encryptionIv: iv.toString('base64'),
        keyVersion: '1', // For key rotation
        updatedAt: new Date(),
      },
    });
    
    console.log(`Encryption metadata stored for lesson ${lessonId}`);
  }
  
  /**
   * Cleanup temporary files
   */
  private async cleanup(workDir: string, originalVideoPath: string): Promise<void> {
    try {
      // Remove working directory
      if (fs.existsSync(workDir)) {
        fs.rmSync(workDir, { recursive: true, force: true });
      }
      
      // Remove original uploaded file
      if (fs.existsSync(originalVideoPath)) {
        fs.unlinkSync(originalVideoPath);
      }
      
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
  
  private getContentType(filename: string): string {
    if (filename.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
    if (filename.endsWith('.ts')) return 'video/mp2t';
    if (filename.endsWith('.mp4')) return 'video/mp4';
    return 'application/octet-stream';
  }
}
```

### Admin Video Upload API

```typescript
// app/api/admin/videos/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VideoEncryptionService } from '@/lib/services/video/videoEncryptionService';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 2. Parse form data
    const formData = await req.formData();
    const video = formData.get('video') as File;
    const lessonId = formData.get('lessonId') as string;
    
    if (!video || !lessonId) {
      return NextResponse.json(
        { error: 'Missing video or lessonId' },
        { status: 400 }
      );
    }
    
    // 3. Validate file size (max 500MB)
    const MAX_SIZE = 500 * 1024 * 1024; // 500MB
    if (video.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 500MB' },
        { status: 400 }
      );
    }
    
    // 4. Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(video.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, MOV, and AVI are allowed' },
        { status: 400 }
      );
    }
    
    // 5. Save temporary file
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempDir = '/tmp/uploads';
    const tempPath = path.join(tempDir, `${lessonId}_${Date.now()}_${video.name}`);
    
    await writeFile(tempPath, buffer);
    
    // 6. Process video asynchronously
    const encryptionService = new VideoEncryptionService();
    
    // In production, use a queue (Bull/BullMQ) for background processing
    encryptionService.processVideo(tempPath, lessonId, video.name)
      .then(() => {
        console.log(`Video processed successfully: ${lessonId}`);
      })
      .catch((error) => {
        console.error(`Video processing failed: ${lessonId}`, error);
      });
    
    return NextResponse.json({
      success: true,
      message: 'Video upload started. Processing in background.',
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
    bodyParser: false, // Disable default body parser for file uploads
  },
};
```

## 1.4 Secure Playback System

### Playback Token API

```typescript
// app/api/videos/playback-token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
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
    
    // 1. Verify subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionStatus: true, subscriptionEndDate: true },
    });
    
    if (user?.subscriptionStatus !== 'ACTIVE') {
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
      select: { premium: true, videoUrl: true },
    });
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
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
    
    const deviceCount = await prisma.userDevice.count({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });
    
    if (deviceCount >= 2) {
      const isRegistered = await deviceService.verifyDevice(
        session.user.id,
        deviceFingerprint
      );
      
      if (!isRegistered) {
        return NextResponse.json({
          error: 'Device limit reached. Please logout from another device.',
          code: 'DEVICE_LIMIT_EXCEEDED',
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
        email: session.user.email,
        watermark_text: `${session.user.email} | ${new Date().toISOString()}`,
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      },
      process.env.VIDEO_JWT_SECRET!
    );
    
    // 5. Generate CloudFront signed URL
    const cloudfrontUrl = lesson.videoUrl!;
    const expiresIn = 900; // 15 minutes
    
    const signedUrl = getSignedUrl({
      url: cloudfrontUrl,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
      dateLessThan: new Date(Date.now() + expiresIn * 1000).toISOString(),
    });
    
    // 6. Log access
    await prisma.videoAccessLog.create({
      data: {
        userId: session.user.id,
        lessonId,
        deviceFingerprint,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        accessedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      playbackUrl: signedUrl,
      token: playbackToken,
      expiresIn,
      watermarkText: `${session.user.email}`,
    });
    
  } catch (error) {
    console.error('Playback token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate playback token' },
      { status: 500 }
    );
  }
}
```

### Video Decryption Key API

```typescript
// app/api/video-keys/[lessonId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    // 1. Verify video playback token from header
    const token = req.headers.get('X-Video-Token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing video token' },
        { status: 401 }
      );
    }
    
    // 2. Decode and verify JWT
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.VIDEO_JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // 3. Verify lesson_id matches
    if (payload.lesson_id !== params.lessonId) {
      return NextResponse.json(
        { error: 'Token lesson mismatch' },
        { status: 403 }
      );
    }
    
    // 4. Retrieve encrypted key from database
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      select: {
        encryptionKey: true,
        encryptionIv: true,
      },
    });
    
    if (!lesson || !lesson.encryptionKey) {
      return NextResponse.json(
        { error: 'Encryption key not found' },
        { status: 404 }
      );
    }
    
    // 5. Decrypt the encryption key
    const masterKey = Buffer.from(process.env.MASTER_ENCRYPTION_KEY!, 'hex');
    const iv = Buffer.from(lesson.encryptionIv!, 'base64');
    const encryptedKey = Buffer.from(lesson.encryptionKey, 'base64');
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', masterKey, iv);
    let decryptedKey = decipher.update(encryptedKey);
    decryptedKey = Buffer.concat([decryptedKey, decipher.final()]);
    
    // 6. Return the decryption key
    return new Response(decryptedKey, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL!,
      },
    });
    
  } catch (error) {
    console.error('Key retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve encryption key' },
      { status: 500 }
    );
  }
}
```

## 1.5 Custom Secure Video Player

```typescript
// components/SecureVideoPlayer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface SecureVideoPlayerProps {
  lessonId: string;
  userEmail: string;
  onProgress?: (seconds: number) => void;
}

export default function SecureVideoPlayer({ 
  lessonId, 
  userEmail,
  onProgress 
}: SecureVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 10, y: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    initializePlayer();
    
    // Setup all security measures
    preventScreenshot();
    preventScreenRecording();
    preventRightClick();
    preventDevTools();
    setupWatermark();
    monitorWindowFocus();
    setupHeartbeat();
    
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [lessonId]);
  
  const initializePlayer = async () => {
    if (!videoRef.current) return;
    
    try {
      setIsLoading(true);
      
      // Get playback token from API
      const response = await fetch('/api/videos/playback-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get playback token');
      }
      
      const { playbackUrl, token } = await response.json();
      
      // Initialize Video.js player
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        responsive: true,
        controlBar: {
          downloadButton: false,
          pictureInPictureToggle: false,
          volumePanel: {
            inline: false,
          },
        },
        html5: {
          vhs: {
            withCredentials: true,
            overrideNative: true,
            useBandwidthFromLocalStorage: true,
          },
        },
        sources: [{
          src: playbackUrl,
          type: 'application/x-mpegURL',
        }],
      });
      
      // Add authentication header to XHR requests
      player.tech().vhs.xhr.beforeRequest = (options: any) => {
        options.headers = {
          ...options.headers,
          'X-Video-Token': token,
        };
        return options;
      };
      
      // Track progress
      player.on('timeupdate', () => {
        const currentTime = player.currentTime();
        if (currentTime && onProgress) {
          onProgress(Math.floor(currentTime));
        }
      });
      
      player.on('error', () => {
        const error = player.error();
        setError(error?.message || 'Video playback error');
      });
      
      playerRef.current = player;
      setIsLoading(false);
      
    } catch (err: any) {
      console.error('Player initialization error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };
  
  const preventScreenshot = () => {
    document.addEventListener('keydown', (e) => {
      // Detect PrintScreen, Cmd+Shift+3/4 (Mac), Win+Shift+S (Windows)
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) ||
        (e.key === 's' && e.shiftKey && (e.metaKey || e.ctrlKey))
      ) {
        e.preventDefault();
        
        if (playerRef.current) {
          playerRef.current.pause();
        }
        
        alert('⚠️ Screenshots are not allowed. Video paused.');
        logSuspiciousActivity('screenshot_attempt');
      }
    });
  };
  
  const preventScreenRecording = () => {
    // Check for screen recording software
    const checkInterval = setInterval(() => {
      // Detect common screen recording APIs
      if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
        const original = navigator.mediaDevices.getDisplayMedia;
        
        navigator.mediaDevices.getDisplayMedia = async function(...args) {
          if (playerRef.current) {
            playerRef.current.pause();
          }
          
          alert('⚠️ Screen recording detected. Video paused.');
          logSuspiciousActivity('screen_recording_detected');
          
          throw new Error('Screen recording is not allowed');
        };
      }
    }, 5000);
    
    return () => clearInterval(checkInterval);
  };
  
  const preventRightClick = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Prevent dragging
      videoElement.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
    }
  };
  
  const preventDevTools = () => {
    // Detect DevTools by checking viewport size difference
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > threshold || heightDiff > threshold) {
        if (playerRef.current && !playerRef.current.paused()) {
          playerRef.current.pause();
          alert('⚠️ Developer tools detected. Video paused.');
          logSuspiciousActivity('devtools_detected');
        }
      }
    };
    
    const interval = setInterval(detectDevTools, 1000);
    return () => clearInterval(interval);
  };
  
  const setupWatermark = () => {
    // Rotate watermark position every 30 seconds
    const interval = setInterval(() => {
      const positions = [
        { x: 20, y: 20 },
        { x: window.innerWidth - 320, y: 20 },
        { x: 20, y: window.innerHeight - 80 },
        { x: window.innerWidth - 320, y: window.innerHeight - 80 },
        { x: window.innerWidth / 2 - 150, y: 50 },
      ];
      
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setWatermarkPosition(randomPos);
    }, 30000);
    
    return () => clearInterval(interval);
  };
  
  const monitorWindowFocus = () => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && playerRef.current) {
        playerRef.current.pause();
      }
    });
    
    window.addEventListener('blur', () => {
      if (videoRef.current) {
        videoRef.current.style.filter = 'blur(20px)';
      }
    });
    
    window.addEventListener('focus', () => {
      if (videoRef.current) {
        videoRef.current.style.filter = 'none';
      }
    });
  };
  
  const setupHeartbeat = () => {
    const interval = setInterval(async () => {
      if (playerRef.current) {
        await fetch('/api/videos/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            currentTime: playerRef.current.currentTime() || 0,
            isPlaying: !playerRef.current.paused(),
          }),
        });
      }
    }, 30000);
    
    return () => clearInterval(interval);
  };
  
  const logSuspiciousActivity = async (activityType: string) => {
    try {
      await fetch('/api/security/log-suspicious', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          activityType,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to log suspicious activity:', error);
    }
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Video Error</p>
        <p className="text-sm text-red-500 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="relative w-full select-none">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-white">Loading secure video...</div>
        </div>
      )}
      
      {/* Video Player */}
      <div data-vjs-player className="relative">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
      
      {/* Dynamic Watermark */}
      <div
        className="absolute pointer-events-none select-none z-10"
        style={{
          left: `${watermarkPosition.x}px`,
          top: `${watermarkPosition.y}px`,
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          transition: 'all 2s ease-out',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '4px 8px',
          borderRadius: '4px',
        }}
      >
        {userEmail} • {new Date().toLocaleDateString()}
      </div>
      
      {/* Invisible overlay to prevent interactions */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{ zIndex: 5 }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
}
```

## 1.6 Device Fingerprinting Service

```typescript
// lib/services/device-fingerprinting.ts

import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export class DeviceFingerprintService {
  
  /**
   * Generate device fingerprint from request headers
   */
  async generateFingerprint(req: NextRequest): Promise<string> {
    const userAgent = req.headers.get('user-agent') || '';
    const acceptLanguage = req.headers.get('accept-language') || '';
    const acceptEncoding = req.headers.get('accept-encoding') || '';
    
    // Client will send additional device info
    const clientData = req.headers.get('x-device-data');
    
    const fingerprintData = {
      userAgent,
      acceptLanguage,
      acceptEncoding,
      clientData,
    };
    
    return this.hashFingerprint(JSON.stringify(fingerprintData));
  }
  
  private hashFingerprint(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  
  /**
   * Register a new device for a user
   */
  async registerDevice(userId: string, fingerprint: string): Promise<void> {
    const existingDevice = await prisma.userDevice.findFirst({
      where: {
        userId,
        fingerprint,
      },
    });
    
    if (existingDevice) {
      // Update last used
      await prisma.userDevice.update({
        where: { id: existingDevice.id },
        data: {
          lastUsed: new Date(),
          isActive: true,
        },
      });
      return;
    }
    
    // Create new device
    await prisma.userDevice.create({
      data: {
        userId,
        fingerprint,
        isActive: true,
        lastUsed: new Date(),
      },
    });
  }
  
  /**
   * Verify if device is registered
   */
  async verifyDevice(userId: string, fingerprint: string): Promise<boolean> {
    const device = await prisma.userDevice.findFirst({
      where: {
        userId,
        fingerprint,
        isActive: true,
      },
    });
    
    if (device) {
      // Update last used
      await prisma.userDevice.update({
        where: { id: device.id },
        data: { lastUsed: new Date() },
      });
      return true;
    }
    
    return false;
  }
  
  /**
   * Get active device count for user
   */
  async getActiveDeviceCount(userId: string): Promise<number> {
    return await prisma.userDevice.count({
      where: {
        userId,
        isActive: true,
      },
    });
  }
  
  /**
   * Deactivate a device
   */
  async deactivateDevice(userId: string, fingerprint: string): Promise<void> {
    await prisma.userDevice.updateMany({
      where: {
        userId,
        fingerprint,
      },
      data: {
        isActive: false,
      },
    });
  }
  
  /**
   * Get all devices for user
   */
  async getUserDevices(userId: string) {
    return await prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastUsed: 'desc' },
    });
  }
}
```

## 1.7 Database Schema Updates

```prisma
// Add to prisma/schema.prisma

model UserDevice {
  id          String   @id @default(cuid())
  userId      String
  fingerprint String
  deviceName  String?
  isActive    Boolean  @default(true)
  lastUsed    DateTime @default(now())
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, fingerprint])
  @@index([userId])
  @@index([fingerprint])
}

model VideoAccessLog {
  id                String   @id @default(cuid())
  userId            String
  lessonId          String
  deviceFingerprint String
  ipAddress         String
  userAgent         String
  accessedAt        DateTime @default(now())
  
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson            Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([lessonId])
  @@index([accessedAt])
}

model SuspiciousActivity {
  id           String   @id @default(cuid())
  userId       String
  lessonId     String
  activityType String
  details      Json?
  timestamp    DateTime @default(now())
  resolved     Boolean  @default(false)
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([activityType])
  @@index([resolved])
}
```

## 1.8 Environment Variables

```bash
# .env additions for Video DRM

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=prepkit-videos-encrypted

# CloudFront Configuration
CLOUDFRONT_DOMAIN=d123456abc.cloudfront.net
CLOUDFRONT_KEY_PAIR_ID=APKAXXXXXXXXXX
CLOUDFRONT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIB..."

# Video Encryption
VIDEO_JWT_SECRET=your-super-secret-jwt-key-for-video-tokens
MASTER_ENCRYPTION_KEY=64-character-hex-string-for-encrypting-video-keys

# API URL
NEXT_PUBLIC_API_URL=https://yourapp.com
NEXT_PUBLIC_APP_URL=https://yourapp.com
```

## 1.9 Phase 1 Implementation Timeline

### Week 1: Infrastructure & Setup
**Tasks:**
- [ ] Set up AWS S3 bucket with encryption
- [ ] Configure CloudFront distribution
- [ ] Set up IAM roles and permissions
- [ ] Generate CloudFront key pair
- [ ] Install FFmpeg on server
- [ ] Create master encryption key
- [ ] Update database schema (migrations)

**Deliverables:**
- AWS infrastructure ready
- Database tables created
- Environment variables configured

### Week 2: Video Processing Pipeline
**Tasks:**
- [ ] Implement VideoEncryptionService
- [ ] Create admin video upload API
- [ ] Test video encryption with FFmpeg
- [ ] Implement S3 upload functionality
- [ ] Test HLS segment generation
- [ ] Implement encryption metadata storage

**Deliverables:**
- Working video processing pipeline
- Admin can upload videos
- Videos encrypted and stored in S3

### Week 3: Secure Playback System
**Tasks:**
- [ ] Implement playback token API
- [ ] Create video key decryption API
- [ ] Build SecureVideoPlayer component
- [ ] Implement device fingerprinting
- [ ] Test video playback with encryption
- [ ] Add CloudFront signed URLs

**Deliverables:**
- Users can play encrypted videos
- Device limits enforced
- Playback tokens working

### Week 4: Security & Monitoring
**Tasks:**
- [ ] Implement all browser security measures
- [ ] Add dynamic watermarking
- [ ] Create suspicious activity logging
- [ ] Build admin security dashboard
- [ ] Performance testing
- [ ] Security audit

**Deliverables:**
- Full DRM protection active
- Monitoring dashboard live
- Production-ready video system

---

# PHASE 2: MOCK INTERVIEW COMPLETION

**Duration:** 2 weeks  
**Priority:** 🔴 Critical  
**Goal:** Complete frontend and payment integration for mock interviews

## 2.1 Current State

✅ **Backend Complete:**
- Database schema (6 tables)
- API endpoints (setup, start, complete, report, history)
- Gemini integration (question generation, report generation)
- Vapi integration (voice calls)
- Pricing calculator

❌ **Frontend Missing:**
- Setup wizard page
- Interview session page with Vapi widget
- Report display page
- History page
- Payment flow integration

## 2.2 Interview Setup Page

```typescript
// app/(dashboard)/mock-interview/setup/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const interviewTypes = [
  { id: 'javascript', label: 'JavaScript/Frontend', price: 149, duration: 20, difficulty: 'Medium' },
  { id: 'machine-coding', label: 'Machine Coding', price: 199, duration: 25, difficulty: 'Hard' },
  { id: 'dsa', label: 'Data Structures & Algorithms', price: 149, duration: 20, difficulty: 'Medium' },
  { id: 'system-design', label: 'System Design', price: 299, duration: 30, difficulty: 'Expert' },
  { id: 'behavioral', label: 'Behavioral/HR', price: 99, duration: 15, difficulty: 'Easy' },
];

const difficulties = ['easy', 'medium', 'hard', 'expert'];

const focusAreasMap = {
  javascript: ['ES6+', 'Async/Promises', 'Closures', 'Prototype', 'DOM'],
  'machine-coding': ['React Components', 'State Management', 'API Integration', 'Performance'],
  dsa: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting'],
  'system-design': ['Scalability', 'Databases', 'Caching', 'Load Balancing', 'Microservices'],
  behavioral: ['Leadership', 'Conflict Resolution', 'Project Management', 'Communication'],
};

export default function InterviewSetupPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const selectedInterview = interviewTypes.find(t => t.id === selectedType);
  
  const handleFocusAreaToggle = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };
  
  const handleSetup = async () => {
    if (!selectedType) {
      alert('Please select an interview type');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/interviews/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          difficulty: selectedDifficulty,
          focusAreas,
          specificRequirements: requirements,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Setup failed');
      }
      
      // Redirect to payment page
      router.push(`/mock-interview/${data.data.sessionId}/payment`);
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Setup Mock Interview</h1>
        <p className="text-muted-foreground mt-2">
          Choose your interview type and customize your practice session
        </p>
      </div>
      
      {/* Interview Type Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Select Interview Type</CardTitle>
          <CardDescription>Choose the type of interview you want to practice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {interviewTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{type.label}</p>
                    <Badge variant="outline">{type.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {type.duration} minutes • ₹{type.price}
                  </p>
                </div>
                {selectedType === type.id && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Difficulty Level */}
      {selectedType && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Choose Difficulty Level</CardTitle>
            <CardDescription>Select the difficulty that matches your skill level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {difficulties.map((diff) => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? 'default' : 'outline'}
                  onClick={() => set

SelectedDifficulty(diff)}
                  className="capitalize"
                >
                  {diff}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Focus Areas */}
      {selectedType && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Focus Areas (Optional)</CardTitle>
            <CardDescription>Select specific topics you want to focus on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {focusAreasMap[selectedType as keyof typeof focusAreasMap]?.map((area) => (
                <Badge
                  key={area}
                  variant={focusAreas.includes(area) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleFocusAreaToggle(area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Special Requirements */}
      {selectedType && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Special Requirements (Optional)</CardTitle>
            <CardDescription>Any specific requirements or focus areas</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="E.g., Focus on distributed systems, include questions about React hooks, etc."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      )}
      
      {/* Pricing Summary & Start */}
      {selectedInterview && (
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Total Amount</p>
                <p className="text-3xl font-bold">₹{selectedInterview.price}</p>
                <p className="text-sm opacity-90 mt-1">
                  Approximately {selectedInterview.duration} minutes
                </p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleSetup}
                disabled={isLoading || !selectedType}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## 2.3 Payment Integration Page

```typescript
// app/(dashboard)/mock-interview/[sessionId]/payment/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@
