import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";
import { handleApiError, ErrorCode } from "@/lib/error-handler";

interface ReorderItem {
  id: string;
  newOrderIndex: number;
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin access
    const adminUser = await requireAdmin();

    const { items }: { items: ReorderItem[] } = await request.json();

    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      const errorResponse = handleApiError(
        new Error('Invalid reorder items'),
        { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/modules/reorder' }
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate all items have required fields
    for (const item of items) {
      if (!item.id || typeof item.newOrderIndex !== 'number') {
        const errorResponse = handleApiError(
          new Error('Invalid item format'),
          { userId: adminUser?.user?.id, method: 'PATCH', url: '/api/admin/modules/reorder' }
        );
        return NextResponse.json(errorResponse, { status: 400 });
      }
    }

    // Execute reordering in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedModules = [];

      for (const item of items) {
        // Verify module exists
        const moduleData = await tx.module.findUnique({
          where: { id: item.id },
          select: { id: true, title: true }
        });

        if (!moduleData) {
          throw new Error(`Module ${item.id} not found`);
        }

        // Update order index
        const updated = await tx.module.update({
          where: { id: item.id },
          data: { orderIndex: item.newOrderIndex },
          select: { id: true, title: true, orderIndex: true }
        });

        updatedModules.push(updated);
      }

      // TODO: Add audit logging when audit log model is implemented
      // For now, we'll log to console
      console.log('Modules reordered:', {
        reorderedBy: adminUser?.user?.id,
        items: items.map(item => ({
          moduleId: item.id,
          newOrderIndex: item.newOrderIndex
        }))
      });

      return updatedModules;
    });

    return NextResponse.json({
      success: true,
      data: {
        reorderedCount: result.length,
        modules: result
      }
    });

  } catch (error) {
    const errorResponse = handleApiError(
      error,
      { method: 'PATCH', url: '/api/admin/modules/reorder' }
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
