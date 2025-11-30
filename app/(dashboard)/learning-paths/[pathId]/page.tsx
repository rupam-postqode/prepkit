"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Target, Award, BookOpen, Users, TrendingUp, Pause, Play, RotateCcw, Settings, RotateCcw as ResetIcon } from "lucide-react";
import { ResetDialog } from "@/components/ui/reset-dialog";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  difficulty: string;
  targetCompanies: string[];
  pathLessons: PathLesson[];
}

interface PathLesson {
  id: string;
  weekNumber: number;
  dayNumber: number;
  orderIndex: number;
  isRequired: boolean;
  estimatedHours: number;
  lesson: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    chapter: {
      module: {
        title: string;
        slug: string;
      };
    };
    progress?: {
      completedAt?: string;
      timeSpentSeconds: number;
    };
  };
}

interface UserProgress {
  currentWeek: number;
  currentDay: number;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  startedAt: string;
  lastActivityAt: string;
  studyStreak: number;
  totalStudyTime: number;
  weeklyGoal?: number;
  isActive?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt: string;
  category: string;
}

interface StudySession {
  date: string;
  lessonsCompleted: number;
  timeSpentMinutes: number;
  focusAreas: string[];
}

export default function LearningPathPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pathData, setPathData] = useState<LearningPath | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (params.pathId) {
      fetchPathData();
    }
  }, [params.pathId]);

  // Check for welcome parameter and show success message
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const welcome = urlParams.get('welcome');
      if (welcome === 'true' && pathData) {
        // Show success message (you could use a toast notification here)
        setTimeout(() => {
          const message = `🎉 Successfully enrolled in ${pathData.title}! Get started with your first lesson below.`;
          // You could replace this with a proper toast notification
          console.log(message);
        }, 100);
      }
    }
  }, [pathData]);

  const fetchPathData = async () => {
    try {
      const [pathResponse, progressResponse, achievementsResponse, sessionsResponse] = await Promise.all([
        fetch(`/api/paths/${params.pathId}`),
        fetch(`/api/user/path-progress/${params.pathId}`),
        fetch(`/api/user/achievements`),
        fetch(`/api/user/study-sessions`)
      ]);

      if (pathResponse.ok) {
        const pathData = await pathResponse.json();
        setPathData(pathData);
      } else {
        const errorData = await pathResponse.json();
        setError(errorData.error || "Failed to load learning path");
        return;
      }

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setUserProgress(progressData);
      }

      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData.achievements || []);
      }

      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setStudySessions(sessionsData.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching path data:", error);
      setError("Failed to load learning path data");
    } finally {
      setLoading(false);
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
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWeekProgress = (weekNumber: number) => {
    if (!pathData) return 0;
    const weekLessons = pathData.pathLessons.filter(pl => pl.weekNumber === weekNumber);
    const completedLessons = weekLessons.filter(pl => pl.lesson.progress?.completedAt).length;
    return weekLessons.length > 0 ? (completedLessons / weekLessons.length) * 100 : 0;
  };

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const isLessonCompleted = (lesson: PathLesson) => {
    return lesson.lesson.progress?.completedAt !== undefined;
  };

  const isCurrentLesson = (lesson: PathLesson) => {
    if (!userProgress) return false;
    return lesson.weekNumber === userProgress.currentWeek && 
           lesson.dayNumber === userProgress.currentDay &&
           !isLessonCompleted(lesson);
  };

  const handlePathAction = async (action: string, data?: unknown) => {
    if (!params.pathId) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/paths/${params.pathId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data }),
      });

      if (response.ok) {
        // Refresh the data to show updated state
        await fetchPathData();
      } else {
        const errorData = await response.json();
        console.error('Path action failed:', errorData.error);
      }
    } catch (error) {
      console.error('Error performing path action:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePath = () => {
    router.push('/paths?change=true');
  };

  const handleReset = async (type: "path" | "week", weekNumber?: number) => {
    if (!params.pathId) return;
    
    setIsResetting(true);
    try {
      const response = await fetch(`/api/paths/${params.pathId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: type === "path" ? "RESET_PATH" : "RESET_WEEK",
          data: type === "week" ? { weekNumber } : undefined
        }),
      });

      if (response.ok) {
        // Refresh data to show updated state
        await fetchPathData();
      } else {
        const errorData = await response.json();
        console.error('Reset failed:', errorData.error);
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (error || !pathData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Path</h1>
          <p className="text-gray-600 mb-6">{error || "Learning path not found"}</p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/paths')} className="bg-indigo-600 hover:bg-indigo-700 mr-4">
              Browse All Paths
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{pathData.emoji}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{pathData.title}</h1>
                <p className="text-gray-600 mt-1">{pathData.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Path Management Controls */}
              {userProgress?.isActive ? (
                <Button
                  onClick={() => handlePathAction('PAUSE_PATH')}
                  variant="outline"
                  disabled={isUpdating}
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Pausing...' : 'Pause Path'}
                </Button>
              ) : (
                <Button
                  onClick={() => handlePathAction('RESUME_PATH')}
                  variant="outline"
                  disabled={isUpdating}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Resuming...' : 'Resume Path'}
                </Button>
              )}
              
              <Button
                onClick={() => handlePathAction('UPDATE_WEEK_DAY', { 
                  weekNumber: userProgress?.currentWeek || 1, 
                  dayNumber: Math.min((userProgress?.currentDay || 1) + 1, 7) 
                })}
                variant="outline"
                disabled={isUpdating}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Next Day
              </Button>
              
              <Button
                onClick={handleChangePath}
                variant="outline"
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Change Path
              </Button>
              
              <ResetDialog
                pathTitle={pathData.title}
                currentWeek={userProgress?.currentWeek}
                onReset={handleReset}
                isResetting={isResetting}
              >
                <Button
                  variant="outline"
                  disabled={isResetting}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <ResetIcon className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              </ResetDialog>
              
              <Button onClick={() => router.push("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-indigo-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-lg font-semibold">{userProgress?.progressPercentage || 0}%</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Current Week</p>
                  <p className="text-lg font-semibold">{userProgress?.currentWeek || 1}/{pathData.durationWeeks}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Study Time</p>
                  <p className="text-lg font-semibold">{formatStudyTime(userProgress?.totalStudyTime || 0)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Achievements</p>
                  <p className="text-lg font-semibold">{achievements.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Overall Progress Bar */}
          {userProgress && (
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Overall Progress</h3>
                <span className="text-sm text-gray-600">
                  {userProgress.completedLessons} of {userProgress.totalLessons} lessons completed
                </span>
              </div>
              <Progress value={userProgress.progressPercentage} className="h-3" />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  Started {new Date(userProgress.startedAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  Last activity {new Date(userProgress.lastActivityAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Path Details */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Path Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{pathData.durationWeeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <Badge className={getDifficultyColor(pathData.difficulty)}>
                      {pathData.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Lessons:</span>
                    <span className="font-medium">{pathData.pathLessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Study Streak:</span>
                    <span className="font-medium">{userProgress?.studyStreak || 0} days</span>
                  </div>
                </div>

                {pathData.targetCompanies && pathData.targetCompanies.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Target Companies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pathData.targetCompanies.map((company) => (
                        <Badge key={company} variant="outline">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Current Week Focus */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Current Focus</h3>
                {userProgress && (
                  <div>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Week {userProgress.currentWeek} Progress</h4>
                      <Progress value={getWeekProgress(userProgress.currentWeek)} className="h-2" />
                      <p className="text-sm text-gray-600 mt-1">
                        {Math.round(getWeekProgress(userProgress.currentWeek))}% complete
                      </p>
                    </div>

                    {/* Current Lessons */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Current Lessons</h4>
                      <div className="space-y-2">
                        {pathData.pathLessons
                          .filter(lesson => lesson.weekNumber === userProgress.currentWeek)
                          .slice(0, 3)
                          .map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`p-3 rounded-lg border ${
                                isCurrentLesson(lesson)
                                  ? "border-indigo-200 bg-indigo-50"
                                  : isLessonCompleted(lesson)
                                  ? "border-green-200 bg-green-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{lesson.lesson.title}</p>
                                  <p className="text-xs text-gray-600">{lesson.lesson.chapter.module.title}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {isLessonCompleted(lesson) && (
                                    <span className="text-green-600 text-xs">✓</span>
                                  )}
                                  {isCurrentLesson(lesson) && (
                                    <Badge variant="secondary" className="text-xs">Current</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Learning Timeline</h3>
              <div className="space-y-6">
                {Array.from({ length: pathData.durationWeeks }, (_, weekIndex) => {
                  const weekNumber = weekIndex + 1;
                  const weekLessons = pathData.pathLessons.filter(pl => pl.weekNumber === weekNumber);
                  const weekProgress = getWeekProgress(weekNumber);
                  const isCurrentWeek = userProgress?.currentWeek === weekNumber;

                  return (
                    <div key={weekNumber} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            weekProgress === 100
                              ? "bg-green-500 text-white"
                              : isCurrentWeek
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}>
                            {weekProgress === 100 ? "✓" : weekNumber}
                          </div>
                          <div>
                            <h4 className="font-semibold">Week {weekNumber}</h4>
                            <p className="text-sm text-gray-600">
                              {weekLessons.length} lessons • {weekProgress.toFixed(0)}% complete
                            </p>
                          </div>
                        </div>
                        {isCurrentWeek && (
                          <Badge variant="secondary">Current Week</Badge>
                        )}
                      </div>
                      
                      <Progress value={weekProgress} className="h-2 mb-3" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {weekLessons
                          .sort((a, b) => a.dayNumber - b.dayNumber || a.orderIndex - b.orderIndex)
                          .map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                isLessonCompleted(lesson)
                                  ? "border-green-200 bg-green-50 hover:bg-green-100"
                                  : isCurrentLesson(lesson)
                                  ? "border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                              onClick={() => router.push(`/lessons/${lesson.lesson.id}`)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{lesson.lesson.title}</p>
                                  <p className="text-xs text-gray-600">
                                    Day {lesson.dayNumber} • {lesson.estimatedHours}h
                                  </p>
                                </div>
                                {isLessonCompleted(lesson) && (
                                  <span className="text-green-600 text-sm">✓</span>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {lesson.lesson.chapter.module.title}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Study Activity */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Study Activity</h3>
                {studySessions.length > 0 ? (
                  <div className="space-y-3">
                    {studySessions.slice(0, 7).map((session, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium text-sm">{new Date(session.date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-600">{session.lessonsCompleted} lessons</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{session.timeSpentMinutes}m</p>
                          <p className="text-xs text-gray-600">study time</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No study sessions yet</p>
                )}
              </Card>

              {/* Performance Insights */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="font-medium">Learning Velocity</p>
                      <p className="text-sm text-gray-600">
                        {userProgress ? 
                          (userProgress.completedLessons / Math.max(1, Math.ceil((new Date().getTime() - new Date(userProgress.startedAt).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1)
                          : 0} lessons/day
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="font-medium">Knowledge Retention</p>
                      <p className="text-sm text-gray-600">Good (85% average score)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <p className="font-medium">Peer Comparison</p>
                      <p className="text-sm text-gray-600">Above average progress</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Your Achievements</h3>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 border rounded-lg text-center">
                      <div className="text-3xl mb-2">{achievement.emoji}</div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <Badge variant="outline">{achievement.category}</Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-600">Keep learning to unlock your first achievement!</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
