"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      // Modern gradient background
      "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
      "dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900/20",
      "py-12 px-4 sm:px-6 lg:px-8"
    )}>
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full space-y-8 relative">
        <Card className={cn(
          // Modern glassmorphism effect
          "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
          "border border-gray-200/50 dark:border-gray-700/50",
          "shadow-xl shadow-gray-900/10 dark:shadow-black/20",
          "animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
        )}>
          <CardHeader className="space-y-1 pb-6">
            <div className="text-center mb-4">
              <div className={cn(
                "inline-flex items-center justify-center w-16 h-16 rounded-2xl",
                "bg-gradient-to-br from-indigo-500 to-purple-600",
                "shadow-lg shadow-indigo-500/25 mb-4"
              )}>
                <span className="text-white font-bold text-xl">PK</span>
              </div>
            </div>
            <CardTitle className={cn(
              "text-2xl font-bold text-center text-gray-900 dark:text-gray-100",
              "animate-in fade-in-0 duration-700 delay-150"
            )}>
              Sign in to PrepKit
            </CardTitle>
            <CardDescription className={cn(
              "text-center text-gray-600 dark:text-gray-400",
              "animate-in fade-in-0 duration-700 delay-200"
            )}>
              Or{" "}
              <Link
                href="/signup"
                className={cn(
                  "font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
                  "transition-colors duration-200 hover:underline"
                )}
              >
                create a new account
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className={cn(
                  "animate-in fade-in-0 duration-700 delay-300"
                )}>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={cn(
                      "transition-all duration-200",
                      "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      "hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={cn(
                  "animate-in fade-in-0 duration-700 delay-400"
                )}>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={cn(
                      "transition-all duration-200",
                      "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      "hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
 
              {error && (
                <div className={cn(
                  "text-sm text-red-600 dark:text-red-400 text-center",
                  "bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800",
                  "animate-in fade-in-0 duration-300"
                )}>
                  {error}
                </div>
              )}
 
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full shadow-lg",
                  "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                  "border-0 hover:scale-105 transition-all duration-300",
                  "shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30",
                  "animate-in fade-in-0 duration-700 delay-500"
                )}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional links */}
        <div className={cn(
          "text-center space-y-4",
          "animate-in fade-in-0 duration-700 delay-600"
        )}>
          <Link
            href="/forgot-password"
            className={cn(
              "text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400",
              "transition-colors duration-200 hover:underline"
            )}
          >
            Forgot your password?
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className={cn(
                "font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
                "transition-colors duration-200 hover:underline"
              )}
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
