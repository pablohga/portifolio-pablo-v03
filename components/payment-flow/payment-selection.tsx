"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: string; // Alterado para string porque os preços vêm como "0,00", "5,99", etc.
  popular: boolean;
  buttonText: string;
  features: string[];
}

export function PaymentSelection() {
  const router = useRouter();
  const { toast } = useToast();

  const [plans, setPlans] = useState<Plan[]>([]); // Estado inicial como um array vazio

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/payment-plans");
        const data = await response.json();

        // Garante que `data.plans` seja um array e o define no estado
        setPlans(Array.isArray(data.plans) ? data.plans : []);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans([]); // Define como array vazio em caso de erro
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelection = async (planId: string) => {
    console.log('planId', planId)
    // id da conta grtuita no stripe 678d59b6b00ec115aea40c53 
    if (planId === "6796bbdb9e2378cd53291bd5"/* "Grátis" || 'Free' || 'Gratis' */) {
      router.push("/auth/register?plan=free");
      return;
    }

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao processar a seleção do plano",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Renderiza os planos dinamicamente */}
      {plans.map((plan) => (
        <Card key={plan._id} className={plan.popular ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$ {plan.price}/mês</p>
            <p className="mt-2 text-muted-foreground">{plan.description}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              onClick={() => handlePlanSelection(plan._id)}
            >
              {plan.buttonText}
            </Button>
            {/* {plan._id} <br />
            {plan.name} */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
