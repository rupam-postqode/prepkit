import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";
import { ContentProtectionService } from "@/lib/content-protection";
import { handleApiError, ErrorCode } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const adminUser = await requireAdmin();

    const { title, description, markdownContent, difficulty, chapterId, importantPoints, commonMistakes, quickReference, premium } = await request.json();

    // Validate input
    if (!title || !description || !markdownContent || !difficulty || !chapterId) {
      const errorResponse = handleApiError(
        new Error('Missing required fields'),
        { userId: adminUser?.user?.id, method: 'POST', url: '/api/admin/lessons' }
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      const errorResponse = handleApiError(
        new Error('Chapter not found'),
        { userId: adminUser?.user?.id, method: 'POST', url: '/api/admin/lessons' }
      );
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Get the highest order index for this chapter
    const lastLesson = await prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { orderIndex: 'desc' },
    });

    const orderIndex = lastLesson ? lastLesson.orderIndex + 1 : 1;

    // Create the lesson first (without content)
    const lesson = await prisma.lesson.create({
      data: {
        title,
        slug,
        description,
        markdownContent: '', // Will be encrypted and stored separately
        difficulty,
        chapterId,
        orderIndex,
        premium: premium || false,
        publishedAt: new Date(), // Auto-publish for now
        importantPoints,
        commonMistakes,
        quickReference,
      },
    });

    // Encrypt and store content using content protection service
    try {
      await ContentProtectionService.encryptLessonContent(
        lesson.id,
        markdownContent,
        lesson.premium
      );
    } catch (encryptionError) {
      console.error('Content encryption failed:', encryptionError);
      // If encryption fails, delete the lesson and return error
      await prisma.lesson.delete({ where: { id: lesson.id } });

      const errorResponse = handleApiError(
        encryptionError,
        { userId: adminUser?.user?.id, method: 'POST', url: '/api/admin/lessons' }
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Return the created lesson
    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(
      error,
      { method: 'POST', url: '/api/admin/lessons' }
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const adminUser = await requireAdmin();

    const lessons = await prisma.lesson.findMany({
      include: {
        chapter: {
          include: {
            module: true,
          },
        },
        _count: {
          select: {
            progress: true,
            practiceLinks: true,
          },
        },
      },
      orderBy: [
        { chapter: { module: { orderIndex: 'asc' } } },
        { chapter: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    return NextResponse.json({ success: true, data: lessons });
  } catch (error) {
    const errorResponse = handleApiError(
      error,
      { method: 'GET', url: '/api/admin/lessons' }
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
