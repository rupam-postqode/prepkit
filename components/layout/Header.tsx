"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { interactive } from "@/lib/transitions";

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
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 safe-area">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center touch-target group" onClick={closeMobileMenu}>
            <div className="text-2xl font-bold text-primary transition-colors group-hover:text-primary/80">PrepKit</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link
              href="/dashboard"
              className={interactive.navItem + " px-4 py-2 text-sm font-medium rounded-lg"}
            >
              Dashboard
            </Link>
            <Link
              href="/search"
              className={interactive.navItem + " px-4 py-2 text-sm font-medium rounded-lg"}
            >
              Search
            </Link>
            {canViewJobs && (
              <Link
                href="/jobs"
                className={interactive.navItem + " px-4 py-2 text-sm font-medium rounded-lg"}
              >
                Jobs
              </Link>
            )}
            <Link
              href="/paths"
              className={interactive.navItem + " px-4 py-2 text-sm font-medium rounded-lg"}
            >
              Modules
            </Link>
            <Link
              href="/pricing"
              className={interactive.navItem + " px-4 py-2 text-sm font-medium rounded-lg"}
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 hidden lg:inline">
                  Welcome, {session.user?.name}
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="touch-target"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="touch-target">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="mobile-btn touch-target">
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
              className={interactive.navItem + " touch-target p-2 rounded-lg"}
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
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {session && (
                <div className="px-3 py-2 text-sm text-foreground border-b border-border">
                  Welcome, {session.user?.name}
                </div>
              )}

              <Link
                href="/dashboard"
                className={interactive.navItem + " block px-3 py-2 text-base font-medium rounded-lg touch-target"}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>

              <Link
                href="/search"
                className={interactive.navItem + " block px-3 py-2 text-base font-medium rounded-lg touch-target"}
                onClick={closeMobileMenu}
              >
                Search
              </Link>

              {canViewJobs && (
                <Link
                  href="/jobs"
                  className={interactive.navItem + " block px-3 py-2 text-base font-medium rounded-lg touch-target"}
                  onClick={closeMobileMenu}
                >
                  Jobs
                </Link>
              )}

              <Link
                href="/paths"
                className={interactive.navItem + " block px-3 py-2 text-base font-medium rounded-lg touch-target"}
                onClick={closeMobileMenu}
              >
                Modules
              </Link>

              <Link
                href="/pricing"
                className={interactive.navItem + " block px-3 py-2 text-base font-medium rounded-lg touch-target"}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>

              <div className="border-t border-border pt-3 mt-3">
                {session ? (
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className={interactive.navItem + " block w-full text-left px-3 py-2 text-base font-medium rounded-lg touch-target"}
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className={interactive.navItem + " block px-3 py-2 text-base font-medium rounded-lg touch-target"}
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors touch-target text-center"
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
