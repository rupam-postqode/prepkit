"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setIsLoading(true);

    try {
      // Create Stripe checkout session
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "YEARLY" }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create payment session");
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to get payment URL");
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get 1 year access to comprehensive interview preparation
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🎉 Limited Time: ₹999 1 Year Access
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center shadow-2xl border-0 bg-white">
            <div className="mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                ₹999
              </div>
              <div className="text-lg text-gray-600 mb-4">
                One-time payment
              </div>
              <div className="text-sm text-green-600 font-medium">
                ✅ 1 year access - No recurring fees
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Complete DSA curriculum</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Machine coding practice</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">System design guides</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Behavioral interview prep</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Progress tracking</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Video content & tutorials</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Practice coding problems</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">1 year of updates</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handlePurchase}
              disabled={isLoading || status === "loading"}
              className="w-full py-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              {isLoading ? "Redirecting to Checkout..." :
               !session ? "Sign In to Purchase" :
               "Get 1 Year Access"}
            </Button>

            {!session && status !== "loading" && (
              <p className="text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login?redirect=/pricing")}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Sign in here
                </button>
              </p>
            )}

            <div className="mt-6 text-xs text-gray-500">
              Secure payment powered by Stripe • 14-day money-back guarantee
            </div>
          </Card>
        </div>

        {/* Value Proposition */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Why Choose PrepKit?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Structured Learning
              </h3>
              <p className="text-gray-600">
                Follow a proven roadmap from basics to advanced topics
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">💼</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Industry Focused
              </h3>
              <p className="text-gray-600">
                Content designed specifically for FAANG and top Indian companies
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Lifetime Access
              </h3>
              <p className="text-gray-600">
                Pay once, access for 1 full year. No recurring charges
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is this a subscription?
              </h3>
              <p className="text-gray-600">
                No! This is a one-time payment of ₹999 for 1 year access. No recurring charges.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What do I get access to?
              </h3>
              <p className="text-gray-600">
                Complete access to all current and future content including DSA, system design, machine coding, behavioral interviews, and video tutorials.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day money-back guarantee. If you're not satisfied, we'll refund your payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
