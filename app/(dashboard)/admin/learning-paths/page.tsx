import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users, Clock, BookOpen, BarChart3 } from "lucide-react";
import Link from "next/link";

interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  difficulty: string;
  targetCompanies: string[] | string; // Handle both array and string formats
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    pathLessons: number;
    userProgress: number;
  };
}

export default async function AdminLearningPathsPage() {
  // Fetch all learning paths with enrollment counts
  const learningPaths = await prisma.learningPath.findMany({
    include: {
      _count: {
        select: {
          pathLessons: true,
          userProgress: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
            <p className="mt-2 text-gray-600">Manage and create learning paths for interview preparation</p>
          </div>
          <Link href="/admin/learning-paths/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Path
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paths</p>
                <p className="text-2xl font-bold text-gray-900">{learningPaths.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {learningPaths.reduce((sum, path) => sum + path._count.userProgress, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Paths</p>
                <p className="text-2xl font-bold text-gray-900">
                  {learningPaths.filter(path => path.isActive).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {learningPaths.length > 0 
                    ? Math.round(learningPaths.reduce((sum, path) => sum + path.durationWeeks, 0) / learningPaths.length)
                    : 0} weeks
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Paths Table */}
        <Card className="shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {learningPaths.map((path) => (
                  <tr key={path.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{path.emoji}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{path.title}</div>
                          <div className="text-sm text-gray-500">{path.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <Badge className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {path.durationWeeks} weeks
                        </div>
                        {(() => {
                          let companies: string[] = [];
                          if (Array.isArray(path.targetCompanies)) {
                            companies = path.targetCompanies;
                          } else if (typeof path.targetCompanies === 'string') {
                            try {
                              companies = JSON.parse(path.targetCompanies);
                            } catch (e) {
                              // If parsing fails, treat as empty array
                              companies = [];
                            }
                          }
                          
                          return companies.length > 0 && (
                            <div className="text-xs text-gray-500">
                              Targets: {companies.slice(0, 2).join(", ")}
                              {companies.length > 2 && ` +${companies.length - 2}`}
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {path._count.pathLessons} lessons
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {path._count.userProgress} enrolled
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={path.isActive ? "default" : "secondary"}>
                        {path.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/learning-paths/${path.id}/analytics`}>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/learning-paths/${path.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {learningPaths.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Learning Paths</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first learning path.</p>
              <Link href="/admin/learning-paths/create">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Learning Path
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}