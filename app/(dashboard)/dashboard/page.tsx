import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { interactive } from "@/lib/transitions";

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const showWelcome = params?.welcome === 'true';

  // Fetch user's progress data
  const userId = session?.user?.id || "";

  // Get user's learning path progress
  const pathProgress = await prisma.userPathProgress.findFirst({
    where: {
      userId,
      isActive: true,
    },
    include: {
      learningPath: {
        include: {
          pathLessons: {
            where: {
              lesson: {
                publishedAt: { not: null },
              },
            },
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
  });

  // Calculate path progress statistics
  let pathData = null;
  let completedLessons = 0;
  let totalLessons = 0;
  let pathProgressPercentage = 0;
  let currentWeek = 1;
  let currentDay = 1;

  if (pathProgress) {
    totalLessons = pathProgress.learningPath.pathLessons.length;
    completedLessons = pathProgress.learningPath.pathLessons.filter(
      (pl) => pl.lesson.progress.length > 0
    ).length;
    pathProgressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    currentWeek = pathProgress.currentWeek;
    currentDay = pathProgress.currentDay;

    pathData = {
      id: pathProgress.learningPath.id,
      title: pathProgress.learningPath.title,
      emoji: pathProgress.learningPath.emoji,
      durationWeeks: pathProgress.learningPath.durationWeeks,
      targetCompanies: pathProgress.learningPath.targetCompanies,
      startedAt: pathProgress.startedAt,
    };
  }

  // Get user's lesson progress for study time and recent activity
  const lessonProgress = await prisma.lessonProgress.findMany({
    where: { userId },
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
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const totalStudyTime = lessonProgress.reduce((acc, p) => acc + p.timeSpentSeconds, 0);

  // Calculate study streak (simplified - last 7 days with activity)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentActivity = lessonProgress.filter(p => p.updatedAt >= sevenDaysAgo);
  const uniqueDays = [...new Set(recentActivity.map(p => p.updatedAt.toDateString()))].length;
  const studyStreak = Math.min(uniqueDays, 7); // Cap at 7 for now

  // Format study time
  const hours = Math.floor(totalStudyTime / 3600);
  const minutes = Math.floor((totalStudyTime % 3600) / 60);
  const studyTimeFormatted = `${hours}h ${minutes}m`;

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="max-w-7xl mx-auto py-4 px-3 sm:px-4 lg:px-6">
        {/* Welcome Message */}
        {showWelcome && pathData && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to your learning journey, {session?.user?.name}!
                </h3>
                <p className="text-gray-700 mb-4">
                  You&apos;ve successfully enrolled in the <strong>{pathData.title}</strong> path.
                  This {pathData.durationWeeks}-week program will prepare you for interviews at top companies.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm text-gray-600">Your next steps:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    📖 Start with Week 1 lessons
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    🎯 Set daily learning goals
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    📊 Track your progress
                  </span>
                </div>
                <Link
                  href={`/learning-paths/${pathData.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Start Learning →
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session?.user?.name}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Continue your interview preparation journey. You&apos;re making great progress!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8">
          <Card className={interactive.card + " mobile-card touch-target"}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left">
              <div className="text-2xl lg:text-2xl mb-2 lg:mb-0 lg:mr-4">📚</div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Lessons Completed</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{completedLessons}</p>
                <p className="text-xs text-muted-foreground/70">of {totalLessons} total</p>
              </div>
            </div>
          </Card>

          <Card className={interactive.card + " mobile-card touch-target"}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left">
              <div className="text-2xl lg:text-2xl mb-2 lg:mb-0 lg:mr-4">🔥</div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Study Streak</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{studyStreak}</p>
                <p className="text-xs text-muted-foreground/70">days this week</p>
              </div>
            </div>
          </Card>

          <Card className={interactive.card + " mobile-card touch-target"}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left">
              <div className="text-2xl lg:text-2xl mb-2 lg:mb-0 lg:mr-4">⏱️</div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Study Time</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{studyTimeFormatted}</p>
                <p className="text-xs text-muted-foreground/70">total time</p>
              </div>
            </div>
          </Card>

          <Card className={interactive.card + " mobile-card touch-target lg:col-span-1 col-span-2"}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left">
              <div className="text-2xl lg:text-2xl mb-2 lg:mb-0 lg:mr-4">📊</div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">
                  {totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground/70">complete</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Path Progress */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Path</h2>
          {pathData ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{pathData.emoji}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{pathData.title}</h3>
                    <p className="text-sm text-gray-600">
                      Week {currentWeek} of {pathData.durationWeeks} • {completedLessons} of {totalLessons} lessons completed
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Started {pathData.startedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              <div className="text-right">
                <Link
                  href={`/learning-paths/${pathData.id}`}
                  className="text-3xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {Math.round(pathProgressPercentage)}%
                </Link>
                <p className="text-sm text-gray-600">complete</p>
              </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${pathProgressPercentage}%` }}
                ></div>
              </div>
              {(() => {
                let companies: string[] = [];
                if (Array.isArray(pathData.targetCompanies)) {
                  companies = pathData.targetCompanies;
                } else if (typeof pathData.targetCompanies === 'string') {
                  try {
                    companies = JSON.parse(pathData.targetCompanies);
                  } catch (e) {
                    // If parsing fails, treat as empty array
                    companies = [];
                  }
                }
                
                return companies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Preparing for:</span>
                    {companies.slice(0, 4).map((company) => (
                      <span
                        key={company}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Your Learning Path</h3>
              <p className="text-gray-600 mb-6">
                Select a structured learning path to guide your interview preparation journey.
              </p>
              <Link
                href="/paths"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Learning Paths →
              </Link>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {lessonProgress.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Learning Journey</h3>
              <p className="text-gray-600 mb-4">
                Choose a structured learning path to guide your interview preparation.
              </p>
              <Link
                href="/paths"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Choose Your Path →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {lessonProgress
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .slice(0, 5)
                .map((progress) => (
                  <div key={progress.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        progress.completedAt ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{progress.lesson.title}</p>
                        <p className="text-sm text-gray-600">
                          {progress.lesson.chapter.module.title} • {progress.lesson.chapter.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {progress.completedAt ? 'Completed' : 'In Progress'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {progress.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
