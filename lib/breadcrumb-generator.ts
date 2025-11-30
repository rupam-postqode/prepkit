import { RouteConfig } from "@/lib/breadcrumb-config";

interface CacheEntry {
  data: Record<string, unknown>;
  timestamp: number;
}

// Simple cache to avoid redundant requests
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchBreadcrumbData(
  routeConfig: RouteConfig,
  params: Record<string, string>
): Promise<Record<string, unknown>> {
  if (!routeConfig.dynamicData) return {};

  const { endpoint, mapping, cacheKey } = routeConfig.dynamicData;
  
  // Generate cache key
  const finalCacheKey = cacheKey?.replace(/\{([^}]+)\}/g, (match, key) => params[key] || match);
  
  // Check cache first
  if (finalCacheKey && cache.has(finalCacheKey)) {
    const cached = cache.get(finalCacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
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
    
    // Map response data to breadcrumb format
    const mappedData: Record<string, unknown> = {};
    if (mapping) {
      Object.entries(mapping).forEach(([breadcrumbKey, dataPath]) => {
        mappedData[breadcrumbKey] = getNestedValue(data, dataPath);
      });
    }

    // Cache result
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

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// Clear cache function for testing or manual invalidation
export function clearBreadcrumbCache(): void {
  cache.clear();
}

// Get cache stats for monitoring
export function getBreadcrumbCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}