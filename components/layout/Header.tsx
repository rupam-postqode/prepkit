"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600">PrepKit</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="#modules"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Modules
            </Link>
            <Link
              href="#pricing"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {session.user?.name}
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
