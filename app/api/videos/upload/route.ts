import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "prepkit-videos";
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/avi", "video/mov"];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("video") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only MP4, WebM, AVI, and MOV are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 500MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "mp4";
    const fileName = `videos/${randomUUID()}.${fileExtension}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        uploadedBy: session.user.id,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(uploadCommand);

    // Generate signed URL for temporary access
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 3600, // 1 hour
    });

    // Store video metadata in database
    const video = await prisma.video.create({
      data: {
        fileName,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        s3Key: fileName,
        s3Bucket: BUCKET_NAME,
        uploadedBy: session.user.id,
        status: "UPLOADED", // Will be updated to PROCESSED after transcoding
      },
    });

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        fileName: video.fileName,
        originalName: video.originalName,
        fileSize: video.fileSize,
        mimeType: video.mimeType,
        status: video.status,
        signedUrl, // Temporary access URL
      },
    });

  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve video information
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Check if user has access (admin or video owner)
    if (session.user?.role !== "ADMIN" && video.uploadedBy !== session.user?.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Generate fresh signed URL
    const getCommand = new GetObjectCommand({
      Bucket: video.s3Bucket,
      Key: video.s3Key,
    });

    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 3600, // 1 hour
    });

    return NextResponse.json({
      video: {
        id: video.id,
        fileName: video.fileName,
        originalName: video.originalName,
        fileSize: video.fileSize,
        mimeType: video.mimeType,
        status: video.status,
        duration: video.duration,
        signedUrl,
      },
    });

  } catch (error) {
    console.error("Video retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve video" },
      { status: 500 }
    );
  }
}
