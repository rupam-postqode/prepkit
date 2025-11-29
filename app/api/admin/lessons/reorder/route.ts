import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";

interface LessonReorderItem {
  id: string;
  newOrderIndex: number;
  chapterId: string;
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin access
    const adminUser = await requireAdmin();

    const { items }: { items: LessonReorderItem[] } = await request.json();

    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      const errorResponse = handleApiError(
        new Error('Invalid reorder items'),
        { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/lessons/reorder' }
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate all items have required fields
    for (const item of items) {
      if (!item.id || typeof item.newOrderIndex !== 'number' || !item.chapterId) {
        const errorResponse = handleApiError(
          new Error('Invalid item format - missing id, newOrderIndex, or chapterId'),
          { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/lessons/reorder' }
        );
        return NextResponse.json(errorResponse, { status: 400 });
      }
    }

    // Verify all lessons belong to the same chapter
    const chapterIds = [...new Set(items.map(item => item.chapterId))];
    if (chapterIds.length > 1) {
      const errorResponse = handleApiError(
        new Error('All lessons must belong to the same chapter'),
        { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/lessons/reorder' }
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const targetChapterId = chapterIds[0];

    // Verify chapter exists
    const chapterData = await prisma.chapter.findUnique({
      where: { id: targetChapterId },
      select: { id: true, title: true, moduleId: true }
    });

    if (!chapterData) {
      const errorResponse = handleApiError(
        new Error(`Chapter ${targetChapterId} not found`),
        { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/lessons/reorder' }
      );
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Execute reordering in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedLessons = [];

      for (const item of items) {
        // Verify lesson exists and belongs to the correct chapter
        const lessonData = await tx.lesson.findUnique({
          where: { id: item.id },
          select: { id: true, title: true, chapterId: true }
        });

        if (!lessonData) {
          throw new Error(`Lesson ${item.id} not found`);
        }

        if (lessonData.chapterId !== targetChapterId) {
          throw new Error(`Lesson ${item.id} does not belong to chapter ${targetChapterId}`);
        }

        // Update order index
        const updated = await tx.lesson.update({
          where: { id: item.id },
          data: { orderIndex: item.newOrderIndex },
          select: { id: true, title: true, orderIndex: true, chapterId: true }
        });

        updatedLessons.push(updated);
      }

      // Log the reordering operation
      console.log('Lessons reordered:', {
        reorderedBy: adminUser?.user?.id,
        chapterId: targetChapterId,
        moduleId: chapterData.moduleId,
        items: items.map(item => ({
          lessonId: item.id,
          newOrderIndex: item.newOrderIndex
        }))
      });

      return updatedLessons;
    });

    return NextResponse.json({
      success: true,
      data: {
        reorderedCount: result.length,
        chapterId: targetChapterId,
        moduleId: chapterData.moduleId,
        lessons: result
      }
    });

  } catch (error) {
    const errorResponse = handleApiError(
      error,
      { method: 'PATCH', url: '/api/admin/lessons/reorder' }
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
