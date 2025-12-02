"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { matchRoute, extractParams, BreadcrumbItem, RouteConfig } from "@/lib/breadcrumb-config";
import { fetchBreadcrumbData } from "@/lib/breadcrumb-generator";

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
      let dynamicData: Record<string, unknown> = {};
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
          label = value ? String(value) : formatParamName(getParamFromKey(config.dataKey, params));
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
  const getNestedValue = (obj: Record<string, unknown>, key: string): unknown => {
    return key.split('.').reduce((current: unknown, keyPart: string) => {
      if (current && typeof current === 'object' && keyPart in current) {
        return (current as Record<string, unknown>)[keyPart];
      }
      return undefined;
    }, obj);
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