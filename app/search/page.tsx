"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  module: {
    title: string;
    slug: string;
    emoji: string;
  };
  chapter: {
    title: string;
    slug: string;
  };
  progress: {
    completedAt: string | null;
    timeSpentSeconds: number;
    videoWatchedPercent: number;
  } | null;
  practiceLinksCount: number;
  publishedAt: string;
}

interface SearchResponse {
  results: SearchResult[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  query: string | null;
  filters: {
    module: string | null;
    difficulty: string | null;
    status: string | null;
  };
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    module: searchParams.get("module") || "",
    difficulty: searchParams.get("difficulty") || "",
    status: searchParams.get("status") || "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  const performSearch = useCallback(async (searchQuery: string, searchFilters: typeof filters, offset = 0) => {
    if (!searchQuery.trim() && !searchFilters.module && !searchFilters.difficulty && !searchFilters.status) {
      setResults([]);
      setPagination({ total: 0, limit: 20, offset: 0, hasMore: false });
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery);
      if (searchFilters.module) params.set("module", searchFilters.module);
      if (searchFilters.difficulty) params.set("difficulty", searchFilters.difficulty);
      if (searchFilters.status) params.set("status", searchFilters.status);
      params.set("limit", "20");
      params.set("offset", offset.toString());

      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) throw new Error("Search failed");

      const data: SearchResponse = await response.json();

      if (offset === 0) {
        setResults(data.results);
      } else {
        setResults(prev => [...prev, ...data.results]);
      }

      setPagination(data.pagination);

      // Update URL
      const urlParams = new URLSearchParams();
      if (searchQuery.trim()) urlParams.set("q", searchQuery);
      if (searchFilters.module) urlParams.set("module", searchFilters.module);
      if (searchFilters.difficulty) urlParams.set("difficulty", searchFilters.difficulty);
      if (searchFilters.status) urlParams.set("status", searchFilters.status);

      const newUrl = urlParams.toString() ? `/search?${urlParams.toString()}` : "/search";
      router.replace(newUrl, { scroll: false });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Initial search on mount
  useEffect(() => {
    const initialQuery = searchParams.get("q") || "";
    const initialFilters = {
      module: searchParams.get("module") || "",
      difficulty: searchParams.get("difficulty") || "",
      status: searchParams.get("status") || "",
    };
    setQuery(initialQuery);
    setFilters(initialFilters);
    performSearch(initialQuery, initialFilters);
  }, []); // Only run on mount

  const handleSearch = () => {
    performSearch(query, filters);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  const loadMore = () => {
    performSearch(query, filters, pagination.offset + pagination.limit);
  };

  const clearFilters = () => {
    const newFilters = { module: "", difficulty: "", status: "" };
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Lessons</h1>
          <p className="text-gray-600">Find the perfect lesson for your learning journey</p>
        </div>

        {/* Search Bar */}
        <Card className="mobile-card mb-6">
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search lessons, topics, or keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="text-base lg:text-lg"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} className="mobile-btn touch-target px-4 lg:px-6">
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 lg:gap-4">
            <select
              value={filters.module}
              onChange={(e) => handleFilterChange("module", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm touch-target mobile-focus"
            >
              <option value="">All Modules</option>
              <option value="dsa">Data Structures & Algorithms</option>
              <option value="machine-coding">Machine Coding Round</option>
              <option value="system-design">System Design</option>
              <option value="behavioral">Behavioral Interviews</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm touch-target mobile-focus"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm touch-target mobile-focus"
            >
              <option value="">All Lessons</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {(filters.module || filters.difficulty || filters.status) && (
              <Button variant="outline" onClick={clearFilters} size="sm" className="touch-target">
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {results.length > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Found {pagination.total} lesson{pagination.total !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {results.map((result) => (
            <Card key={result.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{result.module.emoji}</span>
                    <span className="text-sm text-gray-600">{result.module.title}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{result.chapter.title}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <a href={`/lessons/${result.id}`} className="hover:text-indigo-600">
                      {result.title}
                    </a>
                  </h3>

                  <p className="text-gray-600 mb-3 line-clamp-2">{result.description}</p>

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

                    {result.practiceLinksCount > 0 && (
                      <span>💻 {result.practiceLinksCount} practice problem{result.practiceLinksCount !== 1 ? "s" : ""}</span>
                    )}

                    {result.progress && (
                      <span>
                        {result.progress.completedAt ? "✅ Completed" :
                         result.progress.timeSpentSeconds > 0 ? "⏳ In Progress" : "📖 Not Started"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  <a
                    href={`/lessons/${result.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {result.progress?.completedAt ? "Review" : "Start"} →
                  </a>
                </div>
              </div>
            </Card>
          ))}

          {results.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching...</p>
            </div>
          )}

          {pagination.hasMore && !loading && (
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
