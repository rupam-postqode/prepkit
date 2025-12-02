import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PathType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const interviewDate = searchParams.get('interviewDate');
    const currentPathId = searchParams.get('currentPathId');

    // Get all learning paths with timeline info
    const paths = await prisma.learningPath.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            pathLessons: true,
            userProgress: true,
          },
        },
      },
      orderBy: {
        durationWeeks: "asc",
      },
    });

    // Get user's current progress if they have one
    let currentProgress = null;
    if (currentPathId) {
      currentProgress = await prisma.userPathProgress.findUnique({
        where: {
          userId_learningPathId: {
            userId: session.user.id,
            learningPathId: currentPathId,
          },
        },
        include: {
          learningPath: true,
        },
      });
    }

    // Generate recommendations based on interview date
    let recommendations: Array<{
      pathType: string;
      title: string;
      description: string;
      intensity: string;
      hoursPerDay: number;
      totalHours: number;
      topics: string[];
      pros: string[];
      cons: string[];
      recommendedFor: string;
    }> = [];
    let recommendedPath: string = 'STANDARD';
    
    if (interviewDate) {
      const interviewDateObj = new Date(interviewDate);
      const today = new Date();
      const daysUntilInterview = Math.ceil((interviewDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      recommendations = generateTimelineRecommendations(daysUntilInterview);
      recommendedPath = getRecommendedPath(daysUntilInterview);
    }

    // Add enrollment status
    const pathsWithEnrollment = await Promise.all(
      paths.map(async (path) => {
        const enrollment = await prisma.userPathProgress.findFirst({
          where: {
            userId: session.user.id,
            learningPathId: path.id,
            isActive: true,
          },
        });

        return {
          ...path,
          enrolled: !!enrollment,
          progressId: enrollment?.id,
          isCurrentPath: currentPathId === path.id,
        };
      })
    );

    return NextResponse.json({
      paths: pathsWithEnrollment,
      recommendations,
      recommendedPath,
      currentProgress,
    });
  } catch (error) {
    console.error("Error fetching timeline paths:", error);
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

    const { pathType, interviewDate } = await request.json();

    // Validate required fields
    if (!pathType) {
      return NextResponse.json(
        { error: "Path type is required" },
        { status: 400 }
      );
    }

    // Find the appropriate learning path
    const learningPath = await prisma.learningPath.findFirst({
      where: {
        pathType: pathType,
        isActive: true,
      },
    });

    if (!learningPath) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    // Check if user is already enrolled in a path
    const existingProgress = await prisma.userPathProgress.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    // If user has an active path, deactivate it first
    if (existingProgress) {
      await prisma.userPathProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          isActive: false,
        },
      });
    }

    // Create new progress entry
    const newProgress = await prisma.userPathProgress.create({
      data: {
        userId: session.user.id,
        learningPathId: learningPath.id,
        currentWeek: 1,
        currentDay: 1,
        completedLessons: 0,
        totalLessons: 0, // Will be updated later
        completedMilestones: '',
        isActive: true,
      },
      include: {
        learningPath: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled in timeline path",
      path: learningPath,
      progress: newProgress,
    });
  } catch (error) {
    console.error("Error enrolling in timeline path:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
function generateTimelineRecommendations(daysUntilInterview: number): Array<{
  pathType: string;
  title: string;
  description: string;
  intensity: string;
  hoursPerDay: number;
  totalHours: number;
  topics: string[];
  pros: string[];
  cons: string[];
  recommendedFor: string;
}> {
  const recommendations: Array<{
    pathType: string;
    title: string;
    description: string;
    intensity: string;
    hoursPerDay: number;
    totalHours: number;
    topics: string[];
    pros: string[];
    cons: string[];
    recommendedFor: string;
  }> = [];

  // 1 Month Path
  recommendations.push({
    pathType: 'TIMELINE_1_MONTH',
    title: "1 Month Intensive",
    description: "Crash course for urgent interview prep",
    intensity: "Very High",
    hoursPerDay: 6,
    totalHours: 180,
    topics: ["Core Concepts", "Essential Algorithms", "Key Data Structures", "Interview Patterns"],
    pros: ["Fastest completion", "Focused content", "High intensity"],
    cons: ["Limited depth", "High stress", "Minimal practice"],
    recommendedFor: daysUntilInterview <= 45 ? "Perfect fit" : "Too intensive",
  });

  // 3 Months Path
  recommendations.push({
    pathType: 'TIMELINE_3_MONTHS',
    title: "3 Months Balanced",
    description: "Comprehensive prep with good pacing",
    intensity: "Medium",
    hoursPerDay: 3,
    totalHours: 270,
    topics: ["All Core Concepts", "Problem Solving", "System Design", "Behavioral Questions"],
    pros: ["Balanced pace", "Comprehensive coverage", "Good retention"],
    cons: ["Longer commitment", "Moderate intensity"],
    recommendedFor: daysUntilInterview > 45 && daysUntilInterview <= 120 ? "Recommended" : "Consider alternatives",
  });

  // 6 Months Path
  recommendations.push({
    pathType: 'TIMELINE_6_MONTHS',
    title: "6 Months Comprehensive",
    description: "Deep mastery with extensive practice",
    intensity: "Relaxed",
    hoursPerDay: 2,
    totalHours: 360,
    topics: ["All Topics", "Advanced Concepts", "Extensive Practice", "Multiple Mock Interviews"],
    pros: ["Deep understanding", "Low stress", "Extensive practice"],
    cons: ["Longest duration", "Potential loss of momentum"],
    recommendedFor: daysUntilInterview > 120 ? "Best choice" : "May be too long",
  });

  return recommendations;
}

function getRecommendedPath(daysUntilInterview: number): string {
  if (daysUntilInterview <= 45) return 'TIMELINE_1_MONTH';
  if (daysUntilInterview <= 120) return 'TIMELINE_3_MONTHS';
  return 'TIMELINE_6_MONTHS';
}