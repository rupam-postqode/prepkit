"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor, getWordCount, getReadingTime } from "@/components/admin/RichTextEditor";
import { VideoUpload } from "@/components/admin/VideoUpload";

export default function CreateLessonPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [uploadedVideo, setUploadedVideo] = useState<{
    id: string;
    fileName: string;
    originalName: string;
    url: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const router = useRouter();

  // Auto-save functionality
  const autoSave = useCallback(async (data: {
    title: string;
    description: string;
    markdownContent: string;
    difficulty: string;
  }) => {
    if (!data.title.trim() && !data.description.trim() && !data.markdownContent.trim()) {
      return; // Don't save empty drafts
    }

    setIsAutoSaving(true);
    try {
      // Save to localStorage as draft
      const draftKey = `lesson-draft-${Date.now()}`;
      localStorage.setItem(draftKey, JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }));

      // Keep only last 3 drafts
      const draftKeys = Object.keys(localStorage).filter(key => key.startsWith('lesson-draft-'));
      if (draftKeys.length > 3) {
        draftKeys.sort().slice(0, -3).forEach(key => localStorage.removeItem(key));
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsAutoSaving(false);
    }
  }, []);

  // Auto-save on content changes (debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedAutoSave = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        autoSave({ title, description, markdownContent, difficulty });
      }, 2000); // Save after 2 seconds of inactivity
    };

    if (title || description || markdownContent) {
      debouncedAutoSave();
    }

    return () => clearTimeout(timeoutId);
  }, [title, description, markdownContent, difficulty, autoSave]);

  // Load draft on mount
  useEffect(() => {
    const draftKeys = Object.keys(localStorage).filter(key => key.startsWith('lesson-draft-'));
    if (draftKeys.length > 0) {
      const latestDraftKey = draftKeys.sort().pop()!;
      try {
        const draft = JSON.parse(localStorage.getItem(latestDraftKey)!);
        setTitle(draft.title || "");
        setDescription(draft.description || "");
        setMarkdownContent(draft.markdownContent || "");
        setDifficulty(draft.difficulty || "BEGINNER");
        setLastSaved(new Date(draft.timestamp));
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // For now, we'll create a lesson in the first available chapter
      // In a real implementation, you'd have chapter selection
      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          markdownContent,
          difficulty,
          chapterId: "sample-chapter-id", // This would be selected from a dropdown
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create lesson");
      }

      router.push("/admin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Lesson</h1>
              <p className="mt-2 text-gray-600">Add new learning content to the platform</p>
            </div>
            {lastSaved && (
              <div className="text-right">
                <div className="text-sm text-green-600 font-medium">
                  {isAutoSaving ? "💾 Saving..." : "✅ Auto-saved"}
                </div>
                <div className="text-xs text-gray-500">
                  {lastSaved.toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the lesson"
                required
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Lesson Content
                </label>
                {markdownContent && (
                  <div className="text-xs text-gray-500 space-x-4">
                    <span>{getWordCount(markdownContent)} words</span>
                    <span>{getReadingTime(markdownContent)} min read</span>
                  </div>
                )}
              </div>
              <RichTextEditor
                value={markdownContent}
                onChange={setMarkdownContent}
                placeholder="Write your lesson content using Markdown..."
                height={500}
                preview="live"
              />
            </div>

            <div>
              <VideoUpload
                onVideoUploaded={setUploadedVideo}
                currentVideoId={uploadedVideo?.id}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Lesson"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
