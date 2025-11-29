import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";

interface ChapterReorderItem {
  id: string;
  newOrderIndex: number;
  moduleId: string;
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin access
    const adminUser = await requireAdmin();

    const { items }: { items: ChapterReorderItem[] } = await request.json();

    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      const errorResponse = handleApiError(
        new Error('Invalid reorder items'),
        { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/chapters/reorder' }
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate all items have required fields
    for (const item of items) {
      if (!item.id || typeof item.newOrderIndex !== 'number' || !item.moduleId) {
        const errorResponse = handleApiError(
          new Error('Invalid item format - missing id, newOrderIndex, or moduleId'),
          { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/chapters/reorder' }
        );
        return NextResponse.json(errorResponse, { status: 400 });
      }
    }

    // Verify all chapters belong to the same module
    const moduleIds = [...new Set(items.map(item => item.moduleId))];
    if (moduleIds.length > 1) {
      const errorResponse = handleApiError(
        new Error('All chapters must belong to the same module'),
        { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/chapters/reorder' }
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const targetModuleId = moduleIds[0];

    // Verify module exists
    const moduleData = await prisma.module.findUnique({
      where: { id: targetModuleId },
      select: { id: true, title: true }
    });

    if (!moduleData) {
      const errorResponse = handleApiError(
        new Error(`Module ${targetModuleId} not found`),
        { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/chapters/reorder' }
      );
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Execute reordering in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedChapters = [];

      for (const item of items) {
        // Verify chapter exists and belongs to the correct module
        const chapterData = await tx.chapter.findUnique({
          where: { id: item.id },
          select: { id: true, title: true, moduleId: true }
        });

        if (!chapterData) {
          throw new Error(`Chapter ${item.id} not found`);
        }

        if (chapterData.moduleId !== targetModuleId) {
          throw new Error(`Chapter ${item.id} does not belong to module ${targetModuleId}`);
        }

        // Update order index
        const updated = await tx.chapter.update({
          where: { id: item.id },
          data: { orderIndex: item.newOrderIndex },
          select: { id: true, title: true, orderIndex: true, moduleId: true }
        });

        updatedChapters.push(updated);
      }

      // Log the reordering operation
      console.log('Chapters reordered:', {
        reorderedBy: adminUser?.user?.id,
        moduleId: targetModuleId,
        items: items.map(item => ({
          chapterId: item.id,
          newOrderIndex: item.newOrderIndex
        }))
      });

      return updatedChapters;
    });

    return NextResponse.json({
      success: true,
      data: {
        reorderedCount: result.length,
        moduleId: targetModuleId,
        chapters: result
      }
    });

  } catch (error) {
    const errorResponse = handleApiError(
      error,
      { method: 'PATCH', url: '/api/admin/chapters/reorder' }
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
