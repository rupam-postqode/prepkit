"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  _count: {
    chapters: number;
  };
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📚");

  const router = useRouter();

  // Fetch modules
  const fetchModules = async () => {
    try {
      const response = await fetch("/api/admin/modules");
      if (!response.ok) throw new Error("Failed to fetch modules");
      const data = await response.json();
      setModules(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Create module
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const response = await fetch("/api/admin/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          emoji,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create module");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setEmoji("📚");
      setShowCreateForm(false);

      // Refresh modules
      await fetchModules();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  // Delete module
  const handleDelete = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete module");
      }

      // Refresh modules
      await fetchModules();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
              <p className="mt-2 text-gray-600">Manage course modules and their structure</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin")}
              >
                Back to Admin
              </Button>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? "Cancel" : "Create Module"}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Create Module Form */}
        {showCreateForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Module</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Module Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Data Structures & Algorithms"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-2">
                    Emoji Icon
                  </label>
                  <Input
                    id="emoji"
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="📚"
                    maxLength={2}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the module"
                  rows={3}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
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
                  {isCreating ? "Creating..." : "Create Module"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Modules List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{module.emoji}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-500">Order: {module.orderIndex}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{module.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{module._count.chapters} chapters</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/modules/${module.id}`)}
                  className="flex-1"
                >
                  Manage Chapters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(module.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {modules.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-600 mb-6">Create your first module to get started with content organization.</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Your First Module
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
