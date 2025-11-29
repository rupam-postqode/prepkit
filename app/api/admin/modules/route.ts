import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin();

    const { title, description, emoji, orderIndex } = await request.json();

    // Validate input
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingModule = await prisma.module.findUnique({
      where: { slug },
    });

    if (existingModule) {
      return NextResponse.json(
        { error: "Module with this title already exists" },
        { status: 400 }
      );
    }

    // Get the highest order index if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const lastModule = await prisma.module.findFirst({
        orderBy: { orderIndex: 'desc' },
      });
      finalOrderIndex = lastModule ? lastModule.orderIndex + 1 : 1;
    }

    // Create the module
    const moduleData = await prisma.module.create({
      data: {
        title,
        slug,
        description,
        emoji: emoji || "📚",
        orderIndex: finalOrderIndex,
      },
    });

    return NextResponse.json(moduleData, { status: 201 });
  } catch (error) {
    console.error("Create module error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin();

    const modules = await prisma.module.findMany({
      include: {
        _count: {
          select: {
            chapters: true,
          },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Get modules error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
