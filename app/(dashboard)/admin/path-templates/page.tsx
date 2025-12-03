"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Trash2, Zap, Eye } from "lucide-react";
import Link from "next/link";

interface PathTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  difficulty: string;
  targetAudience: string;
  lessonsPerDay: number;
  daysPerWeek: number;
  estimatedHoursPerDay: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    generatedPaths: number;
  };
}

export default function PathTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<PathTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/path-templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    setDeleting(templateId);
    try {
      const response = await fetch(`/api/admin/path-templates/${templateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTemplates();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    } finally {
      setDeleting(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case "BEGINNER":
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Path Templates</h1>
            <p className="text-gray-600 mt-1">
              Create and manage templates for automatic learning path generation
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/admin/learning-paths">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Paths
              </Button>
            </Link>
            <Link href="/admin/path-templates/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Settings className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold">
                  {templates.filter(t => t.isActive).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Paths Generated</p>
                <p className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + t._count.generatedPaths, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Templates Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first template to enable automatic path generation
            </p>
            <Link href="/admin/path-templates/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`p-6 hover:shadow-lg transition-shadow ${
                  !template.isActive ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{template.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                    </div>
                  </div>
                  {!template.isActive && (
                    <Badge variant="outline" className="text-gray-500">
                      Inactive
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">{template.targetAudience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{template.durationWeeks} weeks</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Intensity:</span>
                    <span className="font-medium">
                      {template.lessonsPerDay} lessons/day ({template.estimatedHoursPerDay}h)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Paths Generated:</span>
                    <span className="font-medium">{template._count.generatedPaths}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/admin/path-templates/${template.id}`)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => router.push(`/admin/path-templates/${template.id}/generate`)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(template.id)}
                    disabled={deleting === template.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
