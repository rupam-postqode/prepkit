import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Master Technical
              <span className="text-indigo-600 block">Interviews</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of developers who have cracked their dream jobs with our comprehensive interview preparation platform.
              Structured learning paths covering DSA, System Design, and Behavioral interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/paths">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Explore Modules
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="modules" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Learning Modules
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Structured curriculum designed by industry experts to help you master every aspect of technical interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Data Structures & Algorithms
              </h3>
              <p className="text-gray-600">
                Master arrays, linked lists, trees, graphs, and dynamic programming with 60+ curated problems.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Machine Coding Round
              </h3>
              <p className="text-gray-600">
                Practice building real-world applications under time constraints with CodeSandbox integration.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                System Design
              </h3>
              <p className="text-gray-600">
                Learn to design scalable distributed systems with real-world examples and case studies.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Behavioral Interviews
              </h3>
              <p className="text-gray-600">
                Master STAR method, leadership stories, and communication skills for HR rounds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-indigo-100">Active Learners</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-100">Interview Questions</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-indigo-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Crack Your Dream Job?
          </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of successful developers. Start with our free tier and upgrade when you're ready.
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
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
