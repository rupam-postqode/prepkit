import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
    const query = searchParams.get("q") || "";
    const moduleSlug = searchParams.get("module");
    const difficulty = searchParams.get("difficulty");
    const status = searchParams.get("status"); // "completed", "in-progress", "not-started"
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const userId = session.user?.id || "";

    // Build search conditions
    const whereConditions: Record<string, unknown> = {
      publishedAt: { not: null }, // Only published lessons
    };

    // Text search across title, description, and content
    if (query) {
      whereConditions.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { markdownContent: { contains: query, mode: "insensitive" } },
        { chapter: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { module: {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ]
            }}
          ]
        }}
      ];
    }

    // Module filter
    if (moduleSlug) {
      whereConditions.chapter = {
        ...(whereConditions.chapter as object || {}),
        module: { slug: moduleSlug }
      };
    }

    // Difficulty filter
    if (difficulty) {
      whereConditions.difficulty = difficulty;
    }

    // Status filter based on user's progress
    if (status) {
      const progressSubquery = {
        some: {
          userId: userId,
          ...(status === "completed" && { completedAt: { not: null } }),
          ...(status === "in-progress" && { completedAt: null, timeSpentSeconds: { gt: 0 } }),
          ...(status === "not-started" && { completedAt: null, timeSpentSeconds: 0 }),
        }
      };

      if (status === "not-started") {
        whereConditions.NOT = {
          progress: { some: { userId } }
        };
      } else {
        whereConditions.progress = progressSubquery;
      }
    }

    // Execute search
    const [lessons, totalCount] = await Promise.all([
      prisma.lesson.findMany({
        where: whereConditions,
        include: {
          chapter: {
            include: {
              module: true,
            },
          },
          progress: {
            where: { userId },
            select: {
              completedAt: true,
              timeSpentSeconds: true,
              videoWatchedPercent: true,
            },
          },
          _count: {
            select: {
              practiceLinks: true,
            },
          },
        },
        orderBy: [
          // Prioritize lessons with progress
          { progress: { _count: "desc" } },
          // Then by relevance (title matches first)
          { title: "asc" },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.lesson.count({ where: whereConditions }),
    ]);

    // Transform results for frontend
    const results = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      difficulty: lesson.difficulty,
      module: {
        title: lesson.chapter.module.title,
        slug: lesson.chapter.module.slug,
        emoji: lesson.chapter.module.emoji,
      },
      chapter: {
        title: lesson.chapter.title,
        slug: lesson.chapter.slug,
      },
      progress: lesson.progress[0] || null,
      practiceLinksCount: lesson._count.practiceLinks,
      publishedAt: lesson.publishedAt,
    }));

    return NextResponse.json({
      results,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      query: query || null,
      filters: {
        module: moduleSlug || null,
        difficulty: difficulty || null,
        status: status || null,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
