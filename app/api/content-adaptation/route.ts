import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PathType, MasteryLevel } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const pathType = searchParams.get('pathType') as PathType;
    const masteryLevel = searchParams.get('masteryLevel') as MasteryLevel;

    if (!lessonId || !pathType || !masteryLevel) {
      return NextResponse.json(
        { error: "Missing required parameters: lessonId, pathType, masteryLevel" },
        { status: 400 }
      );
    }

    // Check if content adaptation already exists
    let adaptation = await prisma.contentAdaptation.findFirst({
      where: {
        lessonId,
        pathType,
        masteryLevel,
      },
    });

    // If no adaptation exists, create one
    if (!adaptation) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          chapter: {
            include: {
              module: true,
            },
          },
        },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 }
        );
      }

      adaptation = await generateContentAdaptation(lesson, pathType, masteryLevel);
    }

    return NextResponse.json({
      adaptation,
      lessonId,
      pathType,
      masteryLevel,
    });
  } catch (error) {
    console.error("Error fetching content adaptation:", error);
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

    const { lessonId, pathType, masteryLevel, customizations } = await request.json();

    if (!lessonId || !pathType || !masteryLevel) {
      return NextResponse.json(
        { error: "Missing required parameters: lessonId, pathType, masteryLevel" },
        { status: 400 }
      );
    }

    // Get the lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: {
          include: {
            module: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Generate or update content adaptation
    const adaptation = await generateContentAdaptation(
      lesson,
      pathType,
      masteryLevel,
      customizations
    );

    return NextResponse.json({
      success: true,
      adaptation,
    });
  } catch (error) {
    console.error("Error creating content adaptation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateContentAdaptation(
  lesson: {
    id: string;
    title: string;
    markdownContent: string;
    videoUrl: string | null;
    videoDurationSec: number | null;
    difficulty: string;
    commonMistakes: string | null;
    importantPoints: string | null;
    quickReference: string | null;
    chapter: {
      title: string;
      module: {
        title: string;
      };
    };
  },
  pathType: PathType,
  masteryLevel: MasteryLevel,
  customizations?: Record<string, unknown>
) {
  // Base adaptation settings based on path type and mastery level
  const adaptationSettings = getAdaptationSettings(pathType, masteryLevel);
  
  // Generate adapted content
  const adaptedContent = {
    ...adaptationSettings,
    ...customizations,
    originalContent: lesson.markdownContent,
    videoUrl: lesson.videoUrl,
    videoDurationSec: lesson.videoDurationSec,
    commonMistakes: lesson.commonMistakes,
    importantPoints: lesson.importantPoints,
    quickReference: lesson.quickReference,
  };

  // Calculate estimated time based on adaptation
  const estimatedTime = calculateEstimatedTime(lesson, pathType, masteryLevel);

  // Determine priority based on path type and content importance
  const priority = calculatePriority(lesson, pathType, masteryLevel);

  // Determine if content is skippable
  const isSkippable = determineSkippability(lesson, pathType, masteryLevel);

  // Generate learning objectives based on mastery level
  const learningObjectives = generateLearningObjectives(lesson, masteryLevel);

  // Check if adaptation already exists
  const existingAdaptation = await prisma.contentAdaptation.findFirst({
    where: {
      lessonId: lesson.id,
      pathType,
      masteryLevel,
    },
  });

  let adaptation;
  if (existingAdaptation) {
    // Update existing adaptation
    adaptation = await prisma.contentAdaptation.update({
      where: {
        id: existingAdaptation.id,
      },
      data: {
        adaptedContent,
        estimatedTime,
        priority,
        isSkippable,
        learningObjectives: learningObjectives.join(','),
      },
    });
  } else {
    // Create new adaptation
    adaptation = await prisma.contentAdaptation.create({
      data: {
        lessonId: lesson.id,
        pathType,
        masteryLevel,
        adaptedContent,
        estimatedTime,
        priority,
        isSkippable,
        learningObjectives: learningObjectives.join(','),
      },
    });
  }

  return adaptation;
}

function getAdaptationSettings(pathType: PathType, masteryLevel: MasteryLevel) {
  const settings = {
    contentFocus: "",
    depthLevel: "",
    practiceRequired: false,
    additionalResources: [] as string[],
    timeMultiplier: 1,
  };

  // Settings based on path type
  switch (pathType) {
    case "TIMELINE_1_MONTH":
      settings.contentFocus = "essential";
      settings.depthLevel = "basic";
      settings.practiceRequired = masteryLevel === "BASIC" ? false : true;
      settings.timeMultiplier = 0.6;
      settings.additionalResources = ["cheat-sheet", "quick-reference"];
      break;
    case "TIMELINE_3_MONTHS":
      settings.contentFocus = "comprehensive";
      settings.depthLevel = "standard";
      settings.practiceRequired = true;
      settings.timeMultiplier = 1.0;
      settings.additionalResources = ["examples", "practice-problems"];
      break;
    case "TIMELINE_6_MONTHS":
      settings.contentFocus = "mastery";
      settings.depthLevel = "advanced";
      settings.practiceRequired = true;
      settings.timeMultiplier = 1.5;
      settings.additionalResources = ["deep-dive", "advanced-topics", "case-studies"];
      break;
    default:
      settings.contentFocus = "standard";
      settings.depthLevel = "standard";
      settings.practiceRequired = true;
      settings.timeMultiplier = 1.0;
  }

  // Adjust based on mastery level
  switch (masteryLevel) {
    case "BASIC":
      settings.depthLevel = "basic";
      settings.timeMultiplier *= 0.7;
      break;
    case "STANDARD":
      settings.depthLevel = "standard";
      settings.timeMultiplier *= 1.0;
      break;
    case "ADVANCED":
      settings.depthLevel = "advanced";
      settings.timeMultiplier *= 1.3;
      break;
  }

  return settings;
}

function calculateEstimatedTime(
  lesson: {
    videoDurationSec: number | null;
  },
  pathType: PathType,
  masteryLevel: MasteryLevel
): number {
  // Base time from lesson metadata or default
  const baseTime = 60; // 60 minutes default
  
  // Get adaptation settings
  const settings = getAdaptationSettings(pathType, masteryLevel);
  
  // Calculate estimated time
  let estimatedTime = baseTime * settings.timeMultiplier;
  
  // Adjust for video content
  if (lesson.videoDurationSec) {
    estimatedTime += lesson.videoDurationSec / 60; // Convert seconds to minutes
  }
  
  // Add practice time if required
  if (settings.practiceRequired) {
    estimatedTime += 30; // 30 minutes for practice
  }
  
  return Math.round(estimatedTime);
}

function calculatePriority(
  lesson: {
    difficulty: string;
    chapter: {
      title: string;
      module: {
        title: string;
      };
    };
  },
  pathType: PathType,
  masteryLevel: MasteryLevel
): number {
  let priority = 2; // Default priority
  
  // Higher priority for essential content in 1-month timeline
  if (pathType === "TIMELINE_1_MONTH") {
    if (lesson.difficulty === "BEGINNER" || lesson.difficulty === "EASY") {
      priority = 1; // High priority
    }
  }
  
  // Lower priority for advanced content in basic mastery
  if (masteryLevel === "BASIC" && lesson.difficulty === "HARD") {
    priority = 3; // Low priority
  }
  
  // Higher priority for core concepts
  if (lesson.chapter.module.title.includes("Core") || 
      lesson.chapter.title.includes("Fundamentals")) {
    priority = 1;
  }
  
  return priority;
}

function determineSkippability(
  lesson: {
    difficulty: string;
  },
  pathType: PathType,
  masteryLevel: MasteryLevel
): boolean {
  // In 1-month timeline, only non-essential content is skippable
  if (pathType === "TIMELINE_1_MONTH") {
    return lesson.difficulty === "HARD" && masteryLevel === "BASIC";
  }
  
  // In 6-month timeline, most content is essential for mastery
  if (pathType === "TIMELINE_6_MONTHS" && masteryLevel === "ADVANCED") {
    return false;
  }
  
  // Basic mastery can skip advanced content
  if (masteryLevel === "BASIC" && lesson.difficulty === "HARD") {
    return true;
  }
  
  return false;
}

function generateLearningObjectives(
  lesson: {
    title: string;
  },
  masteryLevel: MasteryLevel
): string[] {
  const baseObjectives = [
    `Understand the core concepts of ${lesson.title}`,
    `Apply the concepts learned in practical scenarios`,
  ];
  
  switch (masteryLevel) {
    case "BASIC":
      return [
        ...baseObjectives,
        `Recognize when to use these concepts`,
        `Complete basic exercises related to ${lesson.title}`,
      ];
    case "STANDARD":
      return [
        ...baseObjectives,
        `Analyze problems and apply appropriate concepts`,
        `Implement solutions independently`,
        `Debug common issues related to ${lesson.title}`,
      ];
    case "ADVANCED":
      return [
        ...baseObjectives,
        `Evaluate different approaches and choose optimal solutions`,
        `Design complex systems using these concepts`,
        `Optimize performance and handle edge cases`,
        `Teach or explain these concepts to others`,
      ];
    default:
      return baseObjectives;
  }
}