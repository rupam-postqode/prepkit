# Centralized Breadcrumb Navigation System Implementation

## Overview

This document outlines the implementation of a centralized breadcrumb navigation system that automatically generates breadcrumbs based on the current URL structure, eliminating the need for manual implementation in each page.

## System Architecture

### Core Components

1. **Route Configuration System** (`lib/breadcrumb-config.ts`)
2. **Enhanced Navigation Provider** (`components/providers/navigation-provider.tsx`)
3. **Automatic Breadcrumb Generator** (`lib/breadcrumb-generator.ts`)
4. **Updated Breadcrumb Component** (`components/ui/breadcrumb.tsx`)

## Implementation Details

### 1. Route Configuration System

```typescript
// lib/breadcrumb-config.ts
import { BreadcrumbItem } from "@/components/providers/navigation-provider";

export interface RouteConfig {
  pattern: string;
  breadcrumbs: BreadcrumbConfig[];
  dynamicData?: DynamicDataConfig;
}

export interface BreadcrumbConfig {
  label: string;
  href?: string;
  isDynamic?: boolean;
  dataKey?: string;
  transform?: (value: string) => string;
}

export interface DynamicDataConfig {
  endpoint?: string;
  mapping: Record<string, string>;
  cacheKey?: string;
}

export const ROUTE_CONFIGS: RouteConfig[] = [
  // Dashboard Routes
  {
    pattern: "/dashboard",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" }
    ]
  },
  
  // Learning Paths Routes
  {
    pattern: "/learning-paths",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Learning Paths", href: "/learning-paths" }
    ]
  },
  {
    pattern: "/learning-paths/[pathId]",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Learning Paths", href: "/learning-paths" },
      { label: "", isDynamic: true, dataKey: "title" }
    ],
    dynamicData: {
      endpoint: "/api/paths/{pathId}",
      mapping: { "title": "title" },
      cacheKey: "path-{pathId}"
    }
  },
  
  // Lessons Routes
  {
    pattern: "/lessons/[lessonId]",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "", isDynamic: true, dataKey: "moduleTitle", href: "/learning-paths" },
      { label: "", isDynamic: true, dataKey: "chapterTitle" },
      { label: "", isDynamic: true, dataKey: "title" }
    ],
    dynamicData: {
      endpoint: "/api/lessons/{lessonId}/breadcrumb",
      mapping: { 
        "title": "title",
        "chapterTitle": "chapter.title",
        "moduleTitle": "chapter.module.title"
      },
      cacheKey: "lesson-{lessonId}"
    }
  },
  
  // Admin Routes
  {
    pattern: "/admin",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" }
    ]
  },
  {
    pattern: "/admin/modules",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Modules", href: "/admin/modules" }
    ]
  },
  {
    pattern: "/admin/modules/[moduleId]",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Modules", href: "/admin/modules" },
      { label: "", isDynamic: true, dataKey: "title" }
    ],
    dynamicData: {
      endpoint: "/api/admin/modules/{moduleId}",
      mapping: { "title": "title" },
      cacheKey: "module-{moduleId}"
    }
  },
  {
    pattern: "/admin/learning-paths",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Learning Paths", href: "/admin/learning-paths" }
    ]
  },
  {
    pattern: "/admin/learning-paths/[pathId]",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Learning Paths", href: "/admin/learning-paths" },
      { label: "", isDynamic: true, dataKey: "title" }
    ],
    dynamicData: {
      endpoint: "/api/admin/learning-paths/{pathId}",
      mapping: { "title": "title" },
      cacheKey: "admin-path-{pathId}"
    }
  },
  {
    pattern: "/admin/learning-paths/[pathId]/schedule",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Learning Paths", href: "/admin/learning-paths" },
      { label: "", isDynamic: true, dataKey: "title", href: "/admin/learning-paths/{pathId}" },
      { label: "Schedule" }
    ],
    dynamicData: {
      endpoint: "/api/admin/learning-paths/{pathId}",
      mapping: { "title": "title" },
      cacheKey: "admin-path-{pathId}"
    }
  },
  
  // Profile Routes
  {
    pattern: "/profile",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Profile", href: "/profile" }
    ]
  },
  {
    pattern: "/profile/payment-history",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Profile", href: "/profile" },
      { label: "Payment History" }
    ]
  },
  
  // Other Routes
  {
    pattern: "/jobs",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Jobs", href: "/jobs" }
    ]
  },
  {
    pattern: "/paths",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Browse Paths", href: "/paths" }
    ]
  }
];

// Helper function to match routes
export function matchRoute(pathname: string): RouteConfig | null {
  // First try exact match
  const exactMatch = ROUTE_CONFIGS.find(config => config.pattern === pathname);
  if (exactMatch) return exactMatch;
  
  // Then try pattern matching for dynamic routes
  return ROUTE_CONFIGS.find(config => {
    const patternParts = config.pattern.split('/');
    const pathParts = pathname.split('/');
    
    if (patternParts.length !== pathParts.length) return false;
    
    return patternParts.every((part, index) => {
      return part.startsWith('[') && part.endsWith(']') || part === pathParts[index];
    });
  }) || null;
}

// Helper function to extract dynamic parameters
export function extractParams(pathname: string, pattern: string): Record<string, string> {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');
  const params: Record<string, string> = {};
  
  patternParts.forEach((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const paramName = part.slice(1, -1);
      params[paramName] = pathParts[index];
    }
  });
  
  return params;
}
```

