import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function AdminAnalyticsPage() {
  // Check admin access
  await requireAdmin();

  // Calculate date ranges
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Get analytics data
  const [
    totalUsers,
    activeUsers,
    totalLessons,
    totalModules,
    totalChapters,
    recentSignups,
    lessonCompletions,
    popularLessons,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        lastLoginAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.lesson.count(),
    prisma.module.count(),
    prisma.chapter.count(),
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    }),
    prisma.lessonProgress.count({
      where: {
        completedAt: { not: null },
      },
    }),
    prisma.lessonProgress.groupBy({
      by: ['lessonId'],
      where: {
        completedAt: { not: null },
      },
      _count: {
        lessonId: true,
      },
      orderBy: {
        _count: {
          lessonId: 'desc',
        },
      },
      take: 10,
    }),
  ]);

  // Get popular lessons with details
  const popularLessonDetails = await Promise.all(
    popularLessons.map(async (item) => {
      const lesson = await prisma.lesson.findUnique({
        where: { id: item.lessonId },
        select: {
          id: true,
          title: true,
          chapter: {
            select: {
              title: true,
              module: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });
      return {
        ...lesson,
        completions: item._count.lessonId,
      };
    })
  );

  // Calculate growth metrics
  const lastWeekSignups = recentSignups.filter(
    (user) => user.createdAt >= sevenDaysAgo
  ).length;

  const previousWeekSignups = await prisma.user.count({
    where: {
      createdAt: {
        gte: fourteenDaysAgo,
        lt: sevenDaysAgo,
      },
    },
  });

  const signupGrowth = previousWeekSignups > 0
    ? ((lastWeekSignups - previousWeekSignups) / previousWeekSignups * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Platform usage statistics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">👥</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-xs text-green-600">+{lastWeekSignups} this week</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">🔥</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                <p className="text-xs text-gray-500">{((activeUsers / totalUsers) * 100).toFixed(1)}% of total</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">📚</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
                <p className="text-xs text-gray-500">across {totalModules} modules</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">✅</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completions</p>
                <p className="text-2xl font-bold text-gray-900">{lessonCompletions}</p>
                <p className="text-xs text-gray-500">lessons completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This week</span>
                <span className="text-sm font-medium text-gray-900">{lastWeekSignups} signups</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last week</span>
                <span className="text-sm font-medium text-gray-900">{previousWeekSignups} signups</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium text-gray-900">Growth</span>
                <span className={`text-sm font-medium ${parseFloat(signupGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(signupGrowth) >= 0 ? '+' : ''}{signupGrowth}%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Modules</span>
                <span className="text-sm font-medium text-gray-900">{totalModules}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Chapters</span>
                <span className="text-sm font-medium text-gray-900">{totalChapters}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lessons</span>
                <span className="text-sm font-medium text-gray-900">{totalLessons}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium text-gray-900">Avg lessons per module</span>
                <span className="text-sm font-medium text-gray-900">
                  {(totalLessons / Math.max(totalModules, 1)).toFixed(1)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Popular Lessons */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Lessons</h3>
          <div className="space-y-4">
            {popularLessonDetails.map((lesson, index) => (
              <div key={lesson?.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-600">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{lesson?.title}</p>
                    <p className="text-xs text-gray-600">
                      {lesson?.chapter?.module?.title} • {lesson?.chapter?.title}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{lesson?.completions}</span>
                  <span className="text-xs text-gray-500 ml-1">completions</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
