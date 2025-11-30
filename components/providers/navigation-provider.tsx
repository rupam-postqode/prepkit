"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [canGoBack, setCanGoBack] = useState(true);
  const [currentPage, setCurrentPage] = useState("");

  const setBreadcrumbsWithHistory = (newBreadcrumbs: BreadcrumbItem[]) => {
    setBreadcrumbs(newBreadcrumbs);
    // Update canGoBack based on breadcrumb history
    setCanGoBack(newBreadcrumbs.length > 1);
  };

  const goBack = () => {
    if (breadcrumbs.length > 1) {
      // Navigate to previous breadcrumb
      const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      if (previousBreadcrumb?.href) {
        window.location.href = previousBreadcrumb.href;
      }
    }
  };

  const value: NavigationContextType = {
    breadcrumbs,
    setBreadcrumbs: setBreadcrumbsWithHistory,
    goBack,
    canGoBack,
    setCanGoBack,
    currentPage,
    setCurrentPage,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}