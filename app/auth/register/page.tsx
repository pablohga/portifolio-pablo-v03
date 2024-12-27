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
  const email = searchParams.get("email");
  const plan = searchParams.get("plan");

  useEffect(() => {
    if (sessionId && email && plan) {
      verifyCheckoutSession(sessionId, email, plan);
    }
  }, [sessionId, email, plan]);

  async function verifyCheckoutSession(sessionId: string, email: string, plan: string) {
    try {
      const response = await fetch(
        `/api/stripe/verify-session?session_id=${sessionId}&email=${email}&plan=${plan}`
      );
      
      if (!response.ok) {
        throw new Error("Invalid checkout session");
      }

      const data = await response.json();
      
      if (data.status === 'paid') {
        toast({
          title: "Success",
          description: "Payment successful! You can now log in.",
        });
        router.push("/auth/signin");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify payment",
        variant: "destructive",
      });
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
            onSelectFreePlan={handleFreePlanRegistration}
          />
        </div>
      </div>
    );
  }

  return <RegisterForm onSubmit={handleFormSubmit} />;
}