### 2. Enhanced Navigation Provider

```typescript
// components/providers/navigation-provider.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { matchRoute, extractParams, RouteConfig } from "@/lib/breadcrumb-config";
import { fetchBreadcrumbData } from "@/lib/breadcrumb-generator";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface NavigationContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  goBack: () => void;
  canGoBack: boolean;
  setCanGoBack: (canGoBack: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoading: boolean;
  error: string | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [canGoBack, setCanGoBack] = useState(true);
  const [currentPage, setCurrentPage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate breadcrumbs based on current route
  const generateBreadcrumbs = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const routeConfig = matchRoute(path);
      
      if (!routeConfig) {
        // Fallback to basic path-based breadcrumbs
        const pathParts = path.split('/').filter(Boolean);
        const fallbackBreadcrumbs = pathParts.map((part, index) => {
          const href = '/' + pathParts.slice(0, index + 1).join('/');
          const label = part.charAt(0).toUpperCase() + part.slice(1);
          return { label, href: index < pathParts.length - 1 ? href : undefined };
        });
        setBreadcrumbs(fallbackBreadcrumbs);
        return;
      }

      // Extract dynamic parameters
      const params = extractParams(path, routeConfig.pattern);
      
      // Fetch dynamic data if needed
      let dynamicData: Record<string, any> = {};
      if (routeConfig.dynamicData) {
        dynamicData = await fetchBreadcrumbData(routeConfig, params);
      }

      // Generate breadcrumbs
      const generatedBreadcrumbs = routeConfig.breadcrumbs.map((config, index) => {
        let label = config.label;
        let href = config.href;

        // Handle dynamic labels
        if (config.isDynamic && config.dataKey) {
          const value = getNestedValue(dynamicData, config.dataKey);
          label = value || formatParamName(getParamFromKey(config.dataKey, params));
        }

        // Handle dynamic hrefs
        if (href && href.includes('{')) {
          href = replaceUrlParams(href, params);
        }

        // Apply transformation if provided
        if (config.transform && label) {
          label = config.transform(label);
        }

        return {
          label,
          href: index < routeConfig.breadcrumbs.length - 1 ? href : undefined,
          isActive: index === routeConfig.breadcrumbs.length - 1
        };
      });

      setBreadcrumbs(generatedBreadcrumbs);
    } catch (err) {
      console.error('Error generating breadcrumbs:', err);
      setError('Failed to generate breadcrumbs');
      
      // Fallback to basic breadcrumbs
      const pathParts = path.split('/').filter(Boolean);
      const fallbackBreadcrumbs = pathParts.map((part, index) => {
        const href = '/' + pathParts.slice(0, index + 1).join('/');
        const label = part.charAt(0).toUpperCase() + part.slice(1);
        return { label, href: index < pathParts.length - 1 ? href : undefined };
      });
      setBreadcrumbs(fallbackBreadcrumbs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper functions
  const getNestedValue = (obj: any, key: string): string => {
    return key.split('.').reduce((current, keyPart) => current?.[keyPart], obj);
  };

  const getParamFromKey = (key: string, params: Record<string, string>): string => {
    // Extract param name from dataKey (e.g., "title" -> "pathId" if it's a path route)
    const paramKeys = Object.keys(params);
    return paramKeys.find(param => key.includes(param)) || '';
  };

  const formatParamName = (param: string): string => {
    return param.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const replaceUrlParams = (url: string, params: Record<string, string>): string => {
    return url.replace(/\{([^}]+)\}/g, (match, key) => params[key] || match);
  };

  const setBreadcrumbsWithHistory = useCallback((newBreadcrumbs: BreadcrumbItem[]) => {
    setBreadcrumbs(newBreadcrumbs);
    setCanGoBack(newBreadcrumbs.length > 1);
  }, []);

  const goBack = () => {
    if (breadcrumbs.length > 1) {
      const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      if (previousBreadcrumb?.href) {
        window.location.href = previousBreadcrumb.href;
      }
    }
  };

  // Auto-generate breadcrumbs when route changes
  useEffect(() => {
    if (pathname) {
      generateBreadcrumbs(pathname);
    }
  }, [pathname, generateBreadcrumbs]);

  const value: NavigationContextType = {
    breadcrumbs,
    setBreadcrumbs: setBreadcrumbsWithHistory,
    goBack,
    canGoBack,
    setCanGoBack,
    currentPage,
    setCurrentPage,
    isLoading,
    error
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}
```

### 3. Breadcrumb Data Fetcher

