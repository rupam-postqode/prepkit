"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle, Circle } from "lucide-react";

interface Module {
  id: string;
  title: string;
  emoji: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

interface LessonNavigationProps {
  currentLessonId: string;
}

export function LessonNavigation({ currentLessonId }: LessonNavigationProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  // Fetch navigation data
  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const response = await fetch("/api/navigation");
        if (!response.ok) throw new Error("Failed to fetch navigation data");
        const data = await response.json();
        setModules(data);

        // Auto-expand current module and chapter
        const currentModule = data.find((module: Module) =>
          module.chapters.some((chapter: Chapter) =>
            chapter.lessons.some((lesson: Lesson) => lesson.id === currentLessonId)
          )
        );

        if (currentModule) {
          setExpandedModules(prev => new Set([...prev, currentModule.id]));

          const currentChapter = currentModule.chapters.find((chapter: Chapter) =>
            chapter.lessons.some((lesson: Lesson) => lesson.id === currentLessonId)
          );

          if (currentChapter) {
            setExpandedChapters(prev => new Set([...prev, currentChapter.id]));
          }
        }
      } catch (error) {
        console.error("Failed to fetch navigation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavigationData();
  }, [currentLessonId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/lessons/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>

        <div className="space-y-2">
          {modules.map((module) => (
            <div key={module.id} className="space-y-1">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                {expandedModules.has(module.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-lg">{module.emoji}</span>
                <span className="font-medium text-gray-900 truncate">{module.title}</span>
              </button>

              {/* Chapters */}
              {expandedModules.has(module.id) && (
                <div className="ml-6 space-y-1">
                  {module.chapters.map((chapter) => (
                    <div key={chapter.id} className="space-y-1">
                      {/* Chapter Header */}
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                      >
                        {expandedChapters.has(chapter.id) ? (
                          <ChevronDown className="w-3 h-3 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-gray-500" />
                        )}
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 truncate">{chapter.title}</span>
                      </button>

                      {/* Lessons */}
                      {expandedChapters.has(chapter.id) && (
                        <div className="ml-6 space-y-1">
                          {chapter.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => navigateToLesson(lesson.id)}
                              className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors text-left ${
                                lesson.id === currentLessonId
                                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <span className="text-sm truncate">{lesson.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
