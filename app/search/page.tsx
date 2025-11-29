"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  snippet: string;
  difficulty: string;
  module: {
    id: string;
    title: string;
    emoji: string;
  };
  chapter: {
    id: string;
    title: string;
  };
  hasVideo: boolean;
  practiceCount: number;
  updatedAt: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  limit: number;
  offset: number;
  hasMore: boolean;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const performSearch = async (searchQuery: string, searchOffset = 0) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotal(0);
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      params.set("limit", "20");
      params.set("offset", searchOffset.toString());

      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) throw new Error("Search failed");

      const data: SearchResponse = await response.json();

      if (searchOffset === 0) {
        setResults(data.results);
      } else {
        setResults(prev => [...prev, ...data.results]);
      }

      setTotal(data.total);
      setHasMore(data.hasMore);
      setOffset(searchOffset + data.limit);

      // Update URL
      const urlParams = new URLSearchParams();
      urlParams.set("q", searchQuery);
      router.replace(`/search?${urlParams.toString()}`, { scroll: false });
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial search on mount
  useEffect(() => {
    const initialQuery = searchParams.get("q") || "";
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, []); // Only run on mount

  const handleSearch = () => {
    performSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const loadMore = () => {
    performSearch(query, offset);
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/lessons/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Lessons</h1>
          <p className="text-gray-600">Find lessons by topic, keyword, or content</p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search for lessons, algorithms, data structures..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="px-6">
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {results.length > 0 && (
            <div className="text-gray-600">
              Found {total} lesson{total !== 1 ? "s" : ""} for "{query}"
            </div>
          )}

          {results.map((result) => (
            <Card
              key={result.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigateToLesson(result.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{result.module.emoji}</span>
                    <span className="text-sm text-gray-600">{result.module.title}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{result.chapter.title}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                    {result.title}
                  </h3>

                  <p className="text-gray-600 mb-3 line-clamp-3">{result.snippet}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      result.difficulty === 'EASY'
                        ? 'bg-green-100 text-green-800'
                        : result.difficulty === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.difficulty}
                    </span>

                    {result.hasVideo && <span>🎥 Has video</span>}
                    {result.practiceCount > 0 && (
                      <span>💻 {result.practiceCount} practice link{result.practiceCount !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  <Button variant="outline" size="sm">
                    View Lesson →
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {results.length === 0 && !loading && query && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
              <p className="text-gray-600">
                Try different keywords or check your spelling.
              </p>
            </div>
          )}

          {results.length === 0 && !loading && !query && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for lessons</h3>
              <p className="text-gray-600">
                Enter keywords like "arrays", "sorting", "dynamic programming", or "graphs"
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching...</p>
            </div>
          )}

          {hasMore && !loading && (
            <div className="text-center py-8">
              <Button onClick={loadMore} variant="outline">
                Load More Results
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
