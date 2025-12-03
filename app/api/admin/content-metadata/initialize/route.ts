import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Initialize content metadata with default values for all published lessons
 * This is a one-time operation to populate the ContentMetadata table
 */
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

    // Fetch all published lessons without metadata
    const lessons = await prisma.lesson.findMany({
      where: {
        publishedAt: { not: null },
      },
      include: {
        chapter: {
          include: {
            module: true,
          },
        },
      },
    });

    // Check which lessons already have metadata
    const existingMetadata = await prisma.contentMetadata.findMany({
      select: {
        lessonId: true,
      },
    });

    const existingLessonIds = new Set(existingMetadata.map((m: { lessonId: string }) => m.lessonId));
    const lessonsNeedingMetadata = lessons.filter((l: { id: string }) => !existingLessonIds.has(l.id));

    if (lessonsNeedingMetadata.length === 0) {
      return NextResponse.json({
        message: "All lessons already have metadata",
        total: lessons.length,
        initialized: 0,
      });
    }

    // Create default metadata for lessons that don't have it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadataToCreate = lessonsNeedingMetadata.map((lesson: any) => {
      // Estimate difficulty score based on lesson difficulty
      const difficultyScores = {
        BEGINNER: 1.0,
        EASY: 1.5,
        MEDIUM: 2.0,
        HARD: 2.5,
      };

      const difficultyScore = difficultyScores[lesson.difficulty as keyof typeof difficultyScores] || 2.0;

      // Default topics based on module
      const moduleName = lesson.chapter.module.title.toLowerCase();
      const defaultTopics = [lesson.chapter.module.title, lesson.chapter.title];

      // Estimate time based on difficulty
      const estimatedMinutes = lesson.difficulty === "BEGINNER" ? 45 : 
                              lesson.difficulty === "EASY" ? 60 : 
                              lesson.difficulty === "MEDIUM" ? 75 : 90;

      return {
        lessonId: lesson.id,
        difficultyScore,
        complexityScore: difficultyScore,
        estimatedMinutes,
        readingMinutes: Math.floor(estimatedMinutes * 0.4),
        practiceMinutes: Math.floor(estimatedMinutes * 0.6),
        topics: defaultTopics,
        skills: [moduleName],
        prerequisites: [],
        companyRelevance: {},
        objectives: [`Understand ${lesson.title}`],
        contentType: moduleName.includes("practice") || moduleName.includes("coding") ? "practice" : 
                     moduleName.includes("theory") || moduleName.includes("concept") ? "theory" : "mixed",
        interactiveLevel: "medium",
        lastAnalyzedAt: new Date(),
        analysisVersion: "1.0",
      };
    });

    // Bulk create metadata
    const result = await prisma.contentMetadata.createMany({
      data: metadataToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "Content metadata initialized successfully",
      total: lessons.length,
      initialized: result.count,
      alreadyExisting: existingLessonIds.size,
    });
  } catch (error) {
    console.error("Error initializing content metadata:", error);
    return NextResponse.json(
      { 
        error: "Failed to initialize content metadata",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
