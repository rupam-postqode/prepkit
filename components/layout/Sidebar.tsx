"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  Home,
  BookOpen,
  Briefcase,
  Users,
  BarChart3,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  type LucideIcon
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface Module {
  id: string;
  title: string;
  slug: string;
  emoji: string;
  _count?: {
    chapters: number;
  };
  chapters: {
    id: string;
    title: string;
    slug: string;
    lessons: {
      id: string;
      title: string;
      completed: boolean;
    }[];
  }[];
}

interface LearningPath {
  id: string;
  title: string;
  emoji: string;
  durationWeeks: number;
  currentWeek: number;
  currentDay: number;
  progressPercentage: number;
  lessonsByWeek: Record<string, Array<{
    id: string;
    title: string;
    completed: boolean;
    dayNumber: number;
  }>>;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [modules, setModules] = useState<Module[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedPath, setExpandedPath] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  const fetchNavigationData = async () => {
    try {
      // Only fetch learning content for non-admin users
      if (!isAdmin) {
        // Fetch modules
        const modulesResponse = await fetch("/api/navigation");
        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          setModules(modulesData);
        }

        // Fetch learning path progress
        const pathResponse = await fetch("/api/user/path-progress");
        if (pathResponse.ok) {
          const pathData = await pathResponse.json();
          if (pathData.enrolled) {
            setLearningPath({
              id: pathData.path.id,
              title: pathData.path.title,
              emoji: pathData.path.emoji,
              durationWeeks: pathData.path.durationWeeks,
              currentWeek: pathData.progress.currentWeek,
              currentDay: pathData.progress.currentDay,
              progressPercentage: pathData.progress.progressPercentage,
              lessonsByWeek: pathData.lessonsByWeek,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch navigation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchNavigationData();
    }
  }, [session, isAdmin]);

  // Refetch navigation data when window gains focus (user returns from path changes)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session && !isAdmin) {
        fetchNavigationData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session, isAdmin]);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const adminNavigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Settings,
      description: "Admin overview"
    },
    {
      name: "Learning Paths",
      href: "/admin/learning-paths",
      icon: BookOpen,
      description: "Manage learning paths"
    },
    {
      name: "Path Templates",
      href: "/admin/path-templates",
      icon: BookOpen,
      description: "Manage path templates"
    },
    {
      name: "Modules",
      href: "/admin/modules",
      icon: BookOpen,
      description: "Manage course modules"
    },
    {
      name: "Lessons",
      href: "/admin/lessons",
      icon: BookOpen,
      description: "Manage lessons"
    },
    {
      name: "Create Lesson",
      href: "/admin/lessons/create",
      icon: Plus,
      description: "Add new content"
    },
    {
      name: "Job Board",
      href: "/admin/jobs",
      icon: Briefcase,
      description: "Manage jobs"
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      description: "User management"
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      description: "View insights"
    },
  ];

  const userNavigation: Array<{
    name: string;
    href: string;
    icon: LucideIcon;
    description: string;
  }> = [
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      description: "Manage your account"
    },
  ];

  return (
    <div className={cn(
      // Base styles
      "flex flex-col h-full",
      
      // Modern design with glassmorphism
      "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
      "border-r border-gray-200/50 dark:border-gray-700/50",
      "shadow-sm",
      
      className
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-6",
        "border-b border-gray-200/50 dark:border-gray-700/50",
        "bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
      )}>
        <Link
          href={isAdmin ? "/admin" : "/dashboard"}
          className={cn(
            "flex items-center space-x-3 group transition-all duration-200",
            "hover:scale-105 hover:opacity-80"
          )}
        >
          <div className={cn(
            "w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl",
            "flex items-center justify-center transition-all duration-300",
            "shadow-lg shadow-indigo-500/25 group-hover:shadow-xl group-hover:shadow-indigo-500/30",
            "group-hover:scale-110"
          )}>
            <span className="text-white font-bold text-sm">PK</span>
          </div>
          <div>
            <h1 className={cn(
              "font-semibold text-gray-900 dark:text-gray-100",
              "transition-colors duration-200"
            )}>
              PrepKit
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isAdmin ? "Admin Panel" : "Interview Prep"}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {isAdmin ? (
          /* Admin Navigation */
          <div className="space-y-1">
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    // Base styles
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium",
                    "transition-all duration-200 group relative overflow-hidden",
                    
                    // Modern hover effects
                    "hover:scale-[1.02] hover:shadow-md",
                    
                    // Active state
                    isActive
                      ? cn(
                          "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
                          "border border-indigo-200/50 dark:border-indigo-700/50",
                          "shadow-sm shadow-indigo-500/10"
                        )
                      : cn(
                          "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                          "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                          "border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
                        )
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0 transition-all duration-200",
                    isActive 
                      ? "text-indigo-600 dark:text-indigo-400 scale-110" 
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:scale-105"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.description}
                    </div>
                  </div>
                  
                  {/* Subtle indicator for active state */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          /* User Navigation */
          <div className="space-y-4">

            {/* Learning Path */}
            {learningPath && (
              <div className="space-y-3">
                <div className="px-3">
                  <h3 className={cn(
                    "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                    "transition-colors duration-200"
                  )}>
                    Learning Path
                  </h3>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setExpandedPath(!expandedPath)}
                    className={cn(
                      // Base styles
                      "flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-left",
                      "transition-all duration-200 group relative overflow-hidden",
                      
                      // Modern hover effects
                      "hover:scale-[1.02] hover:shadow-md",
                      
                      // Colors
                      "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20",
                      "border border-indigo-200/50 dark:border-indigo-700/50",
                      "text-indigo-700 dark:text-indigo-300",
                      "shadow-sm shadow-indigo-500/10"
                    )}
                  >
                    <span className="text-xl transition-transform duration-200 group-hover:scale-110">
                      {learningPath.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{learningPath.title}</div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400">
                        Week {learningPath.currentWeek} of {learningPath.durationWeeks}
                      </div>
                    </div>
                    <div className={cn(
                      "transition-all duration-200",
                      expandedPath ? "rotate-180" : ""
                    )}>
                      <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </button>

                  {/* Progress Bar */}
                  <div className="px-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {Math.round(learningPath.progressPercentage)}%
                      </span>
                    </div>
                    <Progress 
                      value={learningPath.progressPercentage} 
                      className="h-2 bg-gray-100 dark:bg-gray-800"
                    />
                  </div>

                  {/* Expanded Content */}
                  {expandedPath && (
                    <div className="ml-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
                      {Object.entries(learningPath.lessonsByWeek)
                        .sort(([a], [b]) => {
                          const weekA = parseInt(a.split(' ')[1]);
                          const weekB = parseInt(b.split(' ')[1]);
                          return weekA - weekB;
                        })
                        .slice(0, 6) // Show first 6 weeks for better visibility
                        .map(([weekKey, lessons]) => (
                          <div key={weekKey} className="space-y-1">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              {weekKey}
                            </div>
                            <div className="space-y-1">
                              {lessons
                                .sort((a, b) => a.dayNumber - b.dayNumber)
                                .slice(0, 3) // Show only first 3 lessons per week
                                .map((lesson) => (
                                  <Link
                                    key={lesson.id}
                                    href={`/lessons/${lesson.id}`}
                                    className={cn(
                                      // Base styles
                                      "flex items-center space-x-2 px-3 py-2 text-xs rounded-lg transition-all duration-200",
                                      "hover:scale-[1.02] hover:shadow-sm",
                                      
                                      // Active state
                                      pathname === `/lessons/${lesson.id}`
                                        ? cn(
                                            "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
                                            "border border-indigo-200/50 dark:border-indigo-700/50"
                                          )
                                        : cn(
                                            "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                                            "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                          )
                                    )}
                                  >
                                    <div className={cn(
                                      "w-2 h-2 rounded-full transition-all duration-200",
                                      lesson.completed 
                                        ? "bg-green-500 shadow-sm shadow-green-500/30" 
                                        : "bg-blue-500 shadow-sm shadow-blue-500/30"
                                    )} />
                                    <span className="truncate flex-1">{lesson.title}</span>
                                  </Link>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator className="bg-gray-200/50 dark:bg-gray-700/50" />

            {/* Modules */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-3 pb-2 flex-shrink-0">
                <h3 className={cn(
                  "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                  "transition-colors duration-200"
                )}>
                  Modules
                </h3>
              </div>

              {loading ? (
                <div className="px-3 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-1">
                  <div className="space-y-1">
                    {modules.map((module) => {
                      const isModuleActive = module.chapters.some(chapter =>
                        chapter.lessons.some(lesson => pathname === `/lessons/${lesson.id}`)
                      );

                      return (
                        <div key={module.id}>
                          <button
                            onClick={() => toggleModule(module.id)}
                            className={cn(
                              // Base styles
                              "flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-left",
                              "transition-all duration-200 group relative overflow-hidden",
                              
                              // Modern hover effects
                              "hover:scale-[1.02] hover:shadow-md",
                              
                              // Active state
                              isModuleActive
                                ? cn(
                                    "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
                                    "border border-indigo-200/50 dark:border-indigo-700/50",
                                    "shadow-sm shadow-indigo-500/10"
                                  )
                                : cn(
                                    "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                                    "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                    "border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
                                  )
                            )}
                          >
                            <span className={cn(
                              "text-lg transition-transform duration-200 group-hover:scale-110",
                              isModuleActive && "scale-110"
                            )}>
                              {module.emoji}
                            </span>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="truncate font-medium">{module.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {module._count?.chapters || module.chapters?.length || 0} chapters
                              </div>
                            </div>
                            <div className={cn(
                              "transition-all duration-200",
                              expandedModules.has(module.id) ? "rotate-180" : ""
                            )}>
                              <ChevronDown className={cn(
                                "w-4 h-4 shrink-0",
                                isModuleActive 
                                  ? "text-indigo-600 dark:text-indigo-400" 
                                  : "text-gray-500 dark:text-gray-400"
                              )} />
                            </div>
                            
                            {/* Subtle indicator for active state */}
                            {isModuleActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                            )}
                          </button>

                          {/* Expanded Chapters */}
                          {expandedModules.has(module.id) && (
                            <div className="ml-6 mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                              {module.chapters.map((chapter) => (
                                <div key={chapter.id} className="space-y-1">
                                  <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {chapter.title}
                                  </div>
                                  <div className="space-y-1">
                                    {chapter.lessons.map((lesson) => (
                                      <Link
                                        key={lesson.id}
                                        href={`/lessons/${lesson.id}`}
                                        className={cn(
                                          // Base styles
                                          "flex items-center space-x-2 px-3 py-2 text-xs rounded-lg transition-all duration-200",
                                          "hover:scale-[1.02] hover:shadow-sm",
                                          
                                          // Active state
                                          pathname === `/lessons/${lesson.id}`
                                            ? cn(
                                                "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
                                                "border border-indigo-200/50 dark:border-indigo-700/50"
                                              )
                                            : cn(
                                                "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                                                "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                              )
                                        )}
                                      >
                                        <div className={cn(
                                          "w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200",
                                          lesson.completed 
                                            ? "bg-green-500 shadow-sm shadow-green-500/30" 
                                            : "bg-blue-500 shadow-sm shadow-blue-500/30"
                                        )} />
                                        <span className="truncate flex-1">{lesson.title}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Sign Out */}
      <div className={cn(
        "p-4 border-t border-gray-200/50 dark:border-gray-700/50",
        "bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
      )}>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className={cn(
            "w-full justify-start transition-all duration-200",
            "hover:scale-105 hover:shadow-md",
            "border-gray-200/50 dark:border-gray-700/50",
            "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400",
            "hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200/50 dark:hover:border-red-700/50"
          )}
        >
          <LogOut className="w-4 h-4 mr-2 transition-colors duration-200" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
