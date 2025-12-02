'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface TimelinePath {
  id: string;
  title: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  pathType: string;
  intensityLevel: number;
  estimatedHoursPerDay: number;
  enrolled: boolean;
  progressId?: string;
  isCurrentPath?: boolean;
}

interface TimelineRecommendation {
  pathType: string;
  title: string;
  description: string;
  intensity: string;
  hoursPerDay: number;
  totalHours: number;
  topics: string[];
  pros: string[];
  cons: string[];
  recommendedFor: string;
}

interface TimelinePathSelectorProps {
  interviewDate?: string;
  onPathSelect: (pathId: string, interviewDate?: string) => Promise<void>;
  onPathSwitch?: (fromPathId: string, toPathId: string) => Promise<void>;
  currentPathId?: string;
}

export function TimelinePathSelector({
  interviewDate,
  onPathSelect,
  onPathSwitch,
  currentPathId,
}: TimelinePathSelectorProps) {
  const { data: session } = useSession();
  const [paths, setPaths] = useState<TimelinePath[]>([]);
  const [recommendations, setRecommendations] = useState<TimelineRecommendation[]>([]);
  const [recommendedPath, setRecommendedPath] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [switchingPath, setSwitchingPath] = useState<string | null>(null);
  const [selectedInterviewDate, setSelectedInterviewDate] = useState<string>(interviewDate || '');

  useEffect(() => {
    fetchPathsAndRecommendations();
  }, [interviewDate]);

  const fetchPathsAndRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (interviewDate) params.append('interviewDate', interviewDate);
      if (currentPathId) params.append('currentPathId', currentPathId);

      const response = await fetch(`/api/timeline-paths?${params.toString()}`);
      const data = await response.json();

      setPaths(data.paths || []);
      setRecommendations(data.recommendations || []);
      setRecommendedPath(data.recommendedPath || '');
    } catch (error) {
      console.error('Error fetching paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePathEnrollment = async (pathId: string) => {
    if (!session?.user?.id) return;

    try {
      setSwitchingPath(pathId);
      await onPathSelect(pathId, selectedInterviewDate);
      
      // Refresh paths to update enrollment status
      await fetchPathsAndRecommendations();
    } catch (error) {
      console.error('Error enrolling in path:', error);
    } finally {
      setSwitchingPath(null);
    }
  };

  const handlePathSwitch = async (fromPathId: string, toPathId: string) => {
    if (!session?.user?.id || !onPathSwitch) return;

    try {
      setSwitchingPath(toPathId);
      await onPathSwitch(fromPathId, toPathId);
      
      // Refresh paths to update enrollment status
      await fetchPathsAndRecommendations();
    } catch (error) {
      console.error('Error switching paths:', error);
    } finally {
      setSwitchingPath(null);
    }
  };

  const getPathIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'bg-green-100 text-green-800';
    if (intensity <= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPathIntensityLabel = (intensity: number) => {
    if (intensity <= 2) return 'Relaxed';
    if (intensity <= 4) return 'Moderate';
    return 'Intensive';
  };

  const getRecommendationBadgeColor = (recommendedFor: string) => {
    if (recommendedFor.includes('Perfect') || recommendedFor.includes('Best')) {
      return 'bg-green-500 text-white';
    }
    if (recommendedFor.includes('Recommended')) {
      return 'bg-blue-500 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Interview Date Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Interview Date
          </CardTitle>
          <CardDescription>
            Set your target interview date to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="date"
            value={selectedInterviewDate}
            onChange={(e) => setSelectedInterviewDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border rounded-md"
          />
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <Card 
                key={rec.pathType} 
                className={`border-2 ${
                  rec.pathType === recommendedPath ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <Badge className={getRecommendationBadgeColor(rec.recommendedFor)}>
                      {rec.recommendedFor}
                    </Badge>
                  </div>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{rec.hoursPerDay}h/day</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{rec.intensity}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-1">
                        {rec.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-green-600 mb-1">Pros:</h4>
                        <ul className="text-xs space-y-1">
                          {rec.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-1">Cons:</h4>
                        <ul className="text-xs space-y-1">
                          {rec.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Paths */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Learning Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <Card 
              key={path.id}
              className={`relative ${
                path.isCurrentPath ? 'ring-2 ring-blue-500' : ''
              } ${path.enrolled && !path.isCurrentPath ? 'opacity-75' : ''}`}
            >
              {path.isCurrentPath && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-500 text-white">Current</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{path.emoji}</span>
                  {path.title}
                </CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getPathIntensityColor(path.intensityLevel)}>
                      {getPathIntensityLabel(path.intensityLevel)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {path.durationWeeks} weeks
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{path.estimatedHoursPerDay} hours per day</span>
                  </div>

                  <div className="space-y-2">
                    {path.enrolled && !path.isCurrentPath && (
                      <p className="text-sm text-gray-600">
                        You are enrolled in this path
                      </p>
                    )}
                    
                    {path.isCurrentPath ? (
                      <Button 
                        variant="outline" 
                        disabled
                        className="w-full"
                      >
                        Currently Active
                      </Button>
                    ) : path.enrolled ? (
                      <Button 
                        variant="default" 
                        onClick={() => handlePathSwitch(currentPathId!, path.id)}
                        disabled={switchingPath === path.id}
                        className="w-full"
                      >
                        {switchingPath === path.id ? 'Switching...' : 'Switch to This Path'}
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        onClick={() => handlePathEnrollment(path.id)}
                        disabled={switchingPath === path.id}
                        className="w-full"
                      >
                        {switchingPath === path.id ? 'Enrolling...' : 'Enroll in Path'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}