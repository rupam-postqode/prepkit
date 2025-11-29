import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch user's progress data
  const userId = session.user?.id || "";

  // Get user's lesson progress
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
  });

  // Calculate statistics
  const completedLessons = lessonProgress.filter(p => p.completedAt).length;
  const totalLessons = await prisma.lesson.count();
  const totalStudyTime = lessonProgress.reduce((acc, p) => acc + p.timeSpentSeconds, 0);

  // Calculate module progress
  const modules = await prisma.module.findMany({
    include: {
      chapters: {
        include: {
          lessons: {
            include: {
              progress: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  const moduleProgress = modules.map(module => {
    const totalLessonsInModule = module.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
    const completedLessonsInModule = module.chapters.reduce((acc, chapter) =>
      acc + chapter.lessons.filter(lesson => lesson.progress.some(p => p.completedAt)).length, 0
    );
    const progressPercentage = totalLessonsInModule > 0 ? (completedLessonsInModule / totalLessonsInModule) * 100 : 0;

    return {
      ...module,
      totalLessons: totalLessonsInModule,
      completedLessons: completedLessonsInModule,
      progressPercentage,
    };
  });

  // Calculate study streak (simplified - last 7 days with activity)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentActivity = await prisma.lessonProgress.findMany({
    where: {
      userId,
      updatedAt: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const uniqueDays = [...new Set(recentActivity.map(p => p.updatedAt.toDateString()))].length;
  const studyStreak = Math.min(uniqueDays, 7); // Cap at 7 for now

  // Format study time
  const hours = Math.floor(totalStudyTime / 3600);
  const minutes = Math.floor((totalStudyTime % 3600) / 60);
  const studyTimeFormatted = `${hours}h ${minutes}m`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Continue your interview preparation journey. You're making great progress!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">📚</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedLessons}</p>
                <p className="text-xs text-gray-500">of {totalLessons} total</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">🔥</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900">{studyStreak} days</p>
                <p className="text-xs text-gray-500">this week</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">⏱️</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Time</p>
                <p className="text-2xl font-bold text-gray-900">{studyTimeFormatted}</p>
                <p className="text-xs text-gray-500">total time</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">📊</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">complete</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Modules Progress */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moduleProgress.map((module) => (
              <Card key={module.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{module.emoji}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600">{module.completedLessons} of {module.totalLessons} lessons</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-indigo-600">
                      {Math.round(module.progressPercentage)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${module.progressPercentage}%` }}
                  ></div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {lessonProgress.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Learning Journey</h3>
              <p className="text-gray-600 mb-4">
                Begin with our Data Structures & Algorithms module to kickstart your interview preparation.
              </p>
              <a
                href="/modules/dsa"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Start Learning →
              </a>
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

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/modules/dsa">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Continue DSA</h3>
              <p className="text-gray-600 text-sm">Master algorithms and data structures</p>
            </Card>
          </a>

          <a href="/modules/machine-coding">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Coding</h3>
              <p className="text-gray-600 text-sm">Build real-world applications</p>
            </Card>
          </a>

          <a href="/modules/system-design">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-4">🏗️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Design</h3>
              <p className="text-gray-600 text-sm">Learn scalable architecture</p>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
