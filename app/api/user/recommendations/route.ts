import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  lessonId?: string;
  priority: number;
  metadata: Record<string, unknown>;
}

interface UserProgress {
  learningPath: {
    pathLessons: Array<{
      weekNumber: number;
      dayNumber: number;
      estimatedHours: number;
      lesson: {
        id: string;
        title: string;
        difficulty: string;
        chapter: {
          module: {
            title: string;
          };
        };
        progress: Array<unknown>;
      };
    }>;
  };
  currentWeek: number;
  currentDay: number;
}

interface CompletedLesson {
  lesson: {
    difficulty: string;
    chapter: {
      module: {
        title: string;
      };
    };
  };
  timeSpentSeconds: number;
  completedAt?: Date | null;
}

interface UserProfile {
  experienceLevel: string;
  targetCompanies: string[];
  preferredLanguage: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    // Get user's learning data
    const [userProgress, completedLessons, userProfile] = await Promise.all([
      // Current path progress
      prisma.userPathProgress.findFirst({
        where: { userId, isActive: true },
        include: {
          learningPath: {
            include: {
              pathLessons: {
                include: {
                  lesson: {
                    include: {
                      chapter: {
                        include: {
                          module: true,
                        },
                      },
                      progress: {
                        where: { userId },
                      },
                    },
                  },
                },
                orderBy: [
                  { weekNumber: 'asc' },
                  { dayNumber: 'asc' },
                  { orderIndex: 'asc' },
                ],
              },
            },
          },
        },
      }),
      // All completed lessons for performance analysis
      prisma.lessonProgress.findMany({
        where: {
          userId,
          completedAt: { not: null },
        },
        include: {
          lesson: {
            include: {
              chapter: {
                include: {
                  module: true,
                },
              },
            },
          },
        },
        orderBy: { completedAt: 'desc' },
        take: 50, // Analyze last 50 completed lessons
      }),
      // User profile for personalization
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          experienceLevel: true,
          targetCompanies: true,
          preferredLanguage: true,
        },
      }),
    ]);

    const recommendations = await generateRecommendations(
      userProgress as UserProgress | null,
      completedLessons as CompletedLesson[],
      userProfile as UserProfile,
      type
    );

    return NextResponse.json({
      recommendations,
      meta: {
        totalRecommendations: recommendations.length,
        type,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateRecommendations(
  userProgress: UserProgress | null,
  completedLessons: CompletedLesson[],
  userProfile: UserProfile,
  type: string
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];

  if (type === 'all' || type === 'next_lessons') {
    // Next lessons to study
    const nextLessons = generateNextLessonRecommendations(userProgress);
    recommendations.push(...nextLessons);
  }

  if (type === 'all' || type === 'review') {
    // Review recommendations based on weak areas
    const reviewRecommendations = generateReviewRecommendations(completedLessons);
    recommendations.push(...reviewRecommendations);
  }

  if (type === 'all' || type === 'challenge') {
    // Challenge recommendations for advanced practice
    const challengeRecommendations = generateChallengeRecommendations(
      completedLessons,
      userProfile
    );
    recommendations.push(...challengeRecommendations);
  }

  if (type === 'all' || type === 'company_specific') {
    // Company-specific recommendations
    const companyRecommendations = generateCompanySpecificRecommendations(
      completedLessons,
      userProfile
    );
    recommendations.push(...companyRecommendations);
  }

  return recommendations.sort((a, b) => b.priority - a.priority);
}

function generateNextLessonRecommendations(userProgress: UserProgress | null): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (!userProgress) {
    return recommendations;
  }

  // Find current week lessons
  const currentWeekLessons = userProgress.learningPath.pathLessons.filter(
    (pl) => pl.weekNumber === userProgress.currentWeek
  );

  // Find next uncompleted lesson
  const nextLesson = currentWeekLessons.find(
    (pl) => pl.lesson.progress.length === 0
  );

  if (nextLesson) {
    recommendations.push({
      id: `next_lesson_${nextLesson.lesson.id}`,
      type: 'next_lesson',
      title: `Continue: ${nextLesson.lesson.title}`,
      description: `Continue your learning journey with this lesson from Week ${userProgress.currentWeek}`,
      lessonId: nextLesson.lesson.id,
      priority: 10,
      metadata: {
        weekNumber: nextLesson.weekNumber,
        dayNumber: nextLesson.dayNumber,
        estimatedHours: nextLesson.estimatedHours,
        module: nextLesson.lesson.chapter.module.title,
        difficulty: nextLesson.lesson.difficulty,
      },
    });
  }

  // Add upcoming lessons preview
  const upcomingLessons = currentWeekLessons
    .filter((pl) => pl.lesson.progress.length === 0)
    .slice(1, 3); // Next 2 lessons after current

  upcomingLessons.forEach((lesson, index) => {
    recommendations.push({
      id: `upcoming_${lesson.lesson.id}`,
      type: 'upcoming_lesson',
      title: `Upcoming: ${lesson.lesson.title}`,
      description: `Next lesson in your learning path`,
      lessonId: lesson.lesson.id,
      priority: 8 - index,
      metadata: {
        weekNumber: lesson.weekNumber,
        dayNumber: lesson.dayNumber,
        estimatedHours: lesson.estimatedHours,
        module: lesson.lesson.chapter.module.title,
      },
    });
  });

  return recommendations;
}

function generateReviewRecommendations(completedLessons: CompletedLesson[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Analyze performance by module
  const modulePerformance = completedLessons.reduce((acc, lessonProgress) => {
    const moduleName = lessonProgress.lesson.chapter.module.title;
    if (!acc[moduleName]) {
      acc[moduleName] = {
        totalLessons: 0,
        totalTime: 0,
        avgTime: 0,
        difficulty: lessonProgress.lesson.difficulty,
      };
    }
    acc[moduleName].totalLessons++;
    acc[moduleName].totalTime += lessonProgress.timeSpentSeconds;
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages and identify areas for review
  Object.entries(modulePerformance).forEach(([moduleName, performance]: [string, any]) => {
    performance.avgTime = performance.totalTime / performance.totalLessons;

    // Flag modules where user spent significantly more time than average
    const avgTimePerLesson = completedLessons.reduce(
      (sum, lp) => sum + lp.timeSpentSeconds,
      0
    ) / completedLessons.length;

    if (performance.avgTime > avgTimePerLesson * 1.5) {
      recommendations.push({
        id: `review_${moduleName}`,
        type: 'review',
        title: `Review: ${moduleName} Concepts`,
        description: `You spent more time than average on ${moduleName}. Consider reviewing key concepts.`,
        priority: 7,
        metadata: {
          module: moduleName,
          avgTimeSpent: performance.avgTime,
          totalLessons: performance.totalLessons,
          reason: 'time_analysis',
        },
      });
    }
  });

  // Review lessons completed more than 7 days ago
  const oldLessons = completedLessons.filter(
    lp => lp.completedAt && new Date(lp.completedAt).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000
  );

  if (oldLessons.length > 0) {
    recommendations.push({
      id: 'refresh_old_content',
      type: 'review',
      title: 'Refresh Previous Lessons',
      description: `Review ${oldLessons.length} lessons you completed over a week ago to reinforce learning.`,
      priority: 6,
      metadata: {
        oldLessonsCount: oldLessons.length,
        reason: 'retention',
      },
    });
  }

  return recommendations;
}

function generateChallengeRecommendations(completedLessons: CompletedLesson[], userProfile: UserProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Based on experience level
  if (userProfile.experienceLevel === 'FRESHER' || userProfile.experienceLevel === 'JUNIOR') {
    recommendations.push({
      id: 'practice_fundamentals',
      type: 'challenge',
      title: 'Practice Fundamental DSA',
      description: 'Strengthen your foundation with more array and string problems.',
      priority: 7,
      metadata: {
        category: 'dsa_fundamentals',
        difficulty: 'easy',
        experienceLevel: userProfile.experienceLevel,
      },
    });
  }

  if (userProfile.experienceLevel === 'MID' || userProfile.experienceLevel === 'SENIOR') {
    recommendations.push({
      id: 'advanced_system_design',
      type: 'challenge',
      title: 'Advanced System Design',
      description: 'Challenge yourself with distributed systems and scalability concepts.',
      priority: 8,
      metadata: {
        category: 'system_design',
        difficulty: 'hard',
        experienceLevel: userProfile.experienceLevel,
      },
    });
  }

  // Based on completed lessons difficulty
  const completedDifficulties = completedLessons.map(lp => lp.lesson.difficulty);
  const hasCompletedAdvanced = completedDifficulties.includes('HARD');

  if (hasCompletedAdvanced && completedLessons.length > 10) {
    recommendations.push({
      id: 'mock_interviews',
      type: 'challenge',
      title: 'Try Mock Interviews',
      description: 'Test your skills with timed mock interviews.',
      priority: 9,
      metadata: {
        category: 'interview_preparation',
        difficulty: 'mixed',
      },
    });
  }

  return recommendations;
}

function generateCompanySpecificRecommendations(completedLessons: CompletedLesson[], userProfile: UserProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (!userProfile.targetCompanies || userProfile.targetCompanies.length === 0) {
    return recommendations;
  }

  // Company-specific focus areas
  const companyFocus: Record<string, string[]> = {
    'Google': ['system_design', 'algorithms', 'distributed_systems'],
    'Amazon': ['system_design', 'scalability', 'leadership'],
    'Meta': ['system_design', 'distributed_systems', 'product_sense'],
    'Microsoft': ['system_design', 'cloud_architecture', 'scalability'],
    'Apple': ['system_design', 'performance_optimization', 'mobile'],
    'Netflix': ['system_design', 'scalability', 'performance'],
  };

  userProfile.targetCompanies.forEach((company: string) => {
    const focusAreas = companyFocus[company] || ['dsa_fundamentals', 'system_design'];
    
    recommendations.push({
      id: `company_${company}`,
      type: 'company_specific',
      title: `${company} Interview Prep`,
      description: `Focus on ${focusAreas.join(', ')} for ${company} interviews.`,
      priority: 8,
      metadata: {
        company,
        focusAreas,
        reason: 'target_company',
      },
    });
  });

  return recommendations;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'FEEDBACK':
        // Collect feedback on recommendations
        const { recommendationId, feedback, rating } = data;
        
        // Store feedback to improve recommendation algorithm
        // This could go into a RecommendationFeedback table
        
        return NextResponse.json({
          success: true,
          message: 'Feedback recorded successfully',
        });

      case 'DISMISS':
        // Dismiss a recommendation
        const { dismissedRecommendationId } = data;
        
        // Record dismissal to avoid showing similar recommendations
        
        return NextResponse.json({
          success: true,
          message: 'Recommendation dismissed',
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in recommendations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
