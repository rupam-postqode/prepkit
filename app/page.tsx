import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className={cn(
      "min-h-screen bg-white dark:bg-gray-900",
      "transition-colors duration-300"
    )}>
      <Header />

      {/* Hero Section */}
      <section className={cn(
        "relative py-20 sm:py-24 overflow-hidden",
        // Modern gradient background
        "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
        "dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900/20"
      )}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={cn(
              "text-4xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
            )}>
              Master Technical
              <span className={cn(
                "block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
                "dark:from-indigo-400 dark:to-purple-400"
              )}>
                Interviews
              </span>
            </h1>
            <p className={cn(
              "text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150"
            )}>
              Join thousands of developers who have cracked their dream jobs with our comprehensive interview preparation platform.
              Structured learning paths covering DSA, System Design, and Behavioral interviews.
            </p>
            <div className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
            )}>
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className={cn(
                    "text-lg px-8 py-3 shadow-xl",
                    "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                    "border-0 hover:scale-105 transition-all duration-300",
                    "shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                  )}
                >
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/paths">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={cn(
                    "text-lg px-8 py-3",
                    "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600",
                    "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                    "hover:text-indigo-700 dark:hover:text-indigo-300",
                    "hover:scale-105 transition-all duration-300"
                  )}
                >
                  Explore Modules
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="modules" className={cn(
        "py-20",
        "bg-white dark:bg-gray-900"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={cn(
              "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4",
              "animate-in fade-in-0 duration-700"
            )}>
              Comprehensive Learning Modules
            </h2>
            <p className={cn(
              "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto",
              "animate-in fade-in-0 duration-700 delay-150"
            )}>
              Structured curriculum designed by industry experts to help you master every aspect of technical interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className={cn(
              "p-6 text-center group",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "hover:shadow-xl hover:scale-105 hover:border-indigo-200 dark:hover:border-indigo-700",
              "transition-all duration-300",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
            )}>
              <div className={cn(
                "text-4xl mb-4 transition-transform duration-300 group-hover:scale-110",
                "filter drop-shadow-sm"
              )}>
                📚
              </div>
              <h3 className={cn(
                "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2",
                "transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              )}>
                Data Structures & Algorithms
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Master arrays, linked lists, trees, graphs, and dynamic programming with 60+ curated problems.
              </p>
            </Card>

            <Card className={cn(
              "p-6 text-center group",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "hover:shadow-xl hover:scale-105 hover:border-indigo-200 dark:hover:border-indigo-700",
              "transition-all duration-300",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100"
            )}>
              <div className={cn(
                "text-4xl mb-4 transition-transform duration-300 group-hover:scale-110",
                "filter drop-shadow-sm"
              )}>
                🎯
              </div>
              <h3 className={cn(
                "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2",
                "transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              )}>
                Machine Coding Round
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Practice building real-world applications under time constraints with CodeSandbox integration.
              </p>
            </Card>

            <Card className={cn(
              "p-6 text-center group",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "hover:shadow-xl hover:scale-105 hover:border-indigo-200 dark:hover:border-indigo-700",
              "transition-all duration-300",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200"
            )}>
              <div className={cn(
                "text-4xl mb-4 transition-transform duration-300 group-hover:scale-110",
                "filter drop-shadow-sm"
              )}>
                🏗️
              </div>
              <h3 className={cn(
                "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2",
                "transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              )}>
                System Design
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn to design scalable distributed systems with real-world examples and case studies.
              </p>
            </Card>

            <Card className={cn(
              "p-6 text-center group",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "hover:shadow-xl hover:scale-105 hover:border-indigo-200 dark:hover:border-indigo-700",
              "transition-all duration-300",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
            )}>
              <div className={cn(
                "text-4xl mb-4 transition-transform duration-300 group-hover:scale-110",
                "filter drop-shadow-sm"
              )}>
                💬
              </div>
              <h3 className={cn(
                "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2",
                "transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              )}>
                Behavioral Interviews
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Master STAR method, leadership stories, and communication skills for HR rounds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={cn(
        "py-20",
        // Modern gradient background
        "bg-gradient-to-r from-indigo-600 to-purple-600",
        "relative overflow-hidden"
      )}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Active Learners</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-white/80">Interview Questions</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={cn(
        "py-20",
        "bg-gray-50 dark:bg-gray-800/50"
      )}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={cn(
            "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4",
            "animate-in fade-in-0 duration-700"
          )}>
            Ready to Crack Your Dream Job?
          </h2>
          <p className={cn(
            "text-xl text-gray-600 dark:text-gray-300 mb-8",
            "animate-in fade-in-0 duration-700 delay-150"
          )}>
            Join our community of successful developers. Start with our free tier and upgrade when you&apos;re ready.
          </p>
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center",
            "animate-in fade-in-0 duration-700 delay-300"
          )}>
            <Link href="/signup">
              <Button 
                size="lg" 
                className={cn(
                  "text-lg px-8 py-3 shadow-xl",
                  "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                  "border-0 hover:scale-105 transition-all duration-300",
                  "shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                )}
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="outline" 
                size="lg" 
                className={cn(
                  "text-lg px-8 py-3",
                  "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600",
                  "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                  "hover:text-indigo-700 dark:hover:text-indigo-300",
                  "hover:scale-105 transition-all duration-300"
                )}
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
