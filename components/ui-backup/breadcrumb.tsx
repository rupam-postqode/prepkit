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
