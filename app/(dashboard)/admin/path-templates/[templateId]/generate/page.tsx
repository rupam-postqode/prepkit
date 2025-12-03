"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface GenerationPreview {
  template: {
    id: string;
    name: string;
    description: string;
    emoji: string;
  };
  generation: {
    totalLessons: number;
    totalEstimatedHours: number;
    actualDurationWeeks: number;
    plannedDurationWeeks: number;
    contentSummary: {
      byModule: Record<string, number>;
      byDifficulty: Record<string, number>;
      byType: Record<string, number>;
    };
    schedule: Array<{
      weekNumber: number;
      dayNumber: number;
      lessons: Array<{
        lessonId: string;
        orderIndex: number;
        estimatedHours: number;
        isRequired: boolean;
      }>;
      totalEstimatedHours: number;
    }>;
  };
}

export default function GeneratePathPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<GenerationPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    generatePreview();
  }, []);

  const generatePreview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/admin/path-templates/${params.templateId}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ preview: true }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreview(data);
        setTitle(`${data.template.name} - Generated Path`);
        setDescription(data.template.description);
        setEmoji(data.template.emoji);
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.details || "Failed to generate preview");
      }
    } catch (err) {
      console.error("Error generating preview:", err);
      setError("Failed to generate preview. Please check if content metadata is initialized.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please provide a title for the learning path");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(
        `/api/admin/path-templates/${params.templateId}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preview: false,
            title,
            description,
            emoji,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/learning-paths/${data.path.id}/schedule`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create learning path");
      }
    } catch (err) {
      console.error("Error creating path:", err);
      alert("Failed to create learning path");
    } finally {
      setGenerating(false);
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
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating path preview...</p>
          <p className="text-sm text-gray-500 mt-2">
            Analyzing lessons and creating schedule
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/admin/path-templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </Link>
          </div>

          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generation Failed
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{error}</p>
            <div className="space-x-3">
              <Button
                onClick={generatePreview}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Try Again
              </Button>
              <Link href="/admin/content-metadata">
                <Button variant="outline">
                  Initialize Metadata
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!preview) return null;

  const { template, generation } = preview;
  const durationMatch = generation.actualDurationWeeks === generation.plannedDurationWeeks;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/path-templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Preview Generated Path</h1>
              <p className="text-gray-600">Review and customize before creating</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Path Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Path Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Path Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input
                    id="emoji"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="mt-1"
                    maxLength={2}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Generation Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Lessons</span>
                  <Badge variant="outline">{generation.totalLessons}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Study Hours</span>
                  <Badge variant="outline">
                    {Math.round(generation.totalEstimatedHours)}h
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration</span>
                  <Badge variant="outline">
                    {generation.actualDurationWeeks} weeks
                  </Badge>
                </div>
                {!durationMatch && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                    <p className="text-xs text-yellow-800">
                      ⚠️ Actual duration ({generation.actualDurationWeeks} weeks) differs from 
                      planned ({generation.plannedDurationWeeks} weeks)
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Content Breakdown</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">By Module</p>
                  <div className="space-y-1">
                    {Object.entries(generation.contentSummary.byModule).map(([module, count]) => (
                      <div key={module} className="flex justify-between text-sm">
                        <span className="text-gray-600">{module}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">By Difficulty</p>
                  <div className="space-y-1">
                    {Object.entries(generation.contentSummary.byDifficulty).map(([difficulty, count]) => (
                      <div key={difficulty} className="flex justify-between text-sm">
                        <Badge className={getDifficultyColor(difficulty)} variant="outline">
                          {difficulty}
                        </Badge>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">By Content Type</p>
                  <div className="space-y-1">
                    {Object.entries(generation.contentSummary.byType).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Schedule Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Weekly Schedule Preview</h3>
                <Button
                  onClick={handleCreate}
                  disabled={generating || !title.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Path
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-6">
                {Array.from(
                  { length: generation.actualDurationWeeks },
                  (_, i) => i + 1
                ).map((weekNum) => {
                  const weekDays = generation.schedule.filter(
                    (day) => day.weekNumber === weekNum
                  );
                  const weekHours = weekDays.reduce(
                    (sum, day) => sum + day.totalEstimatedHours,
                    0
                  );
                  const weekLessons = weekDays.reduce(
                    (sum, day) => sum + day.lessons.length,
                    0
                  );

                  return (
                    <div key={weekNum} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Week {weekNum}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{weekLessons} lessons</span>
                          <span>~{Math.round(weekHours)}h</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day) => (
                          <div
                            key={`${day.weekNumber}-${day.dayNumber}`}
                            className="bg-gray-50 rounded p-2 text-center"
                          >
                            <div className="text-xs font-medium text-gray-600 mb-1">
                              Day {day.dayNumber}
                            </div>
                            <div className="text-lg font-bold text-indigo-600">
                              {day.lessons.length}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round(day.totalEstimatedHours)}h
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {generation.schedule.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No lessons matched the template criteria
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
