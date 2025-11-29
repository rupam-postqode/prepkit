"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
}

export default function OnboardingPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user already has a path
    checkExistingPath();
  }, [session, status, router]);

  const checkExistingPath = async () => {
    try {
      const response = await fetch("/api/user/path-progress");
      if (response.ok) {
        const data = await response.json();
        if (data.enrolled) {
          // User already has a path, redirect to dashboard
          router.push("/dashboard");
          return;
        }
      }
    } catch (error) {
      console.error("Error checking existing path:", error);
    }

    // User doesn't have a path, load available paths
    fetchPaths();
  };

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

  const handleEnroll = async (pathId: string) => {
    setEnrolling(true);
    try {
      const response = await fetch(`/api/paths/${pathId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to dashboard to start learning
        router.push("/dashboard?welcome=true");
      } else {
        alert(data.error || "Failed to enroll in path");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Failed to enroll in path");
    } finally {
      setEnrolling(false);
    }
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up your learning experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
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
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to PrepKit, {session?.user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You're about to start an amazing journey to land your dream job.
            Let's choose the perfect learning path for your interview preparation.
          </p>
        </div>

        {/* What is a Learning Path */}
        <Card className="p-6 mb-8 bg-indigo-50 border-indigo-200">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">📚</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What is a Learning Path?
              </h3>
              <p className="text-gray-700">
                A learning path is your personalized roadmap to interview success. It includes carefully sequenced lessons,
                practice problems, and milestones designed to take you from beginner to interview-ready in a structured way.
              </p>
            </div>
          </div>
        </Card>

        {/* Path Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Learning Path
          </h2>

          {paths.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🚀</div>
              <p className="text-gray-600">Learning paths are being prepared. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paths.map((path) => (
                <Card
                  key={path.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedPath === path.id
                      ? 'ring-2 ring-indigo-500 bg-indigo-50'
                      : 'hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedPath(path.id)}
                >
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{path.emoji}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{path.description}</p>
                  </div>

                  {/* Path Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{path.durationWeeks} weeks</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(path.difficulty)}`}>
                        {path.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Lessons:</span>
                      <span className="font-medium">{path._count.pathLessons}</span>
                    </div>
                  </div>

                  {/* Target Companies */}
                  {path.targetCompanies && path.targetCompanies.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Prepares for:</div>
                      <div className="flex flex-wrap gap-1 justify-center">
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

                  {/* Selection Indicator */}
                  {selectedPath === path.id && (
                    <div className="text-center">
                      <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                        <span className="mr-1">✓</span>
                        Selected
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          {selectedPath ? (
            <div className="space-y-4">
              <Button
                onClick={() => handleEnroll(selectedPath)}
                disabled={enrolling}
                size="lg"
                className="text-lg px-8 py-3"
              >
                {enrolling ? "Starting Your Journey..." : "Start My Learning Path →"}
              </Button>
              <p className="text-sm text-gray-600">
                Don't worry, you can change paths later if needed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Select a learning path above to get started</p>
              <div className="flex justify-center space-x-4">
                <Link href="/paths">
                  <Button variant="outline" size="sm">
                    View All Paths
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Skip for Now
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Why Choose PrepKit */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Why PrepKit?
            </h3>
            <p className="text-gray-700">
              Join thousands of developers who have transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-2">Structured Learning</h4>
              <p className="text-sm text-gray-600">
                Follow proven paths designed by industry experts
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
              <p className="text-sm text-gray-600">
                Monitor your improvement with detailed analytics
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h4 className="font-semibold text-gray-900 mb-2">Interview Ready</h4>
              <p className="text-sm text-gray-600">
                Master the skills that matter for top tech companies
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
