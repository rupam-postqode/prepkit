import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    <div className={cn(
      "min-h-screen",
      // Modern gradient background
      "bg-gradient-to-br from-gray-50 via-white to-indigo-50/30",
      "dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900/20"
    )}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        {showWelcome && pathData && (
          <Card className={cn(
            "mb-8 p-6 overflow-hidden relative",
            // Modern gradient card
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
            "border border-green-200/50 dark:border-green-700/50",
            "shadow-lg shadow-green-500/10 dark:shadow-green-400/5",
            "animate-in fade-in-0 slide-in-from-top-4 duration-700"
          )}>
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-2xl" />
            
            <div className="flex items-start space-x-4 relative">
              <div className="text-5xl animate-bounce">🎉</div>
              <div className="flex-1">
                <h3 className={cn(
                  "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
                )}>
                  Welcome to your learning journey, {session?.user?.name}!
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You&apos;ve successfully enrolled in <strong>{pathData.title}</strong> path.
                  This {pathData.durationWeeks}-week program will prepare you for interviews at top companies.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Your next steps:</span>
                  <span className={cn(
                    "px-3 py-1 text-sm rounded-full",
                    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
                    "border border-green-200 dark:border-green-700"
                  )}>
                    📖 Start with Week 1 lessons
                  </span>
                  <span className={cn(
                    "px-3 py-1 text-sm rounded-full",
                    "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
                    "border border-blue-200 dark:border-blue-700"
                  )}>
                    🎯 Set daily learning goals
                  </span>
                  <span className={cn(
                    "px-3 py-1 text-sm rounded-full",
                    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
                    "border border-purple-200 dark:border-purple-700"
                  )}>
                    📊 Track your progress
                  </span>
                </div>
                <Link
                  href={`/learning-paths/${pathData.id}`}
                  className={cn(
                    "inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg",
                    "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
                    "text-white border-0 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30",
                    "transition-all duration-300 hover:scale-105"
                  )}
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
            <h1 className={cn(
              "text-3xl font-bold text-gray-900 dark:text-gray-100",
              "animate-in fade-in-0 duration-700"
            )}>
              Welcome back, {session?.user?.name}! 👋
            </h1>
            <p className={cn(
              "mt-2 text-gray-600 dark:text-gray-400",
              "animate-in fade-in-0 duration-700 delay-100"
            )}>
              Continue your interview preparation journey. You&apos;re making great progress!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className={cn(
            // Modern glassmorphism
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
            "border border-gray-200/50 dark:border-gray-700/50",
            "shadow-lg shadow-gray-900/5 dark:shadow-black/10",
            "hover:shadow-xl hover:scale-105 transition-all duration-300",
            "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200"
          )}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left p-4">
              <div className={cn(
                "text-3xl lg:text-3xl mb-2 lg:mb-0 lg:mr-4",
                "transition-transform duration-300 group-hover:scale-110"
              )}>
                📚
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Lessons Completed</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{completedLessons}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">of {totalLessons} total</p>
              </div>
            </div>
          </Card>

          <Card className={cn(
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
            "border border-gray-200/50 dark:border-gray-700/50",
            "shadow-lg shadow-gray-900/5 dark:shadow-black/10",
            "hover:shadow-xl hover:scale-105 transition-all duration-300",
            "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          )}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left p-4">
              <div className={cn(
                "text-3xl lg:text-3xl mb-2 lg:mb-0 lg:mr-4",
                "transition-transform duration-300 group-hover:scale-110"
              )}>
                🔥
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Study Streak</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{studyStreak}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">days this week</p>
              </div>
            </div>
          </Card>

          <Card className={cn(
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
            "border border-gray-200/50 dark:border-gray-700/50",
            "shadow-lg shadow-gray-900/5 dark:shadow-black/10",
            "hover:shadow-xl hover:scale-105 transition-all duration-300",
            "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400"
          )}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left p-4">
              <div className={cn(
                "text-3xl lg:text-3xl mb-2 lg:mb-0 lg:mr-4",
                "transition-transform duration-300 group-hover:scale-110"
              )}>
                ⏱️
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Study Time</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{studyTimeFormatted}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">total time</p>
              </div>
            </div>
          </Card>

          <Card className={cn(
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
            "border border-gray-200/50 dark:border-gray-700/50",
            "shadow-lg shadow-gray-900/5 dark:shadow-black/10",
            "hover:shadow-xl hover:scale-105 transition-all duration-300",
            "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500"
          )}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left p-4">
              <div className={cn(
                "text-3xl lg:text-3xl mb-2 lg:mb-0 lg:mr-4",
                "transition-transform duration-300 group-hover:scale-110"
              )}>
                📊
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">complete</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Path Progress */}
        <div className="mb-8">
          <h2 className={cn(
            "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6",
            "animate-in fade-in-0 duration-700 delay-600"
          )}>
            Your Learning Path
          </h2>
          {pathData ? (
            <Card className={cn(
              "p-6 overflow-hidden relative",
              "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
              "border border-gray-200/50 dark:border-gray-700/50",
              "shadow-lg shadow-gray-900/5 dark:shadow-black/10",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700"
            )}>
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{pathData.emoji}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{pathData.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Week {currentWeek} of {pathData.durationWeeks} • {completedLessons} of {totalLessons} lessons completed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Started {pathData.startedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    href={`/learning-paths/${pathData.id}`}
                    className={cn(
                      "text-3xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
                      "transition-colors duration-200 hover:scale-105 inline-block"
                    )}
                  >
                    {Math.round(pathProgressPercentage)}%
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">complete</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                <div
                  className={cn(
                    "h-4 rounded-full transition-all duration-500",
                    "bg-gradient-to-r from-indigo-500 to-purple-500"
                  )}
                  style={{ width: `${pathProgressPercentage}%` }}
                />
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Preparing for:</span>
                    {companies.slice(0, 4).map((company) => (
                      <span
                        key={company}
                        className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
                          "border border-indigo-200 dark:border-indigo-700"
                        )}
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </Card>
          ) : (
            <Card className={cn(
              "p-8 text-center",
              "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
              "border border-gray-200/50 dark:border-gray-700/50",
              "shadow-lg shadow-gray-900/5 dark:shadow-black/10",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700"
            )}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Choose Your Learning Path</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select a structured learning path to guide your interview preparation journey.
              </p>
              <Link
                href="/paths"
                className={cn(
                  "inline-flex items-center px-6 py-3 text-base font-medium rounded-lg",
                  "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                  "text-white border-0 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30",
                  "transition-all duration-300 hover:scale-105"
                )}
              >
                Browse Learning Paths →
              </Link>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card className={cn(
          "p-6",
          "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
          "border border-gray-200/50 dark:border-gray-700/50",
          "shadow-lg shadow-gray-900/5 dark:shadow-black/10",
          "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800"
        )}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h2>
          {lessonProgress.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Start Your Learning Journey</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Choose a structured learning path to guide your interview preparation.
              </p>
              <Link
                href="/paths"
                className={cn(
                  "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                  "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                  "text-white border-0 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30",
                  "transition-all duration-300 hover:scale-105"
                )}
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
                  <div key={progress.id} className={cn(
                    "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0",
                    "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg px-2 -mx-2"
                  )}>
                    <div className="flex items-center">
                      <div className={cn(
                        "w-3 h-3 rounded-full mr-3",
                        progress.completedAt 
                          ? "bg-green-500 shadow-sm shadow-green-500/30" 
                          : "bg-blue-500 shadow-sm shadow-blue-500/30"
                      )}></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{progress.lesson.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {progress.lesson.chapter.module.title} • {progress.lesson.chapter.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {progress.completedAt ? 'Completed' : 'In Progress'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
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
