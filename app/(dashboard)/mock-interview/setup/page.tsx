'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, Clock, Target, Zap } from 'lucide-react';

const INTERVIEW_TYPES = [
  { 
    id: 'JAVASCRIPT', 
    label: 'JavaScript / Frontend', 
    price: 99, 
    duration: 20, 
    difficulty: 'Medium',
    description: 'ES6+, Async, Closures, DOM, React concepts'
  },
  { 
    id: 'MACHINE_CODING', 
    label: 'Machine Coding', 
    price: 149, 
    duration: 25, 
    difficulty: 'Hard',
    description: 'Build components, state management, API integration'
  },
  { 
    id: 'DSA', 
    label: 'Data Structures & Algorithms', 
    price: 129, 
    duration: 20, 
    difficulty: 'Medium',
    description: 'Arrays, Trees, Graphs, Dynamic Programming'
  },
  { 
    id: 'SYSTEM_DESIGN', 
    label: 'System Design', 
    price: 199, 
    duration: 30, 
    difficulty: 'Expert',
    description: 'Scalability, Databases, Load Balancing, Microservices'
  },
  { 
    id: 'BEHAVIORAL', 
    label: 'Behavioral / HR', 
    price: 99, 
    duration: 15, 
    difficulty: 'Easy',
    description: 'Leadership, Conflict Resolution, Communication'
  },
];

const DIFFICULTIES = [
  { id: 'EASY', label: 'Easy', color: 'bg-green-500' },
  { id: 'MEDIUM', label: 'Medium', color: 'bg-yellow-500' },
  { id: 'HARD', label: 'Hard', color: 'bg-orange-500' },
  { id: 'EXPERT', label: 'Expert', color: 'bg-red-500' },
];

const FOCUS_AREAS_MAP: Record<string, string[]> = {
  JAVASCRIPT: ['ES6+', 'Async/Promises', 'Closures', 'Prototypes', 'DOM Manipulation'],
  MACHINE_CODING: ['React', 'State Management', 'API Integration', 'Performance', 'Testing'],
  DSA: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching'],
  SYSTEM_DESIGN: ['Scalability', 'Databases', 'Caching', 'Load Balancing', 'Microservices', 'Security'],
  BEHAVIORAL: ['Leadership', 'Conflict Resolution', 'Project Management', 'Communication', 'Teamwork'],
};

export default function InterviewSetupPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('MEDIUM');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const selectedInterview = INTERVIEW_TYPES.find(t => t.id === selectedType);
  
  const handleFocusAreaToggle = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };
  
  const handleSetup = async () => {
    if (!selectedType) {
      setError('Please select an interview type');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/interviews/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          difficulty: selectedDifficulty,
          focusAreas,
          specificRequirements: requirements,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Setup failed');
      }
      
      // Redirect to payment page
      router.push(`/mock-interview/${data.data.sessionId}/payment`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup interview');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">AI Mock Interview</h1>
        <p className="text-muted-foreground text-lg">
          Practice with our AI interviewer and get instant feedback to ace your next interview
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Interview Type Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Step 1: Select Interview Type
          </CardTitle>
          <CardDescription>Choose the type of interview you want to practice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {INTERVIEW_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-5 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedType === type.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{type.label}</h3>
                    <Badge variant="outline" className="text-xs">
                      {type.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{type.duration} min</span>
                    </div>
                    <div className="font-semibold text-primary">
                      ₹{type.price}
                    </div>
                  </div>
                </div>
                {selectedType === type.id && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Difficulty Level */}
      {selectedType && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Step 2: Choose Difficulty Level
            </CardTitle>
            <CardDescription>Select the difficulty that matches your skill level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DIFFICULTIES.map((diff) => (
                <Button
                  key={diff.id}
                  variant={selectedDifficulty === diff.id ? 'default' : 'outline'}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded-full ${diff.color}`} />
                  <span>{diff.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Focus Areas */}
      {selectedType && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step 3: Focus Areas (Optional)</CardTitle>
            <CardDescription>Select specific topics you want to focus on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS_MAP[selectedType]?.map((area) => (
                <Badge
                  key={area}
                  variant={focusAreas.includes(area) ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/90"
                  onClick={() => handleFocusAreaToggle(area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Requirements */}
      {selectedType && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step 4: Additional Requirements (Optional)</CardTitle>
            <CardDescription>Any specific topics or areas you want the interviewer to focus on</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="E.g., Focus on distributed systems, include questions about React hooks, prepare me for Amazon interview, etc."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Pricing Summary & CTA */}
      {selectedInterview && (
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm opacity-90 mb-1">Interview Fee</p>
                <p className="text-4xl font-bold mb-2">₹{selectedInterview.price}</p>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>~{selectedInterview.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Instant Report</span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleSetup}
                disabled={isLoading || !selectedType}
                className="w-full md:w-auto px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Questions</h3>
            <p className="text-sm text-muted-foreground">
              Questions tailored to your level and focus areas using Google Gemini AI
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Voice Interview</h3>
            <p className="text-sm text-muted-foreground">
              Natural conversation with AI interviewer via voice call
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Instant Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Detailed report with scores, strengths, and improvement areas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
