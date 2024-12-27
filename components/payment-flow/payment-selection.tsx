import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentSelectionProps {
  email: string;
  name: string;
  password: string;
  onSelectFreePlan: () => void;
}

export function PaymentSelection({ email, name, password, onSelectFreePlan }: PaymentSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlanSelection = async (plan: string) => {
    try {
      setIsLoading(true);

      if (plan === 'free') {
        onSelectFreePlan();
        return;
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan,
          email,
          name,
          password
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process plan selection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$0/mês</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              3 Categorias
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              3 Projetos por Categoria
            </li>
          </ul>
          <Button 
            className="mt-6 w-full" 
            onClick={() => handlePlanSelection('free')}
            disabled={isLoading}
          >
            Começar Grátis
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$29,90/mês</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Categorias Ilimitadas
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Projetos Ilimitados
            </li>
          </ul>
          <Button 
            className="mt-6 w-full" 
            onClick={() => handlePlanSelection('paid')}
            disabled={isLoading}
          >
            Assinar Plano Paid
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$79,90/mês</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Tudo do Plano Paid
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Gestão de Clientes
            </li>
          </ul>
          <Button 
            className="mt-6 w-full" 
            onClick={() => handlePlanSelection('premium')}
            disabled={isLoading}
          >
            Assinar Plano Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}