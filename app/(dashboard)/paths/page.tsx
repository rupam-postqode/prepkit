'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Trophy,
  Building2,
  Loader2
} from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  totalLessons: number;
  estimatedHours: number;
  modules: Array<{
    name: string;
    lessons: number;
    duration: string;
  }>;
  targetAudience: string;
  outcomes: string[];
  companies?: string[];
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'express-4-week',
    title: '4-Week Express Path',
    description: 'Quick refresher for experienced engineers with interview coming up soon. Focus on high-frequency patterns and company-specific questions.',
    duration: '4 weeks',
    difficulty: 'Intermediate',
    totalLessons: 45,
    estimatedHours: 60,
    modules: [
      { name: 'DSA (High-Frequency)', lessons: 20, duration: '2 weeks' },
      { name: 'System Design Essentials', lessons: 10, duration: '1 week' },
      { name: 'Behavioral + HR', lessons: 8, duration: '3 days' },
      { name: 'Company-Specific Prep', lessons: 7, duration: '4 days' },
    ],
    targetAudience: 'Engineers with 2+ years experience, solid DSA foundation, interview in 1 month',
    outcomes: [
      'Master top 50 DSA patterns',
      'Complete 5 system design problems',
      'Prepare 10 behavioral stories',
      'Company-specific question patterns',
    ],
  },
  {
    id: 'complete-12-week',
    title: '12-Week Complete Path',
    description: 'Comprehensive preparation covering all interview dimensions. Perfect for serious preparation with balanced learning pace.',
    duration: '12 weeks',
    difficulty: 'Beginner to Advanced',
    totalLessons: 140,
    estimatedHours: 180,
    modules: [
      { name: 'DSA (Complete)', lessons: 70, duration: '6 weeks' },
      { name: 'Machine Coding', lessons: 25, duration: '3 weeks' },
      { name: 'System Design', lessons: 20, duration: '2 weeks' },
      { name: 'Behavioral + HR', lessons: 15, duration: '1 week' },
      { name: 'Interview Formats', lessons: 10, duration: '3 days' },
    ],
    targetAudience: 'All levels, thorough preparation, interview in 2-4 months',
    outcomes: [
      'Master 200+ DSA problems across all topics',
      'Complete 15+ machine coding projects',
      'Design 10+ scalable systems',
      'Perfect behavioral interview answers',
      'Mock interview confidence',
    ],
  },
  {
    id: 'deep-dive-16-week',
    title: '16-Week Deep Dive',
    description: 'Master-level preparation for FAANG and top-tier companies. In-depth coverage with advanced topics and competitive programming.',
    duration: '16 weeks',
    difficulty: 'Advanced',
    totalLessons: 180,
    estimatedHours: 240,
    modules: [
      { name: 'DSA (Advanced + CP)', lessons: 90, duration: '8 weeks' },
      { name: 'Machine Coding (Advanced)', lessons: 30, duration: '4 weeks' },
      { name: 'System Design (HLD + LLD)', lessons: 30, duration: '3 weeks' },
      { name: 'Behavioral + Leadership', lessons: 20, duration: '1 week' },
      { name: 'Mock Interviews', lessons: 10, duration: 'Ongoing' },
    ],
    targetAudience: 'Targeting FAANG/top-tier, want mastery, have 4+ months',
    outcomes: [
      'Master 300+ problems including advanced topics',
      'Build complex production-ready applications',
      'Design enterprise-scale systems',
      'Leadership and team management stories',
      'Competitive programming strategies',
    ],
  },
  {
    id: 'google-specific',
    title: 'Google Interview Path',
    description: 'Specialized preparation for Google interviews. Focus on Googley-ness, data structures, algorithms, and Google-specific patterns.',
    duration: '10 weeks',
    difficulty: 'Advanced',
    totalLessons: 120,
    estimatedHours: 150,
    modules: [
      { name: 'Google DSA Patterns', lessons: 60, duration: '6 weeks' },
      { name: 'System Design (Google Scale)', lessons: 25, duration: '3 weeks' },
      { name: 'Googleyness & Leadership', lessons: 20, duration: '1 week' },
      { name: 'Google-Specific Tips', lessons: 15, duration: '1 week' },
    ],
    targetAudience: 'Specifically preparing for Google',
    outcomes: [
      'Master Google-favorite algorithm patterns',
      'Design systems at Google scale',
      'Demonstrate Googleyness traits',
      'Understand Google interview process',
    ],
    companies: ['Google', 'YouTube', 'Gmail Team'],
  },
  {
    id: 'amazon-specific',
    title: 'Amazon Interview Path',
    description: 'Amazon leadership principles focused preparation. Strong emphasis on behavioral interviews and scalability patterns.',
    duration: '10 weeks',
    difficulty: 'Intermediate to Advanced',
    totalLessons: 110,
    estimatedHours: 140,
    modules: [
      { name: 'Amazon DSA Patterns', lessons: 50, duration: '5 weeks' },
      { name: 'System Design (AWS Focus)', lessons: 25, duration: '3 weeks' },
      { name: 'Leadership Principles', lessons: 25, duration: '2 weeks' },
      { name: 'Bar Raiser Prep', lessons: 10, duration: '1 week' },
    ],
    targetAudience: 'Specifically preparing for Amazon',
    outcomes: [
      'Master Amazon coding patterns',
      'Design with AWS services',
      'Perfect all 16 leadership principles',
      'Bar raiser interview strategies',
    ],
    companies: ['Amazon', 'AWS', 'Alexa Team'],
  },
  {
    id: 'indian-product',
    title: 'Indian Product Companies Path',
    description: 'Specialized for Flipkart, Swiggy, Cred, Razorpay, etc. Focus on machine coding, practical system design, and product thinking.',
    duration: '8 weeks',
    difficulty: 'Intermediate',
    totalLessons: 100,
    estimatedHours: 120,
    modules: [
      { name: 'DSA (Product Company Focus)', lessons: 40, duration: '4 weeks' },
      { name: 'Machine Coding (Priority)', lessons: 30, duration: '3 weeks' },
      { name: 'System Design (Indian Scale)', lessons: 20, duration: '2 weeks' },
      { name: 'Product Thinking', lessons: 10, duration: '1 week' },
    ],
    targetAudience: 'Targeting Flipkart, Swiggy, Cred, Razorpay, etc.',
    outcomes: [
      'Excel in machine coding rounds',
      'Practical system design for Indian context',
      'Product thinking and user empathy',
      'Company culture understanding',
    ],
    companies: ['Flipkart', 'Swiggy', 'Cred', 'Razorpay', 'Zomato', 'PhonePe'],
  },
];

