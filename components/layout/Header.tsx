"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <header className="bg-white shadow-sm border-b safe-area">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center touch-target" onClick={closeMobileMenu}>
            <div className="text-2xl font-bold text-indigo-600">PrepKit</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Search
            </Link>
            {canViewJobs && (
              <Link
                href="/jobs"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Jobs
              </Link>
            )}
            <Link
              href="#modules"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Modules
            </Link>
            <Link
              href="#pricing"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
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
              className="touch-target p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {session && (
                <div className="px-3 py-2 text-sm text-gray-700 border-b border-gray-200">
                  Welcome, {session.user?.name}
                </div>
              )}

              <Link
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors touch-target"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>

              <Link
                href="/search"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors touch-target"
                onClick={closeMobileMenu}
              >
                Search
              </Link>

              {canViewJobs && (
                <Link
                  href="/jobs"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors touch-target"
                  onClick={closeMobileMenu}
                >
                  Jobs
                </Link>
              )}

              <Link
                href="#modules"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors touch-target"
                onClick={closeMobileMenu}
              >
                Modules
              </Link>

              <Link
                href="#pricing"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors touch-target"
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>

              <div className="border-t border-gray-200 pt-3 mt-3">
                {session ? (
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors touch-target"
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors touch-target"
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors touch-target text-center"
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
