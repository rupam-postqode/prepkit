import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
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

    const templates = await prisma.pathTemplate.findMany({
      include: {
        _count: {
          select: {
            generatedPaths: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching path templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const {
      name,
      description,
      emoji,
      durationWeeks,
      difficulty,
      targetAudience,
      includeModules,
      excludeModules,
      minDifficulty,
      maxDifficulty,
      lessonsPerDay,
      daysPerWeek,
      estimatedHoursPerDay,
      balanceTheoryPractice,
      companyFocus,
    } = body;

    // Validate required fields
    if (!name || !description || !durationWeeks || !targetAudience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build rules object
    const rules = {
      includeModules: includeModules || [],
      excludeModules: excludeModules || [],
      minDifficulty: minDifficulty || null,
      maxDifficulty: maxDifficulty || null,
      lessonsPerDay: lessonsPerDay || 2,
      daysPerWeek: daysPerWeek || 5,
      estimatedHoursPerDay: estimatedHoursPerDay || 2.0,
      targetDurationWeeks: durationWeeks,
      balanceTheoryPractice: balanceTheoryPractice || false,
      companyFocus: companyFocus || [],
    };

    const template = await prisma.pathTemplate.create({
      data: {
        name,
        description,
        emoji: emoji || "🎯",
        durationWeeks: parseInt(durationWeeks),
        difficulty: difficulty || "MEDIUM",
        targetAudience,
        rules,
        includeModules: (includeModules || []).join(","),
        excludeModules: (excludeModules || []).join(","),
        minDifficulty: minDifficulty || null,
        maxDifficulty: maxDifficulty || null,
        lessonsPerDay: lessonsPerDay || 2,
        daysPerWeek: daysPerWeek || 5,
        estimatedHoursPerDay: estimatedHoursPerDay || 2.0,
        isActive: true,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating path template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