export default function LearningPathsPage() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [pathProgress, setPathProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCurrentPath();
  }, []);

  const fetchCurrentPath = async () => {
    try {
      const response = await fetch('/api/paths/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentPath(data.path);
        setPathProgress(data.progress || {});
      }
    } catch (error) {
      console.error('Failed to fetch current path:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPath = async (pathId: string) => {
    try {
      const response = await fetch('/api/paths/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathId }),
      });

      if (response.ok) {
        const path = LEARNING_PATHS.find(p => p.id === pathId);
        setCurrentPath(path || null);
        setSelectedPath(pathId);
      }
    } catch (error) {
      console.error('Failed to select path:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
      case 'intermediate':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'advanced':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'beginner to advanced':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Learning Paths</h1>
        <p className="text-muted-foreground text-lg">
          Choose a structured roadmap tailored to your goals and timeline
        </p>
      </div>

      {/* Current Path Alert */}
      {currentPath && (
        <Alert className="mb-8 bg-primary/5 border-primary">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Current Path:</strong> {currentPath.title}
                <span className="ml-4 text-sm text-muted-foreground">
                  {pathProgress[currentPath.id] || 0}% complete
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Paths</TabsTrigger>
          <TabsTrigger value="general">General Prep</TabsTrigger>
          <TabsTrigger value="company">Company-Specific</TabsTrigger>
        </TabsList>

        {/* All Paths */}
        <TabsContent value="all" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_PATHS.map((path) => (
              <PathCard
                key={path.id}
                path={path}
                isSelected={currentPath?.id === path.id}
                progress={pathProgress[path.id] || 0}
                onSelect={() => handleSelectPath(path.id)}
                getDifficultyColor={getDifficultyColor}
              />
            ))}
          </div>
        </TabsContent>

        {/* General Prep Paths */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_PATHS.filter(p => !p.companies).map((path) => (
              <PathCard
                key={path.id}
                path={path}
                isSelected={currentPath?.id === path.id}
                progress={pathProgress[path.id] || 0}
                onSelect={() => handleSelectPath(path.id)}
                getDifficultyColor={getDifficultyColor}
              />
            ))}
          </div>
        </TabsContent>

        {/* Company-Specific Paths */}
        <TabsContent value="company" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_PATHS.filter(p => p.companies).map((path) => (
              <PathCard
                key={path.id}
                path={path}
                isSelected={currentPath?.id === path.id}
                progress={pathProgress[path.id] || 0}
                onSelect={() => handleSelectPath(path.id)}
                getDifficultyColor={getDifficultyColor}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PathCard({
  path,
  isSelected,
  progress,
  onSelect,
  getDifficultyColor,
}: {
  path: LearningPath;
  isSelected: boolean;
  progress: number;
  onSelect: () => void;
  getDifficultyColor: (difficulty: string) => string;
}) {
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      {isSelected && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary">Active</Badge>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start gap-3 mb-2">
          {path.companies ? (
            <Building2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          ) : path.id.includes('express') ? (
            <Zap className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
          ) : path.id.includes('deep') ? (
            <Trophy className="h-6 w-6 text-success flex-shrink-0 mt-1" />
          ) : (
            <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-1">{path.title}</CardTitle>
            <Badge className={getDifficultyColor(path.difficulty)} variant="outline">
              {path.difficulty}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {path.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-muted rounded-lg p-3">
            <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-semibold text-sm">{path.duration}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <Target className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Lessons</p>
            <p className="font-semibold text-sm">{path.totalLessons}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <Clock className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Hours</p>
            <p className="font-semibold text-sm">{path.estimatedHours}h</p>
          </div>
        </div>

        {/* Companies */}
        {path.companies && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Target Companies:</p>
            <div className="flex flex-wrap gap-1">
              {path.companies.map((company) => (
                <Badge key={company} variant="secondary" className="text-xs">
                  {company}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {progress > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onSelect}
          className="w-full"
          variant={isSelected ? 'default' : 'outline'}
        >
          {isSelected ? (
            <>
              Continue Path
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : progress > 0 ? (
            'Resume Path'
          ) : (
            'Start Path'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
