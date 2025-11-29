"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  publishedAt: string | null;
  chapter: {
    title: string;
    module: {
      title: string;
      emoji: string;
    };
  };
  _count?: {
    progress: number;
    practiceLinks: number;
  };
}

export default function LessonsAdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, published, draft
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const router = useRouter();

  // Fetch lessons
  const fetchLessons = async () => {
    try {
      const response = await fetch("/api/admin/lessons");
      if (!response.ok) throw new Error("Failed to fetch lessons");
      const data = await response.json();
      setLessons(data.data);
      setFilteredLessons(data.data);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Filter lessons based on search and filters
  useEffect(() => {
    let filtered = lessons;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.chapter.module.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(lesson => {
        if (statusFilter === "published") return lesson.publishedAt !== null;
        if (statusFilter === "draft") return lesson.publishedAt === null;
        return true;
      });
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(lesson => lesson.difficulty === difficultyFilter);
    }

    setFilteredLessons(filtered);
  }, [lessons, searchQuery, statusFilter, difficultyFilter]);

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete lesson");
      }

      // Refresh lessons
      await fetchLessons();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      alert("Failed to delete lesson: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const togglePublishStatus = async (lessonId: string, currentlyPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !currentlyPublished,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update lesson");
      }

      // Refresh lessons
      await fetchLessons();
    } catch (error) {
      console.error("Failed to update lesson:", error);
      alert("Failed to update lesson: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Lessons</h1>
              <p className="mt-2 text-gray-600">View, edit, and manage all lessons</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin")}
              >
                Back to Admin
              </Button>
              <Button
                onClick={() => router.push("/admin/lessons/create")}
              >
                Create Lesson
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDifficultyFilter("all");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredLessons.length} of {lessons.length} lessons
            </p>
          </div>

          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{lesson.chapter.module.emoji}</span>
                    <span className="text-sm text-gray-600">{lesson.chapter.module.title}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{lesson.chapter.title}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {lesson.title}
                  </h3>

                  <p className="text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      lesson.difficulty === 'EASY'
                        ? 'bg-green-100 text-green-800'
                        : lesson.difficulty === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {lesson.difficulty}
                    </span>

                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      lesson.publishedAt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lesson.publishedAt ? 'Published' : 'Draft'}
                    </span>

                    <span>👥 {lesson._count?.progress || 0} students</span>
                    <span>💻 {lesson._count?.practiceLinks || 0} practice links</span>
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/lessons/${lesson.id}`)}
                  >
                    View
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/lessons/${lesson.id}/edit`)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant={lesson.publishedAt ? "secondary" : "default"}
                    size="sm"
                    onClick={() => togglePublishStatus(lesson.id, !!lesson.publishedAt)}
                  >
                    {lesson.publishedAt ? "Unpublish" : "Publish"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(lesson.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredLessons.length === 0 && lessons.length > 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons match your filters</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDifficultyFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {lessons.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
              <p className="text-gray-600 mb-6">Create your first lesson to get started.</p>
              <Button onClick={() => router.push("/admin/lessons/create")}>
                Create First Lesson
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