```typescript
// lib/breadcrumb-generator.ts
import { RouteConfig } from "@/lib/breadcrumb-config";

// Simple cache to avoid redundant requests
const cache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchBreadcrumbData(
  routeConfig: RouteConfig, 
  params: Record<string, string>
): Promise<Record<string, any>> {
  if (!routeConfig.dynamicData) return {};

  const { endpoint, mapping, cacheKey } = routeConfig.dynamicData;
  
  // Generate cache key
  const finalCacheKey = cacheKey?.replace(/\{([^}]+)\}/g, (match, key) => params[key] || match);
  
  // Check cache first
  if (finalCacheKey && cache.has(finalCacheKey)) {
    const cached = cache.get(finalCacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  try {
    // Replace params in endpoint
    const finalEndpoint = endpoint?.replace(/\{([^}]+)\}/g, (match, key) => params[key] || match);
    
    if (!finalEndpoint) return {};

    const response = await fetch(finalEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch breadcrumb data: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the response data to breadcrumb format
    const mappedData: Record<string, any> = {};
    if (mapping) {
      Object.entries(mapping).forEach(([breadcrumbKey, dataPath]) => {
        mappedData[breadcrumbKey] = getNestedValue(data, dataPath);
      });
    }

    // Cache the result
    if (finalCacheKey) {
      cache.set(finalCacheKey, {
        data: mappedData,
        timestamp: Date.now()
      });
    }

    return mappedData;
  } catch (error) {
    console.error('Error fetching breadcrumb data:', error);
    return {};
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
```

### 4. Updated Breadcrumb Component

```typescript
// components/ui/breadcrumb.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/components/providers/navigation-provider";
import { Spinner } from "@/components/ui/spinner";

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const { breadcrumbs, isLoading, error } = useNavigation();

  if (error) {
    return (
      <div className={cn("flex items-center text-sm text-red-600", className)}>
        <span>Navigation error</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center space-x-2 text-sm", className)}>
        <Spinner size="sm" />
        <span className="text-gray-500">Loading navigation...</span>
      </div>
    );
  }

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm", className)}>
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center text-gray-500 hover:text-gray-700 transition-colors",
                  item.isActive && "text-gray-900 font-medium"
                )}
              >
                {index === 0 && (
                  <Home className="w-4 h-4 mr-2 text-gray-400" />
                )}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className={cn(
                "flex items-center text-gray-500",
                item.isActive && "text-gray-900 font-medium"
              )}>
                {index === 0 && (
                  <Home className="w-4 h-4 mr-2 text-gray-400" />
                )}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 5. API Endpoints for Dynamic Data

Create new API endpoints to support breadcrumb data fetching:

```typescript
// app/api/lessons/[lessonId]/breadcrumb/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        chapter: {
          select: {
            title: true,
            module: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: lesson.title,
      chapterTitle: lesson.chapter.title,
      moduleTitle: lesson.chapter.module.title,
    });
  } catch (error) {
    console.error("Breadcrumb API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Migration Steps

### 1. Update the Layout Component

Remove manual breadcrumb setting from individual pages and let the provider handle it automatically:

```typescript
// app/(dashboard)/layout.tsx
// No changes needed - the breadcrumb component will work automatically
```

### 2. Remove Manual Breadcrumb Implementations

Remove the following code from pages:
- `setBreadcrumbs` calls from `app/(dashboard)/learning-paths/[pathId]/page.tsx`
- Manual breadcrumb navigation from `app/(dashboard)/lessons/[lessonId]/page.tsx`
- Any other manual breadcrumb implementations

### 3. Update Provider Registration

Ensure the enhanced NavigationProvider is used in the app:

```typescript
// app/providers.tsx or app/layout.tsx
import { NavigationProvider } from "@/components/providers/navigation-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      {/* other providers */}
      {children}
    </NavigationProvider>
  );
}
```

## Benefits

1. **Zero Configuration**: Pages don't need to implement breadcrumbs manually
2. **Consistent UX**: Uniform breadcrumb behavior across the application
3. **Performance**: Cached data fetching and smart updates
4. **Maintainability**: Centralized configuration easy to update
5. **Flexibility**: Support for custom labels and transformations
6. **Fallback Handling**: Graceful degradation when data fetching fails

## Testing Strategy

1. **Static Routes**: Test all static routes for correct breadcrumb generation
2. **Dynamic Routes**: Test routes with dynamic parameters (lessons, paths, modules)
3. **Nested Routes**: Test complex nested routes (admin path schedules)
4. **Error Handling**: Test behavior when API calls fail
5. **Performance**: Verify caching works and reduces redundant requests
6. **Edge Cases**: Test with malformed URLs, missing data, etc.

## Future Enhancements

1. **User Preferences**: Allow users to customize breadcrumb behavior
2. **Analytics**: Track breadcrumb usage for UX insights
3. **Accessibility**: Enhanced ARIA labels and keyboard navigation
4. **Internationalization**: Support for multiple languages
5. **Mobile Optimization**: Better mobile breadcrumb display