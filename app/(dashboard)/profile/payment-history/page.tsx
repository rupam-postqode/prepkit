"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CreditCard, RefreshCw, IndianRupee } from "lucide-react";

interface Payment {
  id: string;
  razorpayPaymentId: string | null;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  createdAt: string;
  refunds: Refund[];
}

interface Refund {
  id: string;
  razorpayRefundId: string;
  amount: number;
  currency: string;
  status: string;
  reason: string | null;
  processedAt: string;
}

export default function PaymentHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login?redirect=/profile/payment-history");
      return;
    }

    fetchPaymentHistory();
  }, [session, status, router]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/payments/history");

      if (!response.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const data = await response.json();
      setPayments(data.payments || []);
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError("Failed to load payment history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2); // Convert from paise to rupees
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      CREATED: { variant: "secondary" as const, label: "Created" },
      AUTHORIZED: { variant: "secondary" as const, label: "Authorized" },
      CAPTURED: { variant: "default" as const, label: "Completed" },
      FAILED: { variant: "destructive" as const, label: "Failed" },
      REFUNDED: { variant: "outline" as const, label: "Refunded" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.CREATED;

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const handleRefund = async (paymentId: string) => {
    if (!confirm("Are you sure you want to request a refund for this payment?")) {
      return;
    }

    try {
      const response = await fetch("/api/payments/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          reason: "Customer requested refund",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Refund request submitted successfully!");
        fetchPaymentHistory(); // Refresh the list
      } else {
        alert(data.error || "Failed to process refund request");
      }
    } catch (error) {
      console.error("Refund error:", error);
      alert("Failed to process refund request. Please try again.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8" />
            <span className="ml-2 text-gray-600">Loading payment history...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Payment History</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchPaymentHistory}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">View your past payments and refunds</p>
        </div>

        {/* Payment List */}
        {payments.length === 0 ? (
          <Card className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-600 mb-4">
              You haven't made any payments yet. Start your learning journey today!
            </p>
            <Button onClick={() => router.push("/pricing")}>
              View Pricing Plans
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <Card key={payment.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <IndianRupee className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        ₹{formatAmount(payment.amount)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Order ID: {payment.razorpayOrderId}
                      </p>
                      {payment.razorpayPaymentId && (
                        <p className="text-sm text-gray-600">
                          Payment ID: {payment.razorpayPaymentId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(payment.status)}
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Method: {payment.method || "N/A"}</span>
                  <span>Currency: {payment.currency}</span>
                </div>

                {/* Refunds Section */}
                {payment.refunds && payment.refunds.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Refunds</h4>
                      {payment.refunds.map((refund) => (
                        <div key={refund.id} className="bg-red-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-red-900">
                                -₹{formatAmount(refund.amount)}
                              </p>
                              <p className="text-sm text-red-700">
                                Refund ID: {refund.razorpayRefundId}
                              </p>
                              {refund.reason && (
                                <p className="text-sm text-red-600">
                                  Reason: {refund.reason}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-red-700 border-red-300">
                                {refund.status}
                              </Badge>
                              <p className="text-sm text-red-600 mt-1">
                                {formatDate(refund.processedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Actions */}
                {payment.status === "CAPTURED" && (!payment.refunds || payment.refunds.length === 0) && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefund(payment.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Request Refund
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {payments.length > 0 && (
          <Card className="mt-8 p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Payments:</span>
                <span className="ml-2 font-medium">
                  {payments.length}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Successful Payments:</span>
                <span className="ml-2 font-medium">
                  {payments.filter(p => p.status === "CAPTURED").length}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Total Spent:</span>
                <span className="ml-2 font-medium">
                  ₹{formatAmount(payments
                    .filter(p => p.status === "CAPTURED")
                    .reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
