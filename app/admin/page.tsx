import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function AdminDashboard() {
  // Check admin access
  await requireAdmin();

  // Get dashboard stats
  const [userCount, lessonCount, moduleCount, subscriptionCount] = await Promise.all([
    prisma.user.count(),
    prisma.lesson.count(),
    prisma.module.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      subscriptionStatus: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage content, users, and platform analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">👥</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">📚</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{lessonCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">📁</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Modules</p>
                <p className="text-2xl font-bold text-gray-900">{moduleCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-2xl">💎</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Users */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.subscriptionStatus === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.subscriptionStatus}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="/admin/modules">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Modules</h3>
              <p className="text-gray-600 text-sm">Organize content structure and chapters</p>
            </Card>
          </a>

          <a href="/admin/lessons">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Lessons</h3>
              <p className="text-gray-600 text-sm">View, edit, and organize all lessons</p>
            </Card>
          </a>

          <a href="/admin/lessons/create">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Lesson</h3>
              <p className="text-gray-600 text-sm">Add new learning content to the platform</p>
            </Card>
          </a>

          <a href="/admin/jobs">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-4">💼</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Board</h3>
              <p className="text-gray-600 text-sm">Post and manage job listings for the community</p>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
