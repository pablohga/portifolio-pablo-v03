"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/register-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { PaymentSelection } from "@/components/payment-flow/payment-selection";

export default function RegisterPage() {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const sessionId = searchParams.get("session_id");
  const email = searchParams.get("email");
  const plan = searchParams.get("plan");

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function verifyPayment(sessionId: string) {
    try {
      const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
      const data = await response.json();

      if (data.status !== 'complete') {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify payment",
        variant: "destructive",
      });
      router.push("/");
    }
  }

  async function handleRegistrationComplete(data: any) {
    setRegistrationData(data);
    setRegistrationComplete(true);
  }

  // If no email/plan and not coming from Stripe checkout, show plan selection
  if (!email && !sessionId && !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Select the plan that best fits your needs
            </p>
          </div>
          <PaymentSelection onSelectFreePlan={() => {}} />
        </div>
      </div>
    );
  }

  if (registrationComplete && registrationData) {
    /* console.log('registrationComplete: ', registrationComplete)
    console.log('registrationData: ', registrationData) */
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to Portify!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-lg">Your account has been created successfully!</p>
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <p>Email: {registrationData.user.email}</p>
                <p>Plan: {registrationData.user.subscriptionTier}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">You can now:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Create your professional portfolio
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Showcase your projects
                </li>
                {registrationData.subscriptionTier !== 'free' && (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Access premium features
                  </li>
                )}
              </ul>
            </div>

            <Button asChild className="w-full">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RegisterForm 
      initialEmail={email}
      initialPlan={plan}
      onComplete={handleRegistrationComplete}
    />
  );
}
