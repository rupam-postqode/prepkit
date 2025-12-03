'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  Download,
  Share2,
  Calendar,
  Clock,
  Award
} from 'lucide-react';

interface ReportData {
  sessionId: string;
  overallScore: number;
  scoreBreakdown: {
    [key: string]: number;
  };
  strengths: Array<{
    category: string;
    description: string;
    examples?: string[];
  }>;
  weaknesses: Array<{
    category: string;
    description: string;
    improvement: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    resources?: Array<{
      title: string;
      url: string;
    }>;
  }>;
  interviewDetails: {
    type: string;
    difficulty: string;
    duration: number;
    completedAt: string;
  };
}

export default function ReportPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [params.sessionId]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/interviews/${params.sessionId}/report`);
      if (!response.ok) {
        throw new Error('Failed to load report');
      }
      const data = await response.json();
      setReport(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    alert('Download feature coming soon!');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert('Share feature coming soon!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Generating your report...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take 10-20 seconds</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || 'Report not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Interview Report</h1>
            <p className="text-muted-foreground">
              {formatType(report.interviewDetails.type)} • {report.interviewDetails.difficulty}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(report.interviewDetails.completedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{Math.round(report.interviewDetails.duration / 60)} minutes</span>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className={`mb-8 border-2 ${getScoreBgColor(report.overallScore)}`}>
        <CardContent className="pt-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${getScoreBgColor(report.overallScore)} mb-4`}>
              <span className={`text-5xl font-bold ${getScoreColor(report.overallScore)}`}>
                {report.overallScore}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {report.overallScore >= 80 ? 'Excellent Performance!' :
               report.overallScore >= 60 ? 'Good Effort!' : 'Keep Practicing!'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {report.overallScore >= 80 
                ? 'You demonstrated strong understanding and communication skills. Keep it up!'
                : report.overallScore >= 60
                ? 'You showed good foundational knowledge. Focus on the areas below to improve further.'
                : 'Don\'t be discouraged! Review the recommendations and practice more to build confidence.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="weaknesses">Areas to Improve</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Score Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>Detailed scores across different evaluation criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(report.scoreBreakdown).map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Top Performing Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.entries(report.scoreBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([category, score]) => (
                      <li key={category} className="flex justify-between items-center">
                        <span className="text-sm capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Badge variant="outline" className="bg-success/10 text-success border-success">
                          {score}%
                        </Badge>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-warning" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.entries(report.scoreBreakdown)
                    .sort(([, a], [, b]) => a - b)
                    .slice(0, 3)
                    .map(([category, score]) => (
                      <li key={category} className="flex justify-between items-center">
                        <span className="text-sm capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                          {score}%
                        </Badge>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Strengths Tab */}
        <TabsContent value="strengths" className="space-y-4">
          {report.strengths.map((strength, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  {strength.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{strength.description}</p>
                {strength.examples && strength.examples.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Examples:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {strength.examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
          {report.strengths.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No specific strengths identified yet. Keep practicing!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Weaknesses Tab */}
        <TabsContent value="weaknesses" className="space-y-4">
          {report.weaknesses.map((weakness, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-warning" />
                  {weakness.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{weakness.description}</p>
                <Separator />
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    How to Improve:
                  </p>
                  <p className="text-sm text-muted-foreground">{weakness.improvement}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {report.weaknesses.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Great job! No major weaknesses identified.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {report.recommendations.map((rec, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  {rec.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{rec.description}</p>
                {rec.resources && rec.resources.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Recommended Resources:</p>
                      <ul className="space-y-2">
                        {rec.resources.map((resource, idx) => (
                          <li key={idx}>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-2"
                            >
                              <Award className="h-4 w-4" />
                              {resource.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={() => router.push('/mock-interview/setup')}
        >
          Schedule Another Interview
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push('/mock-interview/history')}
        >
          View Interview History
        </Button>
      </div>
    </div>
  );
}
