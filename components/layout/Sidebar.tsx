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

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
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
      } catch (error) {
        console.error("Failed to fetch navigation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchNavigation();
    }
  }, [session]);

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

  const isAdmin = session?.user?.role === "ADMIN";

  const adminNavigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Settings,
      description: "Admin overview"
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
      "flex flex-col h-full bg-card border-r border-border shadow-sm",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Link
          href={isAdmin ? "/admin" : "/dashboard"}
          className="flex items-center space-x-3 group"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition-colors">
            <span className="text-primary-foreground font-bold text-sm">PK</span>
          </div>
          <div>
            <h1 className="font-semibold text-foreground">PrepKit</h1>
            <p className="text-xs text-muted-foreground">
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
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground/70 truncate">
                      {item.description}
                    </div>
                  </div>
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
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Learning Path
                  </h3>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setExpandedPath(!expandedPath)}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-accent/50 transition-colors group"
                  >
                    <span className="text-lg">{learningPath.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{learningPath.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Week {learningPath.currentWeek} of {learningPath.durationWeeks}
                      </div>
                    </div>
                    {expandedPath ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Progress Bar */}
                  <div className="px-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(learningPath.progressPercentage)}%</span>
                    </div>
                    <Progress value={learningPath.progressPercentage} className="h-2" />
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
                        .slice(0, 3) // Show only first 3 weeks for space
                        .map(([weekKey, lessons]) => (
                          <div key={weekKey} className="space-y-1">
                            <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
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
                                      "flex items-center space-x-2 px-3 py-2 text-xs rounded-md transition-colors",
                                      pathname === `/lessons/${lesson.id}`
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      lesson.completed ? "bg-green-500" : "bg-blue-500"
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

            <Separator />

            {/* Modules */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-3 pb-2 flex-shrink-0">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Modules
                </h3>
              </div>

              {loading ? (
                <div className="px-3 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-muted rounded-lg"></div>
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
                              "flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                              isModuleActive
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            )}
                          >
                            <span className="text-lg">{module.emoji}</span>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="truncate">{module.title}</div>
                              <div className="text-xs text-muted-foreground/70">
                                {module._count?.chapters || module.chapters?.length || 0} chapters
                              </div>
                            </div>
                            {expandedModules.has(module.id) ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>

                          {/* Expanded Chapters */}
                          {expandedModules.has(module.id) && (
                            <div className="ml-6 mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                              {module.chapters.map((chapter) => (
                                <div key={chapter.id} className="space-y-1">
                                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {chapter.title}
                                  </div>
                                  <div className="space-y-1">
                                    {chapter.lessons.map((lesson) => (
                                      <Link
                                        key={lesson.id}
                                        href={`/lessons/${lesson.id}`}
                                        className={cn(
                                          "flex items-center space-x-2 px-3 py-2 text-xs rounded-md transition-colors",
                                          pathname === `/lessons/${lesson.id}`
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                        )}
                                      >
                                        <div className={cn(
                                          "w-2 h-2 rounded-full flex-shrink-0",
                                          lesson.completed ? "bg-green-500" : "bg-blue-500"
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
      <div className="p-4 border-t border-border">
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
