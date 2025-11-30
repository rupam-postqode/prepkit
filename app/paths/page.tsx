"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  difficulty: string;
  targetCompanies: string[];
  _count: {
    pathLessons: number;
    userProgress: number;
  };
  enrolled?: boolean;
  progressId?: string;
}

export default function PathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      const response = await fetch("/api/paths");
      if (response.ok) {
        const data = await response.json();
        setPaths(data);
      } else {
        setError("Failed to load learning paths");
      }
    } catch (error) {
      console.error("Error fetching paths:", error);
      setError("Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (pathId: string, pathTitle: string) => {
    setEnrolling(pathId);
    try {
      const response = await fetch(`/api/paths/${pathId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Successfully enrolled in ${pathTitle}!`);
        router.push(`/dashboard/learning-paths/${pathId}?welcome=true`);
      } else {
        if (data.error.includes("User not found")) {
          alert("Please sign up first before enrolling in a learning path.");
        } else if (data.error.includes("Already enrolled")) {
          alert("You're already enrolled in this path. Check your dashboard to continue.");
        } else {
          alert(data.error || "Failed to enroll in path");
        }
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Failed to enroll in path");
    } finally {
      setEnrolling(null);
    }
  };

  const handleContinue = async (pathId: string) => {
    router.push(`/dashboard/learning-paths/${pathId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
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
          <p className="mt-4 text-gray-600">Loading learning paths...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Paths</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchPaths} className="bg-indigo-600 hover:bg-indigo-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a structured learning path designed to take you from beginner to interview-ready.
            Each path includes carefully sequenced lessons, practice problems, and progress tracking.
          </p>
        </div>

        {/* Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paths.map((path) => (
            <Card key={path.id} className="p-6 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{path.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{path.title}</h3>
                <p className="text-gray-600 mb-4">{path.description}</p>
              </div>

              {/* Path Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">{path.durationWeeks} weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lessons:</span>
                  <span className="font-medium">{path._count.pathLessons}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Students:</span>
                  <span className="font-medium">{path._count.userProgress}</span>
                </div>
              </div>

              {/* Target Companies */}
              {path.targetCompanies && path.targetCompanies.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Prepares for:</div>
                  <div className="flex flex-wrap gap-1">
                    {path.targetCompanies.slice(0, 3).map((company) => (
                      <span
                        key={company}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                      >
                        {company}
                      </span>
                    ))}
                    {path.targetCompanies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{path.targetCompanies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Enroll/Continue Button */}
              {path.enrolled ? (
                <Button
                  onClick={() => handleContinue(path.id)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Continue Learning →
                </Button>
              ) : (
                <Button
                  onClick={() => handleEnroll(path.id, path.title)}
                  disabled={enrolling === path.id}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {enrolling === path.id ? "Enrolling..." : "Start This Path"}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {paths.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Learning Paths Available</h3>
            <p className="text-gray-600">Check back later for new learning paths.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose a Learning Path?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Learning</h3>
              <p className="text-gray-600">
                Follow a proven curriculum designed by industry experts with clear milestones and deadlines.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your advancement with detailed analytics and completion certificates.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Ready</h3>
              <p className="text-gray-600">
                Each path is designed to prepare you for specific company interviews and roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
