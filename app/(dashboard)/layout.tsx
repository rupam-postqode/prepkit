"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useNavigation } from "@/components/providers/navigation-provider";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { breadcrumbs } = useNavigation();

  // Debug logs to track layout rendering
  console.log('[DashboardLayout] Render - session status:', status, 'breadcrumbs length:', breadcrumbs.length);

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) router.push("/login");
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-white dark:bg-gray-900"
      )}>
        <div className={cn(
          "relative",
          "animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700",
          "border-t-indigo-600 dark:border-t-indigo-400"
        )}>
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"
          )} />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className={cn(
      "h-screen overflow-hidden flex",
      // Modern gradient background
      "bg-gradient-to-br from-gray-50 via-white to-gray-50",
      "dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
    )}>
      <Sidebar className="w-72 flex-shrink-0" />
      
      <main className={cn(
        "flex-1 overflow-auto relative",
        "backdrop-blur-sm"
      )}>
        {/* Modern header with glassmorphism */}
        <div className={cn(
          "sticky top-0 z-10",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
          "border-b border-gray-200/50 dark:border-gray-700/50",
          "px-6 py-4 shadow-sm"
        )}>
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
          </div>
        </div>
        
        {/* Main content area */}
        <div className={cn(
          "p-6 max-w-7xl mx-auto",
          "animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}
