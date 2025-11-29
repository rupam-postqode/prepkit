import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/db";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Convert file to base64 for Cloudinary upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const base64String = `data:${file.type};base64,${fileBuffer.toString('base64')}`;

    // Generate unique video ID
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Upload to Cloudinary with HLS streaming support
    const uploadResult = await new Promise<{
      public_id: string;
      secure_url: string;
      duration?: number;
      format: string;
      bytes: number;
    }>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64String,
        {
          resource_type: "video",
          folder: "prepkit/videos",
          public_id: videoId,
          quality: "auto",
          format: "mp4",
          // Enable HLS streaming
          eager: [
            {
              streaming_profile: "hd",
              format: "m3u8",
              quality: "auto",
            }
          ],
          // Add basic watermark overlay
          overlay: {
            font_family: "Arial",
            font_size: 30,
            font_weight: "bold",
            text: "PrepKit",
            gravity: "south_east",
            opacity: 30,
            color: "#ffffff"
          },
          // Prevent downloads
          access_mode: "authenticated",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed - no result returned"));
        }
      );
    });

    // Store video metadata in database
    const video = await prisma.video.create({
      data: {
        fileName: uploadResult.public_id,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        duration: uploadResult.duration || 0,
        s3Key: uploadResult.public_id, // Using s3Key field for Cloudinary public_id
        s3Bucket: "cloudinary", // Using s3Bucket field to indicate Cloudinary
        uploadedBy: session.user.id,
        status: "PROCESSED", // Cloudinary processes videos automatically
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
        duration: video.duration,
        url: uploadResult.secure_url, // Direct Cloudinary URL
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

    // Generate Cloudinary video URL
    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/${video.s3Key}.mp4`;

    return NextResponse.json({
      video: {
        id: video.id,
        fileName: video.fileName,
        originalName: video.originalName,
        fileSize: video.fileSize,
        mimeType: video.mimeType,
        status: video.status,
        duration: video.duration,
        url: cloudinaryUrl, // Direct Cloudinary URL
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
