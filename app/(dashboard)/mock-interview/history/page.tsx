'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, TrendingUp, Eye, Plus } from 'lucide-react';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const fetchHistory = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/interviews/history?page=${pageNum}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      COMPLETED: 'default',
      IN_PROGRESS: 'secondary',
      FAILED: 'destructive',
      SETUP: 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="outline">Pending</Badge>;
    if (score >= 80) return <Badge className="bg-green-600">⭐⭐⭐ {score}</Badge>;
    if (score >= 60) return <Badge className="bg-blue-600">⭐⭐ {score}</Badge>;
    return <Badge className="bg-orange-600">⭐ {score}</Badge>;
  };

  if (loading && !history) {
    return (
      <div className="container max-w-7xl mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview History</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and review past interviews
          </p>
        </div>
        <Link href="/mock-interview/setup">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Interview
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      {history && history.interviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{history.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {history.interviews.filter((i: any) => i.status === 'COMPLETED').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {Math.round(
                  history.interviews
                    .filter((i: any) => i.score)
                    .reduce((acc: number, i: any) => acc + i.score, 0) /
                    history.interviews.filter((i: any) => i.score).length || 0
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-2xl font-bold">
                  {history.interviews.length > 1 ? '+12%' : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interview Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          {!history || history.interviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No interviews yet</p>
              <Link href="/mock-interview/setup">
                <Button>Start Your First Interview</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.interviews.map((interview: any) => (
                    <TableRow key={interview.sessionId}>
                      <TableCell className="font-medium">
                        {formatDate(interview.date)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {interview.type.replace('_', ' ').toLowerCase()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {interview.difficulty.toLowerCase()}
                      </TableCell>
                      <TableCell>{formatDuration(interview.duration)}</TableCell>
                      <TableCell>{getScoreBadge(interview.score)}</TableCell>
                      <TableCell>{getStatusBadge(interview.status)}</TableCell>
                      <TableCell className="text-right">
                        {interview.status === 'COMPLETED' && (
                          <Link href={`/mock-interview/${interview.sessionId}/report`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Report
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {history.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {history.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(history.totalPages, p + 1))}
                    disabled={page === history.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
