"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  Calendar, 
  GripVertical, 
  Plus,
  Trash2,
  Eye
} from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  chapter: {
    title: string;
    module: {
      title: string;
    };
  };
  estimatedMinutes: number;
}

interface PathLesson {
  id: string;
  lessonId: string;
  weekNumber: number;
  dayNumber: number;
  orderIndex: number;
  isRequired: boolean;
  estimatedHours: number;
  lesson: Lesson;
}

interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  difficulty: string;
  targetCompanies: string[];
}

export default function SchedulePathPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pathData, setPathData] = useState<LearningPath | null>(null);
  const [pathLessons, setPathLessons] = useState<PathLesson[]>([]);
  const [draggedLesson, setDraggedLesson] = useState<PathLesson | null>(null);

  useEffect(() => {
    if (params.pathId) {
      fetchPathData();
    }
  }, [params.pathId]);

  const fetchPathData = async () => {
    try {
      const response = await fetch(`/api/admin/learning-paths/${params.pathId}`);
      if (response.ok) {
        const data = await response.json();
        setPathData(data.path);
        setPathLessons(data.pathLessons);
      } else {
        console.error("Failed to fetch path data");
      }
    } catch (error) {
      console.error("Error fetching path data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (lesson: PathLesson) => {
    setDraggedLesson(lesson);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetWeek: number, targetDay: number) => {
    e.preventDefault();
    if (!draggedLesson) return;

    const updatedLessons = pathLessons.map(lesson => {
      if (lesson.id === draggedLesson.id) {
        return {
          ...lesson,
          weekNumber: targetWeek,
          dayNumber: targetDay,
        };
      }
      return lesson;
    });

    setPathLessons(updatedLessons);
    setDraggedLesson(null);
  };

  const handleEstimatedHoursChange = (lessonId: string, hours: number) => {
    setPathLessons(prev => prev.map(lesson => 
      lesson.lessonId === lessonId 
        ? { ...lesson, estimatedHours: hours }
        : lesson
    ));
  };

  const handleRemoveLesson = (lessonId: string) => {
    setPathLessons(prev => prev.filter(lesson => lesson.lessonId !== lessonId));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/learning-paths/${params.pathId}/schedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pathLessons }),
      });

      if (response.ok) {
        router.push(`/admin/learning-paths/${params.pathId}`);
      } else {
        alert("Failed to save schedule");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const getLessonsForWeekAndDay = (week: number, day: number) => {
    return pathLessons
      .filter(lesson => lesson.weekNumber === week && lesson.dayNumber === day)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const getTotalHoursForWeek = (week: number) => {
    return pathLessons
      .filter(lesson => lesson.weekNumber === week)
      .reduce((total, lesson) => total + lesson.estimatedHours, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading path schedule...</p>
        </div>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Path Not Found</h1>
          <Button onClick={() => router.push("/admin/learning-paths")}>
            Back to Learning Paths
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/learning-paths">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">{pathData.emoji}</span>
                {pathData.title}
              </h1>
              <p className="text-gray-600">Schedule lessons across {pathData.durationWeeks} weeks</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link href={`/dashboard/learning-paths/${pathData.id}`}>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="space-y-6">
          {Array.from({ length: pathData.durationWeeks }, (_, weekIndex) => {
            const weekNumber = weekIndex + 1;
            const weekHours = getTotalHoursForWeek(weekNumber);

            return (
              <Card key={weekNumber} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Week {weekNumber}</h3>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {weekHours.toFixed(1)} hours
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }, (_, dayIndex) => {
                    const dayNumber = dayIndex + 1;
                    const dayLessons = getLessonsForWeekAndDay(weekNumber, dayNumber);

                    return (
                      <div
                        key={dayNumber}
                        className="border-2 border-dashed border-gray-200 rounded-lg p-3 min-h-[200px]"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, weekNumber, dayNumber)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium">Day {dayNumber}</Label>
                          {dayLessons.length === 0 && (
                            <Plus className="w-4 h-4 text-gray-400" />
                          )}
                        </div>

                        <div className="space-y-2">
                          {dayLessons.map((pathLesson) => (
                            <div
                              key={pathLesson.id}
                              draggable
                              onDragStart={() => handleDragStart(pathLesson)}
                              className="bg-white border border-gray-200 rounded p-2 cursor-move hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {pathLesson.lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {pathLesson.lesson.chapter.module.title}
                                  </p>
                                </div>
                                <GripVertical className="w-3 h-3 text-gray-400 flex-shrink-0 ml-1" />
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <Input
                                  type="number"
                                  step="0.5"
                                  min="0.5"
                                  max="8"
                                  value={pathLesson.estimatedHours}
                                  onChange={(e) => handleEstimatedHoursChange(
                                    pathLesson.lessonId, 
                                    parseFloat(e.target.value) || 1
                                  )}
                                  className="w-16 h-6 text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="text-xs text-gray-500">hours</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveLesson(pathLesson.lessonId)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Unassigned Lessons */}
        {pathLessons.filter(lesson => !lesson.weekNumber || !lesson.dayNumber).length > 0 && (
          <Card className="p-6 border-yellow-200 bg-yellow-50">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">
              Unassigned Lessons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pathLessons
                .filter(lesson => !lesson.weekNumber || !lesson.dayNumber)
                .map((pathLesson) => (
                  <div
                    key={pathLesson.id}
                    draggable
                    onDragStart={() => handleDragStart(pathLesson)}
                    className="bg-white border border-yellow-300 rounded p-3 cursor-move"
                  >
                    <p className="font-medium text-sm">{pathLesson.lesson.title}</p>
                    <p className="text-xs text-gray-500">
                      {pathLesson.lesson.chapter.module.title}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}