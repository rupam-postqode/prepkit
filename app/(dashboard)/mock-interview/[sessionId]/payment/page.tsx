'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Fetch session details
    fetch(`/api/interviews/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSessionData(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/payments/interview/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: sessionData.costCalculated * 100,
        currency: 'INR',
        name: 'PrepKit Mock Interview',
        description: `${sessionData.type} Interview - ${sessionData.difficulty}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/interview/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              sessionId
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            // Navigate to interview session
            router.push(`/mock-interview/${sessionId}`);
          }
        },
        prefill: {
          email: '', // Add user email
          contact: '' // Add user phone
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setProcessing(false);
    } catch (error) {
      console.error('Payment error:', error);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="container max-w-2xl mx-auto py-16">
        <Card>
          <CardHeader>
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>Session Not Found</CardTitle>
            <CardDescription>The interview session could not be found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <div className="container max-w-2xl mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Complete Payment</h1>
          <p className="text-muted-foreground mt-2">
            Pay to start your mock interview session
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <p className="font-medium capitalize">{sessionData.type.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Difficulty:</span>
                <p className="font-medium capitalize">{sessionData.difficulty.toLowerCase()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium">~20-30 minutes</p>
              </div>
              <div>
                <span className="text-muted-foreground">Questions:</span>
                <p className="font-medium">{JSON.parse(sessionData.questionsGenerated as any).length} questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span>Interview Fee</span>
              <span className="font-semibold">₹{sessionData.costCalculated}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Platform Fee</span>
              <span>Included</span>
            </div>
            <div className="pt-4 border-t flex items-center justify-between">
              <span className="text-2xl font-bold">Total</span>
              <span className="text-3xl font-bold">₹{sessionData.costCalculated}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Pay ₹{sessionData.costCalculated} & Start Interview
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Secure payment powered by Razorpay
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
