"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Clock, Users, BookOpen, Star, TrendingUp } from "lucide-react";
import { useNavigation } from "@/components/providers/navigation-provider";
import { useToast } from "@/components/ui/toast";
import { useLoading } from "@/components/providers/loading-provider";

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
  averageRating?: number;
  completionRate?: number;
}

export default function PathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([]);
  const [loading, setLocalLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setBreadcrumbs, setCurrentPage } = useNavigation();
  const { setLoading: setGlobalLoading } = useLoading();
  const { toast } = useToast();
  const isChangingPath = searchParams?.get('change') === 'true';

  const DIFFICULTY_OPTIONS = ["all", "BEGINNER", "EASY", "MEDIUM", "HARD"];
  const DURATION_OPTIONS = [
    { value: "all", label: "All Durations" },
    { value: "1-4", label: "1-4 weeks" },
    { value: "5-8", label: "5-8 weeks" },
    { value: "9-12", label: "9-12 weeks" },
    { value: "12+", label: "12+ weeks" },
  ];
  const COMPANY_OPTIONS = [
    "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix",
    "Tesla", "Uber", "Airbnb", "Spotify", "Adobe", "Salesforce"
  ];

  useEffect(() => {
    fetchPaths();
  }, []);

  useEffect(() => {
    filterPaths();
  }, [paths, searchTerm, selectedDifficulty, selectedDuration, selectedCompanies]);

  // Update breadcrumbs when component mounts
  useEffect(() => {
    const pageTitle = isChangingPath ? 'Switch Learning Path' : 'Learning Paths';
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: pageTitle, isActive: true }
    ]);
    setCurrentPage(pageTitle);
  }, [isChangingPath, setBreadcrumbs, setCurrentPage]);

  const filterPaths = () => {
    let filtered = [...paths];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(path =>
        path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        path.targetCompanies.some(company =>
          company.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(path => path.difficulty === selectedDifficulty);
    }

    // Duration filter
    if (selectedDuration !== "all") {
      const [min, max] = selectedDuration.split('-').map(d => d === '+' ? 999 : parseInt(d));
      filtered = filtered.filter(path => {
        if (max === 999) return path.durationWeeks >= min;
        return path.durationWeeks >= min && path.durationWeeks <= max;
      });
    }

    // Company filter
    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(path =>
        selectedCompanies.some(company => path.targetCompanies.includes(company))
      );
    }

    setFilteredPaths(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty("all");
    setSelectedDuration("all");
    setSelectedCompanies([]);
  };

  const fetchPaths = async () => {
    setGlobalLoading(true, "Loading learning paths...");
    
    try {
      const response = await fetch("/api/paths");
      if (response.ok) {
        const data = await response.json();
        // Add mock rating and completion data for demonstration
        const enrichedData = data.map((path: LearningPath) => ({
          ...path,
          averageRating: Math.random() * 2 + 3, // 3-5 stars
          completionRate: Math.floor(Math.random() * 40 + 60), // 60-100%
        }));
        setPaths(enrichedData);
      } else {
        setError("Failed to load learning paths");
      }
    } catch (error) {
      console.error("Error fetching paths:", error);
      setError("Failed to load learning paths");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEnroll = async (pathId: string, pathTitle: string) => {
    setEnrolling(pathId);
    setGlobalLoading(true, `Enrolling in ${pathTitle}...`);
    
    try {
      const response = await fetch(`/api/paths/${pathId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        const action = isChangingPath ? 'switched to' : 'enrolled in';
        toast({
          title: "Success!",
          description: `Successfully ${action} ${pathTitle}!`,
          variant: "success",
        });
        router.push(`/dashboard/learning-paths/${pathId}?welcome=true`);
      } else {
        setGlobalLoading(false);
        
        if (data.error.includes("User not found")) {
          toast({
            title: "Authentication Required",
            description: "Please sign up first before enrolling in a learning path.",
            variant: "error",
          });
        } else if (data.error.includes("Already enrolled")) {
          if (isChangingPath) {
            toast({
              title: "Already Enrolled",
              description: "You're already enrolled in this path. Choose a different path to switch to.",
              variant: "warning",
            });
          } else {
            toast({
              title: "Already Enrolled",
              description: "You're already enrolled in this path. Check your dashboard to continue.",
              variant: "info",
            });
          }
        } else {
          toast({
            title: "Enrollment Failed",
            description: data.error || "Failed to enroll in path",
            variant: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      setLocalLoading(false);
      toast({
        title: "Error",
        description: "Failed to enroll in path. Please try again.",
        variant: "error",
      });
    } finally {
      setEnrolling(null);
      setLocalLoading(false);
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
            {isChangingPath ? 'Switch Your Learning Path' : 'Choose Your Learning Path'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isChangingPath 
              ? 'Select a new learning path to continue your interview preparation journey. Your current progress will be saved, and you can always switch back.'
              : 'Select a structured learning path designed to take you from beginner to interview-ready. Each path includes carefully sequenced lessons, practice problems, and progress tracking.'
            }
          </p>
          {isChangingPath && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Switching paths will replace your current active path. Your progress in the previous path will be saved and can be resumed later.
              </p>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search paths by title, description, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(selectedDifficulty !== "all" || selectedDuration !== "all" || selectedCompanies.length > 0) && (
                  <Badge variant="secondary" className="ml-1">
                    {[
                      selectedDifficulty !== "all" ? 1 : 0,
                      selectedDuration !== "all" ? 1 : 0,
                      selectedCompanies.length > 0 ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
              
              {(searchTerm || selectedDifficulty !== "all" || selectedDuration !== "all" || selectedCompanies.length > 0) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_OPTIONS.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty === "all" ? "All Levels" : difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Companies
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {COMPANY_OPTIONS.map((company) => (
                      <div key={company} className="flex items-center space-x-2">
                        <Checkbox
                          id={company}
                          checked={selectedCompanies.includes(company)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCompanies(prev => [...prev, company]);
                            } else {
                              setSelectedCompanies(prev => prev.filter(c => c !== company));
                            }
                          }}
                        />
                        <label htmlFor={company} className="text-sm">
                          {company}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Results Summary */}
        {filteredPaths.length !== paths.length && (
          <div className="mb-6 text-sm text-gray-600">
            Showing {filteredPaths.length} of {paths.length} paths
          </div>
        )}

        {/* Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPaths.map((path) => (
            <Card key={path.id} className="p-6 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{path.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{path.title}</h3>
                <p className="text-gray-600 mb-4">{path.description}</p>
              </div>

              {/* Enhanced Path Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {path.durationWeeks} weeks
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lessons:</span>
                  <span className="font-medium flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {path._count.pathLessons}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Students:</span>
                  <span className="font-medium flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {path._count.userProgress}
                  </span>
                </div>
                {path.averageRating && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <span className="font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                      {path.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
                {path.completionRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion:</span>
                    <span className="font-medium flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                      {path.completionRate}%
                    </span>
                  </div>
                )}
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
                  {enrolling === path.id ? "Switching..." : isChangingPath ? "Switch to This Path" : "Start This Path"}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {filteredPaths.length === 0 && (
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
