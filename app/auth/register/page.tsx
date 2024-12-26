"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const email = searchParams.get("email");

  // Função para verificar a sessão do Stripe
  async function verifyCheckoutSession(sessionId: string) {
    try {
      const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
      if (!response.ok) {
        throw new Error("Invalid checkout session");
      }
    } catch (error) {
      console.error("Error verifying checkout session:", error);
    }
  }

  // Executa a verificação da sessão do Stripe
  useEffect(() => {
    if (sessionId) {
      verifyCheckoutSession(sessionId);
    }
  }, [sessionId]);

  return <RegisterForm prefilledEmail={email} />;
}
