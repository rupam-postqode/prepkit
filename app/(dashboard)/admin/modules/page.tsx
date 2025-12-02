"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  BookOpen,
  ChevronLeft,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  orderIndex: number;
  _count?: {
    chapters: number;
  };
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");
  const [isReordering, setIsReordering] = useState(false);

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

  // Reorder modules
  const handleReorder = async (moduleId: string, direction: 'up' | 'down') => {
    const currentIndex = modules.findIndex(m => m.id === moduleId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= modules.length) return;

    // Create new order indices
    const reorderedModules = [...modules];
    const [movedModule] = reorderedModules.splice(currentIndex, 1);
    reorderedModules.splice(newIndex, 0, movedModule);

    // Calculate new order indices (starting from 1)
    const reorderItems = reorderedModules.map((module, index) => ({
      id: module.id,
      newOrderIndex: index + 1
    }));

    setIsReordering(true);
    setError("");

    try {
      const response = await fetch('/api/admin/modules/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: reorderItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to reorder modules');
      }

      // Refresh modules to get updated order
      await fetchModules();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reorder modules");
      // Refresh to revert optimistic update
      await fetchModules();
    } finally {
      setIsReordering(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Modules</h1>
            <p className="text-muted-foreground">
              Organize and manage your learning content structure
            </p>
          </div>

          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              <Plus className="w-4 h-4 mr-2" />
              Create Module
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Module Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Data Structures & Algorithms"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emoji">Icon</Label>
                    <Input
                      id="emoji"
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      placeholder="📚"
                      maxLength={2}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the module content..."
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating && <Spinner size="sm" className="mr-2" />}
                    Create Module
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Modules Grid */}
        {modules.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((module, index) => (
                <Card key={module.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{module.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{module.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              Order {module.orderIndex}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {module._count?.chapters || 0} chapters
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Reorder Controls */}
                      <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(module.id, 'up')}
                          disabled={index === 0 || isReordering}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(module.id, 'down')}
                          disabled={index === modules.length - 1 || isReordering}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {module.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-3">
                    <div className="flex space-x-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/modules/${module.id}`)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(module.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No modules yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Create your first module to start organizing your course content and building learning paths.
                </p>
              </div>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Module
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {modules.length > 0 && !error && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>{modules.length} module{modules.length !== 1 ? 's' : ''} organized</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
