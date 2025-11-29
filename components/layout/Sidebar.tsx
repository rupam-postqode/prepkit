"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Data Structures & Algorithms",
      href: "/modules/dsa",
      icon: "📚",
      children: [
        { name: "Arrays & Strings", href: "/modules/dsa/arrays" },
        { name: "Linked Lists", href: "/modules/dsa/linked-lists" },
        { name: "Stacks & Queues", href: "/modules/dsa/stacks-queues" },
        { name: "Trees & Graphs", href: "/modules/dsa/trees-graphs" },
        { name: "Dynamic Programming", href: "/modules/dsa/dp" },
      ],
    },
    {
      name: "Machine Coding Round",
      href: "/modules/machine-coding",
      icon: "🎯",
      children: [
        { name: "Frontend Challenges", href: "/modules/machine-coding/frontend" },
        { name: "Backend Services", href: "/modules/machine-coding/backend" },
        { name: "Full-Stack Projects", href: "/modules/machine-coding/fullstack" },
      ],
    },
    {
      name: "System Design",
      href: "/modules/system-design",
      icon: "🏗️",
      children: [
        { name: "Fundamentals", href: "/modules/system-design/fundamentals" },
        { name: "Scalability", href: "/modules/system-design/scalability" },
        { name: "Real-World Systems", href: "/modules/system-design/real-world" },
      ],
    },
    {
      name: "Behavioral Interviews",
      href: "/modules/behavioral",
      icon: "💬",
      children: [
        { name: "STAR Method", href: "/modules/behavioral/star" },
        { name: "Common Questions", href: "/modules/behavioral/questions" },
        { name: "Negotiation", href: "/modules/behavioral/negotiation" },
      ],
    },
  ];

  return (
    <div className={cn("bg-white border-r border-gray-200", className)}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <Link href="/" className="flex items-center">
            <div className="text-xl font-bold text-indigo-600">PrepKit</div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
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

              {/* Sub-navigation */}
              {item.children && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "block px-3 py-1 text-xs font-medium rounded-md transition-colors",
                        pathname === child.href
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2025 PrepKit
          </div>
        </div>
      </div>
    </div>
  );
}
