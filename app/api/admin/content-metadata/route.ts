import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get query params for filtering
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get("moduleId");
    const contentType = searchParams.get("contentType");

    // Fetch lessons with their metadata
    const lessons = await prisma.lesson.findMany({
      where: {
        publishedAt: { not: null },
        ...(moduleId && {
          chapter: {
            moduleId,
          },
        }),
      },
      include: {
        chapter: {
          include: {
            module: {
              select: {
                id: true,
                title: true,
                slug: true,
                emoji: true,
              },
            },
          },
        },
      },
      orderBy: [
        { chapter: { module: { orderIndex: 'asc' } } },
        { chapter: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    // Fetch all content metadata
    const metadataRecords = await prisma.contentMetadata.findMany({
      where: {
        lessonId: { in: lessons.map((l: { id: string }) => l.id) },
        ...(contentType && { contentType }),
      },
    });

    const metadataMap = new Map(
      metadataRecords.map((m: { lessonId: string }) => [m.lessonId, m])
    );

    // Combine lessons with metadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lessonsWithMetadata = lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      difficulty: lesson.difficulty,
      module: lesson.chapter.module,
      chapterId: lesson.chapter.id,
      chapterTitle: lesson.chapter.title,
      metadata: metadataMap.get(lesson.id) || null,
    }));

    return NextResponse.json(lessonsWithMetadata);
  } catch (error) {
    console.error("Error fetching content metadata:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { lessonId, metadata } = body;

    if (!lessonId || !metadata) {
      return NextResponse.json(
        { error: "lessonId and metadata are required" },
        { status: 400 }
      );
    }

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Upsert metadata
    const contentMetadata = await prisma.contentMetadata.upsert({
      where: { lessonId },
      create: {
        lessonId,
        difficultyScore: metadata.difficultyScore || 1.0,
        complexityScore: metadata.complexityScore || 1.0,
        estimatedMinutes: metadata.estimatedMinutes || 60,
        readingMinutes: metadata.readingMinutes || 30,
        practiceMinutes: metadata.practiceMinutes || 30,
        topics: metadata.topics || [],
        skills: metadata.skills || [],
        prerequisites: metadata.prerequisites || [],
        companyRelevance: metadata.companyRelevance || {},
        objectives: metadata.objectives || [],
        contentType: metadata.contentType || "mixed",
        interactiveLevel: metadata.interactiveLevel || "medium",
        lastAnalyzedAt: new Date(),
        analysisVersion: "1.0",
      },
      update: {
        difficultyScore: metadata.difficultyScore,
        complexityScore: metadata.complexityScore,
        estimatedMinutes: metadata.estimatedMinutes,
        readingMinutes: metadata.readingMinutes,
        practiceMinutes: metadata.practiceMinutes,
        topics: metadata.topics,
        skills: metadata.skills,
        prerequisites: metadata.prerequisites,
        companyRelevance: metadata.companyRelevance,
        objectives: metadata.objectives,
        contentType: metadata.contentType,
        interactiveLevel: metadata.interactiveLevel,
        lastAnalyzedAt: new Date(),
      },
    });

    return NextResponse.json(contentMetadata);
  } catch (error) {
    console.error("Error updating content metadata:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bulkUpdates } = body;

    if (!Array.isArray(bulkUpdates) || bulkUpdates.length === 0) {
      return NextResponse.json(
        { error: "bulkUpdates array is required" },
        { status: 400 }
      );
    }

    // Process bulk updates
    const results = [];
    for (const update of bulkUpdates) {
      try {
        const metadata = await prisma.contentMetadata.upsert({
          where: { lessonId: update.lessonId },
          create: {
            lessonId: update.lessonId,
            ...update.metadata,
            lastAnalyzedAt: new Date(),
            analysisVersion: "1.0",
          },
          update: {
            ...update.metadata,
            lastAnalyzedAt: new Date(),
          },
        });
        results.push({ success: true, lessonId: update.lessonId, metadata });
      } catch (error) {
        results.push({ 
          success: false, 
          lessonId: update.lessonId, 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    }

    return NextResponse.json({
      processed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    });
  } catch (error) {
    console.error("Error bulk updating content metadata:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
