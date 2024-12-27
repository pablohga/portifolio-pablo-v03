"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/register-form";
import { PaymentSelection } from "@/components/payment-flow/payment-selection";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function RegisterPage() {
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      handlePaymentSuccess(sessionId);
    }
  }, [sessionId]);

  async function handlePaymentSuccess(sessionId: string) {
    try {
      // Get stored registration data
      const pendingRegistration = sessionStorage.getItem('pendingRegistration');
      if (!pendingRegistration) {
        throw new Error('Registration data not found');
      }

      const { email, name, password, plan } = JSON.parse(pendingRegistration);

      // Verify payment status
      const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
      const data = await response.json();

      if (data.status === 'complete') {
        // Create user account
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            subscriptionTier: plan
          }),
        });

        if (!registerResponse.ok) {
          throw new Error('Failed to create user account');
        }

        // Clear stored registration data
        sessionStorage.removeItem('pendingRegistration');

        toast({
          title: "Success",
          description: "Account created successfully! You can now log in.",
        });

        router.push("/auth/signin");
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete registration",
        variant: "destructive",
      });
      router.push("/auth/register");
    }
  }

  async function handleFormSubmit(data: any) {
    setFormData(data);
    setShowPlanSelection(true);
  }

  async function handleFreePlanRegistration() {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          subscriptionTier: 'free'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      router.push("/auth/signin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  if (showPlanSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
          <PaymentSelection 
            email={formData.email}
            name={`${formData.firstName} ${formData.lastName}`}
            password={formData.password}
            onSelectFreePlan={handleFreePlanRegistration}
          />
        </div>
      </div>
    );
  }

  return <RegisterForm onSubmit={handleFormSubmit} />;
}
