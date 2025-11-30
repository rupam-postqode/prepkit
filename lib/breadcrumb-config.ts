export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

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
  {
    pattern: "/admin/lessons",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Lessons", href: "/admin/lessons" }
    ]
  },
  {
    pattern: "/admin/lessons/create",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Lessons", href: "/admin/lessons" },
      { label: "Create Lesson" }
    ]
  },
  {
    pattern: "/admin/modules/create",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Modules", href: "/admin/modules" },
      { label: "Create Module" }
    ]
  },
  {
    pattern: "/admin/learning-paths/create",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Learning Paths", href: "/admin/learning-paths" },
      { label: "Create Learning Path" }
    ]
  },
  {
    pattern: "/admin/users",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Users", href: "/admin/users" }
    ]
  },
  {
    pattern: "/admin/analytics",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Analytics", href: "/admin/analytics" }
    ]
  },
  {
    pattern: "/admin/jobs",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Jobs", href: "/admin/jobs" }
    ]
  },
  {
    pattern: "/admin/path-templates",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
      { label: "Path Templates", href: "/admin/path-templates" }
    ]
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
  },
  {
    pattern: "/pricing",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Pricing", href: "/pricing" }
    ]
  },
  {
    pattern: "/contact",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Contact", href: "/contact" }
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