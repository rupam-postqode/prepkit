'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, CheckCircle, AlertCircle, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

export default function ReportPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/interviews/${sessionId}/report`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReport(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Analyzing your performance...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container max-w-4xl mx-auto py-16">
        <Card>
          <CardHeader>
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>Report Not Found</CardTitle>
            <CardDescription>The interview report is not available yet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const reportData = typeof report.reportJson === 'string' ? JSON.parse(report.reportJson) : report.reportJson;

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview Report</h1>
          <p className="text-muted-foreground">Comprehensive analysis of your performance</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-4xl font-bold">{report.overallScore}/100</p>
              <p className="text-sm text-muted-foreground">
                {report.overallScore >= 80 ? 'Excellent!' : report.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={report.overallScore >= 70 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                {report.overallScore >= 80 ? '⭐⭐⭐' : report.overallScore >= 60 ? '⭐⭐' : '⭐'}
              </Badge>
            </div>
          </div>
          <Progress value={report.overallScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <CardDescription>Performance across different categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.scoreBreakdown && Object.entries(report.scoreBreakdown).map(([key, value]: [string, any]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-muted-foreground">{value}/100</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
          <CardTitle>Strengths</CardTitle>
          <CardDescription>What you did well</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {reportData.strengths?.map((strength: any, i: number) => (
              <li key={i} className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{strength.area}</p>
                  <p className="text-sm text-muted-foreground">{strength.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Weaknesses */}
      <Card>
        <CardHeader>
          <AlertCircle className="h-6 w-6 text-orange-600 mb-2" />
          <CardTitle>Areas for Improvement</CardTitle>
          <CardDescription>Focus on these to improve your score</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {reportData.weaknesses?.map((weakness: any, i: number) => (
              <li key={i} className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{weakness.area}</p>
                  <p className="text-sm text-muted-foreground">{weakness.description}</p>
                  <p className="text-sm text-primary mt-1">Focus: {weakness.focusOn}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <TrendingUp className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Action Items</CardTitle>
          <CardDescription>Concrete steps to improve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.recommendations?.map((rec: any, i: number) => (
              <div key={i} className="border-l-4 border-primary pl-4 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>Priority {rec.priority}</Badge>
                  <h3 className="font-semibold">{rec.topic}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.practiceStrategy}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>📚 Resources: {rec.resources?.join(', ')}</span>
                  <span>•</span>
                  <span>⏱️ {rec.timeToMaster}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Ready for Your Next Interview?</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {reportData.suggestionForNextInterview?.recommendedTopic}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/mock-interview/setup">
            <Button size="lg" variant="secondary">
              Start New Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/mock-interview/history">
            <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/20">
              View All Reports
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
