"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

interface Module {
  id: string;
  title: string;
  slug: string;
  emoji: string;
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

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await fetch("/api/navigation");
        if (response.ok) {
          const data = await response.json();
          setModules(data);
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
      name: "Admin Dashboard",
      href: "/admin",
      icon: "⚙️",
    },
    {
      name: "Manage Modules",
      href: "/admin/modules",
      icon: "📚",
    },
    {
      name: "Manage Lessons",
      href: "/admin/lessons",
      icon: "📖",
    },
    {
      name: "Create Lesson",
      href: "/admin/lessons/create",
      icon: "📝",
    },
    {
      name: "Job Board",
      href: "/admin/jobs",
      icon: "💼",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: "👥",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: "📊",
    },
  ];

  return (
    <div className={cn("bg-white border-r border-gray-200", className)}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center">
            <div className="text-xl font-bold text-indigo-600">PrepKit</div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === "/dashboard"
                ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className="mr-3 text-lg">🏠</span>
            Dashboard
          </Link>

          {/* Jobs */}
          <Link
            href="/jobs"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === "/jobs" || pathname?.startsWith("/jobs/")
                ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className="mr-3 text-lg">💼</span>
            Job Board
          </Link>

          {/* Dynamic Modules */}
          {loading ? (
            <div className="px-3 py-2">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            modules.map((module) => (
              <div key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors text-left",
                    pathname?.includes(`/modules/${module.slug}`)
                      ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="mr-3 text-lg">{module.emoji}</span>
                  <span className="flex-1">{module.title}</span>
                  <span className="ml-2 text-xs">
                    {expandedModules.has(module.id) ? "▼" : "▶"}
                  </span>
                </button>

                {/* Chapters and Lessons */}
                {expandedModules.has(module.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {module.chapters.map((chapter) => (
                      <div key={chapter.id}>
                        <div className="px-3 py-1 text-xs font-medium text-gray-600 uppercase tracking-wide">
                          {chapter.title}
                        </div>
                        <div className="ml-3 space-y-1">
                          {chapter.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={`/lessons/${lesson.id}`}
                              className={cn(
                                "flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors",
                                pathname === `/lessons/${lesson.id}`
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              )}
                            >
                              <span className="mr-2 text-xs">
                                {lesson.completed ? "✅" : "○"}
                              </span>
                              {lesson.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Admin
              </div>
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href || pathname?.startsWith(item.href + "/")
                      ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Footer with Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="text-xs text-gray-500 text-center mb-2">
              Signed in as {session?.user?.name}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
