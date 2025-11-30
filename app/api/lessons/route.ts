import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Difficulty } from "@prisma/client";

// GET /api/lessons - Fetch all lessons with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const moduleId = searchParams.get("moduleId");
    const chapterId = searchParams.get("chapterId");
    const difficulty = searchParams.get("difficulty");
    const premium = searchParams.get("premium");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Build where clause
    const where: {
      chapter?: {
        module?: {
          id?: string;
        };
      };
      chapterId?: string;
      difficulty?: Difficulty;
      premium?: boolean;
    } = {};
    
    if (moduleId) {
      where.chapter = {
        module: {
          id: moduleId
        }
      };
    }
    
    if (chapterId) {
      where.chapterId = chapterId;
    }
    
    if (difficulty) {
      where.difficulty = difficulty.toUpperCase() as Difficulty;
    }
    
    if (premium !== null) {
      where.premium = premium === "true";
    }

    // Get total count for pagination
    const total = await prisma.lesson.count({ where });

    // Fetch lessons with pagination
    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        chapter: {
          include: {
            module: true
          }
        },
        practiceLinks: {
          orderBy: {
            orderIndex: "asc"
          }
        }
      },
      orderBy: {
        orderIndex: "asc"
      },
      skip: offset,
      take: limit
    });

    // Get user session for premium check
    const session = await getServerSession(authOptions);
    
    let dbUser = null;
    if (session?.user?.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { subscriptionStatus: true }
      });
    }

    // Filter premium content for non-premium users
    const filteredLessons = lessons.map(lesson => {
      if (!dbUser || dbUser.subscriptionStatus !== "ACTIVE") {
        // Hide premium content details for non-premium users
        return {
          ...lesson,
          markdownContent: lesson.premium ? null : lesson.markdownContent,
          videoUrl: lesson.premium ? null : lesson.videoUrl,
          practiceLinks: lesson.premium ? [] : lesson.practiceLinks
        };
      }
      return lesson;
    });

    return NextResponse.json({
      lessons: filteredLessons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
