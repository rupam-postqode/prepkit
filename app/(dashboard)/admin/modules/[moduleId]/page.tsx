"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  orderIndex: number;
  chapters: Chapter[];
  _count: {
    chapters: number;
  };
}

interface Chapter {
  id: string;
  title: string;
  slug: string;
  description: string;
  orderIndex: number;
  difficultyLevel: string;
  estimatedHours: number;
  _count: {
    lessons: number;
  };
}

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("BEGINNER");
  const [estimatedHours, setEstimatedHours] = useState(1);

  const router = useRouter();

  // Fetch module with chapters
  const fetchModule = async () => {
    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`);
      if (!response.ok) throw new Error("Failed to fetch module");
      const data = await response.json();
      setModule(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  // Create chapter
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const response = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          moduleId,
          difficultyLevel,
          estimatedHours,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create chapter");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setDifficultyLevel("BEGINNER");
      setEstimatedHours(1);
      setShowCreateForm(false);

      // Refresh module
      await fetchModule();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  // Delete chapter
  const handleDelete = async (chapterId: string) => {
    if (!confirm("Are you sure you want to delete this chapter? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/chapters/${chapterId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete chapter");
      }

      // Refresh module
      await fetchModule();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Module not found</h3>
          <Button onClick={() => router.push("/admin/modules")}>
            Back to Modules
          </Button>
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
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/modules")}
              >
                ← Back to Modules
              </Button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{module.emoji}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
                  <p className="mt-1 text-gray-600">{module.description}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "Create Chapter"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Create Chapter Form */}
        {showCreateForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Chapter</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Arrays & Strings"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    id="difficultyLevel"
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the chapter"
                    rows={3}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    min="1"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 1)}
                    placeholder="1"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Chapter"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Chapters List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Chapters ({module.chapters.length})
          </h2>

          {module.chapters.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No chapters yet</h3>
              <p className="text-gray-600 mb-6">Create your first chapter to organize lessons within this module.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create First Chapter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {module.chapters.map((chapter) => (
                <Card key={chapter.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{chapter.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>Order: {chapter.orderIndex}</span>
                        <span>{chapter.estimatedHours}h estimated</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chapter.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                          chapter.difficultyLevel === 'EASY' ? 'bg-blue-100 text-blue-800' :
                          chapter.difficultyLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {chapter.difficultyLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{chapter.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{chapter._count.lessons} lessons</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/chapters/${chapter.id}`)}
                      className="flex-1"
                    >
                      Manage Lessons
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(chapter.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
