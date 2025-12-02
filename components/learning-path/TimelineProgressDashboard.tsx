'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Flame,
  Award,
  BookOpen,
  Play
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface TimelineMetrics {
  totalDays: number;
  daysElapsed: number;
  daysRemaining: number;
  progressPercentage: number;
  expectedProgress: number;
  isOnTrack: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  completionProbability: number;
  bufferDays: number;
  studyStreak: number;
  longestStreak: number;
  paceStatus: 'ON_TRACK' | 'BEHIND_SCHEDULE' | 'AHEAD_OF_SCHEDULE';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  emoji: string;
  targetDate: string;
  bufferDays: number;
  isCritical: boolean;
  isCompleted: boolean;
}

interface StudySession {
  id: string;
  startTime: string;
  endTime: string;
  timeSpent: number;
  effectiveness: number;
  focusScore: number;
  comprehensionScore: number;
}

interface SessionData {
  startTime: string;
  endTime: string;
  timeSpent: number;
  effectiveness: number;
  focusScore: number;
  comprehensionScore: number;
}

interface TimelineProgressDashboardProps {
  pathId: string;
  onSessionStart?: () => void;
  onSessionEnd?: (sessionData: SessionData) => void;
}

export function TimelineProgressDashboard({
  pathId,
  onSessionStart,
  onSessionEnd,
}: TimelineProgressDashboardProps) {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<TimelineMetrics | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStudying, setIsStudying] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (pathId) {
      fetchProgressData();
    }
  }, [pathId]);

  useEffect(() => {
    // Set up real-time updates
    if (!session?.user?.id) return;

    const eventSource = new EventSource(`/api/realtime-sync?userId=${session.user.id}`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PROGRESS_UPDATE' && data.pathId === pathId) {
          fetchProgressData(); // Refresh data on progress updates
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [session?.user?.id, pathId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/timeline-progress/${pathId}`);
      const data = await response.json();

      setMetrics(data.timelineMetrics);
      setMilestones(data.upcomingMilestones || []);
      setRecentSessions(data.recentSessions || []);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = () => {
    setIsStudying(true);
    setSessionStartTime(new Date());
    onSessionStart?.();
  };

  const handleEndSession = async () => {
    if (!sessionStartTime) return;

    const endTime = new Date();
    const sessionData = {
      startTime: sessionStartTime.toISOString(),
      endTime: endTime.toISOString(),
      timeSpent: Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 1000 / 60), // minutes
      // In a real implementation, you'd collect this data from the user
      effectiveness: 85,
      focusScore: 90,
      comprehensionScore: 80,
    };

    setIsStudying(false);
    setSessionStartTime(null);
    onSessionEnd?.(sessionData);

    // Save session to backend
    try {
      await fetch(`/api/timeline-progress/${pathId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_study_session',
          data: sessionData,
        }),
      });
    } catch (error) {
      console.error('Error saving study session:', error);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaceStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK': return 'text-green-600';
      case 'BEHIND_SCHEDULE': return 'text-red-600';
      case 'AHEAD_OF_SCHEDULE': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">No progress data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.progressPercentage}%</div>
            <Progress value={metrics.progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.daysRemaining}</div>
            <p className="text-xs text-muted-foreground">days left</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.studyStreak}</div>
            <p className="text-xs text-muted-foreground">
              Best: {metrics.longestStreak} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getRiskLevelColor(metrics.riskLevel)}>
              {metrics.riskLevel}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.completionProbability}% completion probability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline Overview
          </CardTitle>
          <CardDescription>
            Your learning journey at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.totalDays}</div>
                <p className="text-sm text-gray-600">Total Days</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.daysElapsed}</div>
                <p className="text-sm text-gray-600">Days Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{metrics.daysRemaining}</div>
                <p className="text-sm text-gray-600">Days Remaining</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Progress</span>
                <span className="text-sm font-medium">{metrics.progressPercentage}%</span>
              </div>
              <Progress value={metrics.progressPercentage} />

              <div className="flex justify-between items-center">
                <span className="text-sm">Expected Progress</span>
                <span className="text-sm font-medium">{metrics.expectedProgress}%</span>
              </div>
              <Progress value={metrics.expectedProgress} className="opacity-50" />

              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className={`h-4 w-4 ${getPaceStatusColor(metrics.paceStatus)}`} />
                <span className={`font-medium ${getPaceStatusColor(metrics.paceStatus)}`}>
                  {metrics.paceStatus.replace('_', ' ')}
                </span>
                {metrics.bufferDays > 0 && (
                  <span className="text-green-600">
                    ({metrics.bufferDays} buffer days)
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Session
          </CardTitle>
          <CardDescription>
            Track your study time and maintain consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {!isStudying ? (
              <Button onClick={handleStartSession} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Study Session
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button onClick={handleEndSession} variant="destructive">
                  End Session
                </Button>
                <div className="text-sm text-gray-600">
                  Session started: {sessionStartTime?.toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      {milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Upcoming Milestones
            </CardTitle>
            <CardDescription>
              Important goals on your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    milestone.isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : milestone.isCritical 
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{milestone.emoji}</span>
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                      <p className="text-xs text-gray-500">
                        Target: {new Date(milestone.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {milestone.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : milestone.isCritical ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Study Sessions */}
      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Study Sessions
            </CardTitle>
            <CardDescription>
              Your latest learning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.floor(session.timeSpent)} minutes • {session.effectiveness}% effective
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.effectiveness > 80 ? 'default' : 'secondary'}>
                      {session.effectiveness > 80 ? 'Great' : 'Good'}
                    </Badge>
                    <Badge variant={session.focusScore > 80 ? 'default' : 'secondary'}>
                      Focus: {session.focusScore}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}