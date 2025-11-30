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

    const { 
      name, 
      description, 
      emoji, 
      durationWeeks, 
      difficulty, 
      targetAudience,
      lessonsPerDay,
      daysPerWeek,
      estimatedHoursPerDay,
      includeModules,
      excludeModules,
      minDifficulty,
      maxDifficulty,
      companyFocus,
      balanceTheoryPractice,
      rules 
    } = await request.json();

    // Validate required fields
    if (!name || !description || !durationWeeks || !lessonsPerDay || !daysPerWeek || !estimatedHoursPerDay) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the template
    const template = await prisma.pathTemplate.create({
      data: {
        name,
        description,
        emoji: emoji || "🎯",
        durationWeeks: parseInt(durationWeeks),
        difficulty: difficulty || "MEDIUM",
        targetAudience,
        lessonsPerDay: parseInt(lessonsPerDay),
        daysPerWeek: parseInt(daysPerWeek),
        estimatedHoursPerDay: parseFloat(estimatedHoursPerDay),
        isActive: true,
        includeModules: includeModules || [],
        excludeModules: excludeModules || [],
        minDifficulty,
        maxDifficulty,
        companyFocus: companyFocus || [],
        balanceTheoryPractice: balanceTheoryPractice !== undefined ? balanceTheoryPractice : true,
        rules: rules || {},
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