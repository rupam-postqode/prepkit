'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, AlertTriangle, CreditCard, Shield, Clock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SessionData {
  id: string;
  type: string;
  difficulty: string;
  costCalculated: number;
  configuration: {
    duration: number;
    focusAreas?: string[];
    specificRequirements?: string;
  };
  questionsGenerated: Array<{
    text: string;
    difficulty: number;
  }>;
}

export default function PaymentPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSession();
  }, [params.sessionId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/interviews/${params.sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to load session');
      }
      const data = await response.json();
      setSession(data.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    setError(null);

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: params.sessionId,
          amount: session?.costCalculated,
          type: 'mock_interview',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.checkoutSessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setPaying(false);
    }
  };

  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Session not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>
        <p className="text-muted-foreground">
          Complete payment to start your mock interview
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
              <CardDescription>Review your interview setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Interview Type</span>
                <span className="font-medium">{formatType(session.type)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Difficulty</span>
                <Badge variant="outline">{session.difficulty}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">~{session.configuration.duration} minutes</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Questions</span>
                <span className="font-medium">{session.questionsGenerated?.length || 0} questions</span>
              </div>

              {session.configuration.focusAreas && session.configuration.focusAreas.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground block mb-2">Focus Areas</span>
                    <div className="flex flex-wrap gap-2">
                      {session.configuration.focusAreas.map((area, idx) => (
                        <Badge key={idx} variant="secondary">{area}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Secure Payment:</strong> Your payment is processed securely through Stripe. 
              We never store your card details.
            </AlertDescription>
          </Alert>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm">AI-generated questions tailored to your level</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Voice interview with AI interviewer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Instant performance report with scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Detailed feedback on strengths & weaknesses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Actionable recommendations for improvement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Full transcript of your interview</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Payment Card */}
        <div className="space-y-6">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Interview Fee</span>
                <span>₹{session.costCalculated}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Fee</span>
                <span>₹0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{session.costCalculated}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handlePayment}
                disabled={paying}
              >
                {paying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay ₹{session.costCalculated}
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>

          {/*  Refund Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Refund Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Full refund available if you cancel within 5 minutes of purchase 
                and before starting the interview.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
