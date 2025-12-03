'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Phone,
  PhoneOff,
  Clock,
  Mic,
  MicOff,
  Play,
  Pause
} from 'lucide-react';

interface SessionData {
  id: string;
  type: string;
  difficulty: string;
  status: string;
  questionsGenerated: Array<{
    id: string;
    text: string;
    difficulty: number;
  }>;
  configuration: {
    duration: number;
  };
}

export default function InterviewSessionPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [callActive, setCallActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    fetchSession();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [params.sessionId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/interviews/${params.sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to load session');
      }
      const data = await response.json();
      setSession(data.session);
      
      // If interview already started, resume timer
      if (data.session.status === 'IN_PROGRESS') {
        startTimer();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) return;
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startInterview = async () => {
    setError(null);
    setLoading(true);

    try {
      // Start interview via API
      const response = await fetch(`/api/interviews/${params.sessionId}/start`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start interview');
      }

      // Initialize Vapi call
      // Note: In production, you'd import and use the actual Vapi SDK
      // import Vapi from '@vapi-ai/web';
      // const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
      // await vapi.start();
      
      setCallActive(true);
      startTimer();
      
      // Update session status
      setSession(prev => prev ? { ...prev, status: 'IN_PROGRESS' } : null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (!confirm('Are you sure you want to end the interview? You cannot resume after ending.')) {
      return;
    }

    setIsCompleting(true);
    stopTimer();

    try {
      // End Vapi call if active
      if (vapiRef.current) {
        // vapiRef.current.stop();
      }

      // Complete interview and generate report
      const response = await fetch(`/api/interviews/${params.sessionId}/complete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete interview');
      }

      // Redirect to report page
      router.push(`/mock-interview/${params.sessionId}/report`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete interview');
      setIsCompleting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Session not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If interview hasn't started
  if (session.status === 'SETUP') {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Start?</CardTitle>
              <CardDescription>
                Your interview is set up and ready to begin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Interview Type</span>
                  <span className="font-medium">{formatType(session.type)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge>{session.difficulty}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground"># of Questions</span>
                  <span className="font-medium">{session.questionsGenerated?.length || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Est. Duration</span>
                  <span className="font-medium">~{session.configuration.duration} minutes</span>
                </div>
              </div>

              {/* Instructions */}
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Before you start:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Find a quiet space</li>
                    <li>Allow microphone access</li>
                    <li>Speak clearly and at a moderate pace</li>
                    <li>You can end the interview anytime</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Button 
                onClick={startInterview} 
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Starting Interview...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start Interview
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If interview completed, redirect to report
  if (session.status === 'COMPLETED') {
    router.push(`/mock-interview/${params.sessionId}/report`);
    return null;
  }

  // Active interview
  const progress = ((currentQuestion + 1) / (session.questionsGenerated?.length || 1)) * 100;
  const estimatedTotal = session.configuration.duration * 60;

  return (
    <div className="container max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mock Interview</h1>
        <p className="text-muted-foreground">
          {formatType(session.type)} • {session.difficulty}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Interview Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Voice Call Status */}
          <Card className={callActive ? 'border-success' : 'border-muted'}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                {callActive ? (
                  <>
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-pulse">
                        <Phone className="h-12 w-12 text-success" />
                      </div>
                      <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-success/30 animate-ping" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Interview in Progress</h3>
                    <p className="text-muted-foreground text-center">
                      Listen carefully and answer each question thoughtfully
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-success">
                      <Mic className="h-5 w-5 animate-pulse" />
                      <span className="text-sm font-medium">Microphone Active</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                      <PhoneOff className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Call Ended</h3>
                    <p className="text-muted-foreground">
                      Waiting to start...
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Question {currentQuestion + 1} of {session.questionsGenerated?.length}</CardTitle>
                <Badge variant="outline">
                  Difficulty: {session.questionsGenerated?.[currentQuestion]?.difficulty || 'N/A'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                {session.questionsGenerated?.[currentQuestion]?.text || 'Question will appear here...'}
              </p>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            onClick={endInterview}
            disabled={isCompleting || !callActive}
            variant="destructive"
            size="lg"
            className="w-full"
          >
            {isCompleting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <PhoneOff className="mr-2 h-5 w-5" />
                End Interview
              </>
            )}
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Elapsed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">{formatTime(elapsedTime)}</p>
                <p className="text-sm text-muted-foreground">
                  Est. {formatTime(estimatedTotal)} total
                </p>
                <Progress 
                  value={(elapsedTime / estimatedTotal) * 100} 
                  className="mt-4"
                />
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Questions</span>
                    <span className="font-medium">
                      {currentQuestion + 1} / {session.questionsGenerated?.length}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
                <Separator />
                <div className="space-y-2">
                  {session.questionsGenerated?.map((q, idx) => (
                    <div 
                      key={q.id}
                      className={`flex items-center gap-2 text-sm ${
                        idx === currentQuestion ? 'text-primary font-medium' :
                        idx < currentQuestion ? 'text-success' : 'text-muted-foreground'
                      }`}
                    >
                      {idx < currentQuestion ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : idx === currentQuestion ? (
                        <div className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted" />
                      )}
                      <span>Question {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Take your time to think before answering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Structure your answers clearly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use specific examples when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Ask for clarification if needed</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
