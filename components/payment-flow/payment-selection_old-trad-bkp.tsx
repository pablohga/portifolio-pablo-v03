"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentSelectionProps {
  onSelectFreePlan: () => void;
}

export function PaymentSelection({ /* onSelectFreePlan */ }: PaymentSelectionProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handlePlanSelection = async (plan: string) => {
    if (plan === 'free') {
      router.push('/auth/register?plan=free');
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
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
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$0/month</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              3 Categories
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              3 Projects by category
            </li>
          </ul>
          <Button 
            className="mt-6 w-full" 
            onClick={() => handlePlanSelection('free')}
          >
            Start free
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$29,90/month</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Unlimited Categories
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Unlimited Projects
            </li>
          </ul>
          <Button 
            className="mt-6 w-full" 
            onClick={() => handlePlanSelection('paid')}
          >
            Subscribe PAID
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$79,90/month</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              All of the Paid plan
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Customer management
            </li>
          </ul>
          <Button 
            className="mt-6 w-full" 
            onClick={() => handlePlanSelection('premium')}
          >
            Premium plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
