'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Loader2,
  BookOpen,
  Video,
  Briefcase,
  Target,
  FileText,
  ArrowRight,
  Filter
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'lesson' | 'video' | 'job' | 'path';
  title: string;
  description: string;
  url: string;
  metadata?: {
    difficulty?: string;
    module?: string;
    company?: string;
    duration?: string;
  };
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    // Update URL
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'job':
        return <Briefcase className="h-5 w-5" />;
      case 'path':
        return <Target className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'video':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'job':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'path':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filterResults = (type: string) => {
    if (type === 'all') return results;
    return results.filter(r => r.type === type);
  };

  const filteredResults = filterResults(activeTab);

  const getCounts = () => {
    return {
      all: results.length,
      lesson: results.filter(r => r.type === 'lesson').length,
      video: results.filter(r => r.type === 'video').length,
      job: results.filter(r => r.type === 'job').length,
      path: results.filter(r => r.type === 'path').length,
    };
  };

  const counts = getCounts();

  return (
    <div className="container max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Search</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for lessons, videos, jobs, or learning paths..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 h-14 text-lg"
            autoFocus
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </Button>
        </form>
      </div>

      {/* Results */}
      {query && (
        <div>
          <div className="mb-4">
            <p className="text-muted-foreground">
              {loading ? (
                'Searching...'
              ) : results.length > 0 ? (
                `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
              ) : (
                `No results found for "${query}"`
              )}
            </p>
          </div>

          {results.length > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  All ({counts.all})
                </TabsTrigger>
                {counts.lesson > 0 && (
                  <TabsTrigger value="lesson">
                    Lessons ({counts.lesson})
                  </TabsTrigger>
                )}
                {counts.video > 0 && (
                  <TabsTrigger value="video">
                    Videos ({counts.video})
                  </TabsTrigger>
                )}
                {counts.job > 0 && (
                  <TabsTrigger value="job">
                    Jobs ({counts.job})
                  </TabsTrigger>
                )}
                {counts.path > 0 && (
                  <TabsTrigger value="path">
                    Paths ({counts.path})
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredResults.map((result) => (
                  <Card
                    key={result.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(result.url)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-muted rounded-lg mt-1">
                            {getIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getTypeColor(result.type)} variant="outline">
                                {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                              </Badge>
                              {result.metadata?.difficulty && (
                                <Badge variant="secondary">
                                  {result.metadata.difficulty}
                                </Badge>
                              )}
                              {result.metadata?.duration && (
                                <Badge variant="secondary">
                                  {result.metadata.duration}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl mb-2">
                              {result.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {result.description}
                            </CardDescription>
                            {(result.metadata?.module || result.metadata?.company) && (
                              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                {result.metadata.module && (
                                  <span>Module: {result.metadata.module}</span>
                                )}
                                {result.metadata.company && (
                                  <span>Company: {result.metadata.company}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}

      {/* Empty State */}
      {!query && !loading && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Search PrepKit</h3>
          <p className="text-muted-foreground mb-6">
            Find lessons, videos, jobs, and learning paths
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {
              setQuery('JavaScript');
              performSearch('JavaScript');
            }}>
              JavaScript
            </Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {
              setQuery('React');
              performSearch('React');
            }}>
              React
            </Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {
              setQuery('DSA');
              performSearch('DSA');
            }}>
              Data Structures
            </Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {
              setQuery('System Design');
              performSearch('System Design');
            }}>
              System Design
            </Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {
              setQuery('Google');
              performSearch('Google');
            }}>
              Google
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
