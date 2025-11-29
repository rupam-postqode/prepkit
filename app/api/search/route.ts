import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: query || '',
      });
    }

    // Search across lessons using PostgreSQL full-text search
    // We'll search in title, description, and markdown content
    const lessons = await prisma.lesson.findMany({
      where: {
        AND: [
          { publishedAt: { not: null } }, // Only published lessons
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { markdownContent: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: {
        chapter: {
          include: {
            module: true,
          },
        },
        _count: {
          select: {
            practiceLinks: true,
          },
        },
      },
      orderBy: [
        // Prioritize exact title matches, then description, then content
        {
          title: query.length > 3 ? 'asc' : undefined,
        },
        { updatedAt: 'desc' },
      ],
      take: Math.min(limit, 50), // Max 50 results
      skip: offset,
    });

    // Get total count for pagination
    const total = await prisma.lesson.count({
      where: {
        AND: [
          { publishedAt: { not: null } },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { markdownContent: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });

    // Format results with highlights
    const results = lessons.map((lesson) => {
      // Create a snippet from the content if the query matches
      let snippet = lesson.description;
      if (lesson.markdownContent && lesson.markdownContent.toLowerCase().includes(query.toLowerCase())) {
        // Find the query in the content and create a snippet around it
        const content = lesson.markdownContent;
        const queryIndex = content.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, queryIndex - 100);
        const end = Math.min(content.length, queryIndex + 200);
        snippet = (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '');
      }

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        snippet,
        difficulty: lesson.difficulty,
        module: {
          id: lesson.chapter.module.id,
          title: lesson.chapter.module.title,
          emoji: lesson.chapter.module.emoji,
        },
        chapter: {
          id: lesson.chapter.id,
          title: lesson.chapter.title,
        },
        hasVideo: !!lesson.videoUrl,
        practiceCount: lesson._count.practiceLinks,
        updatedAt: lesson.updatedAt,
      };
    });

    return NextResponse.json({
      results,
      total,
      query,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
