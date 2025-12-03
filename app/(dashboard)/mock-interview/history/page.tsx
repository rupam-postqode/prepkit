'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Loader2, 
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Search,
  Filter
} from 'lucide-react';

interface Interview {
  sessionId: string;
  type: string;
  difficulty: string;
  status: string;
  date: string;
  duration: number;
  score?: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    bestScore: 0,
    totalDuration: 0,
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [interviews, searchTerm, filterType, filterStatus]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/interviews/history');
      if (!response.ok) {
        throw new Error('Failed to load history');
      }
      const data = await response.json();
      setInterviews(data.data.interviews || []);
      
      // Calculate stats
      const completed = data.data.interviews.filter((i: Interview) => i.status === 'COMPLETED');
      const scores = completed.filter((i: Interview) => i.score).map((i: Interview) => i.score!);
      
      setStats({
        total: data.data.interviews.length,
        avgScore: scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0,
        totalDuration: data.data.interviews.reduce((sum: number, i: Interview) => sum + (i.duration || 0), 0),
      });
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...interviews];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(interview =>
        interview.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(interview => interview.type === filterType);
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(interview => interview.status === filterStatus);
    }
    
    setFilteredInterviews(filtered);
  };

  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return null;
    
    if (score >= 80) {
      return <Badge className="bg-success text-success-foreground">{score}</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-warning text-warning-foreground">{score}</Badge>;
    } else {
      return <Badge className="bg-destructive text-destructive-foreground">{score}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'SETUP':
        return <Badge variant="outline">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Interview History</h1>
            <p className="text-muted-foreground">
              Track your progress and review past interviews
            </p>
          </div>
          <Button onClick={() => router.push('/mock-interview/setup')}>
            Schedule New Interview
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all completed interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.bestScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Personal best performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.totalDuration / 60)} min
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Time spent in interviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                <SelectItem value="MACHINE_CODING">Machine Coding</SelectItem>
                <SelectItem value="DSA">Data Structures</SelectItem>
                <SelectItem value="SYSTEM_DESIGN">System Design</SelectItem>
                <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="SETUP">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Interviews</CardTitle>
          <CardDescription>
            {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {interviews.length === 0 
                  ? 'No interviews yet. Start your first interview!'
                  : 'No interviews match your filters.'}
              </p>
              {interviews.length === 0 && (
                <Button onClick={() => router.push('/mock-interview/setup')}>
                  Schedule Your First Interview
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterviews.map((interview) => (
                  <TableRow key={interview.sessionId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(interview.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatType(interview.type)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{interview.difficulty}</Badge>
                    </TableCell>
                    <TableCell>
                      {interview.duration ? formatDuration(interview.duration) : '-'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(interview.status)}
                    </TableCell>
                    <TableCell>
                      {interview.score ? getScoreBadge(interview.score) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {interview.status === 'COMPLETED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/mock-interview/${interview.sessionId}/report`)}
                        >
                          View Report
                        </Button>
                      )}
                      {interview.status === 'SETUP' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/mock-interview/${interview.sessionId}`)}
                        >
                          Continue
                        </Button>
                      )}
                      {interview.status === 'IN_PROGRESS' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/mock-interview/${interview.sessionId}`)}
                        >
                          Resume
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Score Trend (Coming Soon) */}
      {filteredInterviews.filter(i => i.score).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Track your improvement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Performance chart coming soon!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
