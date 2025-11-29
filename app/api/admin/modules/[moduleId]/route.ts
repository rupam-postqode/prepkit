import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    // Check admin access
    await requireAdmin();

    const { moduleId } = await params;

    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    });

    if (!moduleData) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(moduleData);
  } catch (error) {
    console.error("Get module error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    // Check admin access
    await requireAdmin();

    const { moduleId } = await params;
    const { title, description, emoji, orderIndex } = await request.json();

    // Validate input
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Generate new slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists (excluding current module)
    const existingModule = await prisma.module.findFirst({
      where: {
        slug,
        id: { not: moduleId },
      },
    });

    if (existingModule) {
      return NextResponse.json(
        { error: "Module with this title already exists" },
        { status: 400 }
      );
    }

    // Update the module
    const moduleData = await prisma.module.update({
      where: { id: moduleId },
      data: {
        title,
        slug,
        description,
        emoji: emoji || "📚",
        orderIndex: orderIndex || undefined,
      },
    });

    return NextResponse.json(moduleData);
  } catch (error) {
    console.error("Update module error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    // Check admin access
    await requireAdmin();

    const { moduleId } = await params;

    // Check if module has chapters
    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    });

    if (!moduleData) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    if (moduleData._count.chapters > 0) {
      return NextResponse.json(
        { error: "Cannot delete module with existing chapters. Delete chapters first." },
        { status: 400 }
      );
    }

    // Delete the module
    await prisma.module.delete({
      where: { id: moduleId },
    });

    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Delete module error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
