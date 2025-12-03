'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Zap,
  ArrowRight,
  CheckCircle,
  Play,
  Briefcase,
  Video
} from 'lucide-react';

interface DashboardData {
  learningPath: {
    current: string | null;
    progress: number;
    totalLessons: number;
    completedLessons: number;
  };
  recentActivity: {
    lessonsCompleted: number;
    timeSpent: number;
    lastActive: string | null;
  };
  mockInterviews: {
    total: number;
    averageScore: number;
    lastInterview: string | null;
  };
  upcomingGoals: Array<{
    title: string;
    description: string;
    progress: number;
    dueDate: string | null;
  }>;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    action: string;
    url: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Keep up the momentum! Here's your interview prep progress.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
                <p className="text-2xl font-bold">
                  {data?.learningPath.completedLessons || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Path Progress</p>
                <p className="text-2xl font-bold">
                  {data?.learningPath.progress || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Award className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Mock Score</p>
                <p className="text-2xl font-bold">
                  {data?.mockInterviews.averageScore || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Invested</p>
                <p className="text-2xl font-bold">
                  {formatTime(data?.recentActivity.timeSpent || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Current Learning Path */}
          {data?.learningPath.current ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Learning Path</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => router.push('/paths')}>
                    Change Path
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{data.learningPath.current}</span>
                    <span className="text-sm text-muted-foreground">
                      {data.learningPath.completedLessons} / {data.learningPath.totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={data.learningPath.progress} className="h-3" />
                </div>
                <Button className="w-full" onClick={() => router.push('/lessons')}>
                  Continue Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Choose a learning path to start your interview prep journey!</span>
                  <Button size="sm" onClick={() => router.push('/paths')}>
                    Select Path
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump right into your preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/lessons')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Watch Lessons</p>
                      <p className="text-xs text-muted-foreground">Continue learning</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/mock-interview/setup')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Play className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Mock Interview</p>
                      <p className="text-xs text-muted-foreground">Practice with AI</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/jobs')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Briefcase className="h-5 w-5 text-warning" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Browse Jobs</p>
                      <p className="text-xs text-muted-foreground">Find opportunities</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => router.push('/paths')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Learning Paths</p>
                      <p className="text-xs text-muted-foreground">View roadmaps</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {data?.recommendations && data.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>Personalized suggestions based on your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <Button size="sm" onClick={() => router.push(rec.url)}>
                      {rec.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.upcomingGoals && data.upcomingGoals.length > 0 ? (
                data.upcomingGoals.map((goal, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{goal.title}</p>
                      <Badge variant="outline">{goal.progress}%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No goals set yet. Select a learning path to get started!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Mock Interview Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Mock Interview Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Interviews</span>
                <span className="font-bold">{data?.mockInterviews.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <span className="font-bold">{data?.mockInterviews.averageScore || 0}%</span>
              </div>
              {data?.mockInterviews.lastInterview && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Interview</span>
                  <span className="text-xs">{new Date(data.mockInterviews.lastInterview).toLocaleDateString()}</span>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/mock-interview/history')}
              >
                View History
              </Button>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Lessons Completed</span>
                <Badge variant="secondary">{data?.recentActivity.lessonsCompleted || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Time Invested</span>
                <Badge variant="secondary">
                  {formatTime(data?.recentActivity.timeSpent || 0)}
                </Badge>
              </div>
              {data?.recentActivity.lastActive && (
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Last active: {new Date(data.recentActivity.lastActive).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Motivational Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <Zap className="h-12 w-12 text-primary mx-auto mb-3" />
              <p className="font-medium mb-2">Keep Going!</p>
              <p className="text-sm text-muted-foreground">
                You're making great progress. Consistency is key to cracking interviews!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
