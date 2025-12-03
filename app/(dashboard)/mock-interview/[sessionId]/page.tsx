'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mic, Phone } from 'lucide-react';

export default function InterviewSessionPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Start interview session
    fetch(`/api/interviews/${sessionId}/start`, {
      method: 'POST'
    })
      .then(() => setLoading(false))
      .catch(() => setLoading(false));

    // Timer
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = async () => {
    setLoading(true);
    await fetch(`/api/interviews/${sessionId}/complete`, {
      method: 'POST'
    });
    router.push(`/mock-interview/${sessionId}/report`);
  };

  if (loading && !started) {
    return (
      <div className="container max-w-4xl mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Mock Interview in Progress</CardTitle>
            <div className="text-2xl font-mono">{formatTime(elapsedTime)}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Interview Widget */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-12 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
              <Mic className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold">Voice Interview Active</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Answer the interviewer's questions clearly. Take your time to think through your responses.
            </p>
            {!started && (
              <Button size="lg" onClick={() => setStarted(true)}>
                <Phone className="mr-2 h-4 w-4" />
                Start Speaking
              </Button>
            )}
            {started && (
              <div className="space-y-2">
                <p className="text-sm text-green-600 font-medium">● Recording</p>
                <p className="text-xs text-muted-foreground">
                  The AI interviewer is listening...
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interview Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Listen carefully to each question before responding</li>
                <li>Explain your thought process clearly</li>
                <li>Ask for clarification if needed</li>
                <li>Take your time - there's no rush</li>
                <li>Be honest about what you know and don't know</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="destructive"
              onClick={handleEndInterview}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                'End Interview & Get Report'
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Note: In production, this would integrate with Vapi AI for real voice conversations.
            For demo purposes, click "End Interview" to see the report generation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
