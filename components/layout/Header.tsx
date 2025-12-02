"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasJobAccess, setHasJobAccess] = useState(false);
  const [canViewJobs, setCanViewJobs] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (session?.user) {
        try {
          // Check if user can manage jobs (post jobs)
          const manageResponse = await fetch('/api/admin/jobs');
          setHasJobAccess(manageResponse.ok);

          // Check if user can view jobs
          const viewResponse = await fetch('/api/jobs');
          setCanViewJobs(viewResponse.ok);
        } catch (error) {
          setHasJobAccess(false);
          setCanViewJobs(false);
        }
      } else {
        setHasJobAccess(false);
        setCanViewJobs(false);
      }
    };

    checkAccess();
  }, [session]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      // Base styles
      "sticky top-0 z-50 w-full backdrop-blur-sm",
      
      // Modern design
      "bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50",
      "shadow-sm",
      
      // Safe area
      "safe-area-inset-top"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              "flex items-center space-x-2 transition-colors duration-200",
              "hover:opacity-80"
            )}
            onClick={closeMobileMenu}
          >
            <div className={cn(
              "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent",
              "transition-all duration-300"
            )}>
              PrepKit
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/search"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              Search
            </Link>
            {canViewJobs && (
              <Link
                href="/jobs"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                )}
              >
                Jobs
              </Link>
            )}
            <Link
              href="/paths"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              Modules
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading...</div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  )}
                >
                  <div className="flex items-center space-x-2 cursor-pointer transition-colors duration-200 hover:opacity-80">
                    <Avatar className="h-8 w-8 border-2 border-indigo-200 dark:border-indigo-700">
                      {session.user.image ? (
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name || ""}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-100">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {session.user.name}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/profile" className="block w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/profile/payment-history" className="block w-full">
                      Payment History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              )}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={cn(
            "md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900",
            "border-b border-gray-200 dark:border-gray-700",
            "shadow-lg backdrop-blur-sm",
            "animate-in slide-in-from-top-2 duration-200"
          )}>
            <div className="px-4 py-3 space-y-2">
              {session && (
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                  Welcome, {session.user?.name}
                </div>
              )}

              <Link
                href="/dashboard"
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                )}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>

              <Link
                href="/search"
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                )}
                onClick={closeMobileMenu}
              >
                Search
              </Link>

              {canViewJobs && (
                <Link
                  href="/jobs"
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                    "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  )}
                  onClick={closeMobileMenu}
                >
                  Jobs
                </Link>
              )}

              <Link
                href="/paths"
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                )}
                onClick={closeMobileMenu}
              >
                Modules
              </Link>

              <Link
                href="/pricing"
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                )}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                {session ? (
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className={cn(
                      "block w-full text-left px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                      "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
                      "hover:bg-red-50 dark:hover:bg-red-900/20",
                      "border border-transparent hover:border-red-200 dark:hover:border-red-700"
                    )}
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className={cn(
                        "block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                        "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      )}
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className={cn(
                        "block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                        "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300",
                        "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                        "border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700"
                      )}
                      onClick={closeMobileMenu}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
