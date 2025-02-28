"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface SubscriptionInfoProps {
  user: any;
}

export function SubscriptionInfo({ user }: SubscriptionInfoProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t, ready } = useTranslation();

  const handleUpgrade = async (plan: string) => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No URL returned from Stripe");
      }
    } catch (error: any) {
      toast({
        title: t("Subscription.error"),
        description: error.message || t("Subscription.errorDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t("Subscription.title")}</h2>
        <p className="text-muted-foreground">{t("Subscription.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("Subscription.currentPlanFeatures")}</CardTitle>
              <CardDescription>{t("Subscription.currentPlanDescription")}</CardDescription>
            </div>
            <Badge variant={user.subscriptionTier === "premium" ? "default" : user.subscriptionTier === "paid" ? "secondary" : "outline"}>
              <Crown className="mr-1 h-4 w-4" />
              {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {getPlanFeatures(user.subscriptionTier).map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-primary">•</span>
                {feature}
              </li>
            ))}
          </ul>

          {user.subscriptionTier === "free" && (
            <div className="flex gap-4">
              <Button onClick={() => handleUpgrade("Paid")} className="w-full">
                {t("Subscription.upgradeToPaid")}
              </Button>
              <Button onClick={() => handleUpgrade("Premium")} className="w-full">
                {t("Subscription.upgradeToPremium")}
              </Button>
            </div>
          )}

          {user.subscriptionTier === "paid" && (
            <Button onClick={() => handleUpgrade("Premium")} className="w-full">
              {t("Subscription.upgradeToPremium")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const getPlanFeatures = (tier: string): string[] => {
  switch (tier) {
    case "free":
      return [
        "3 Categories",
        "3 Projects per Category",
        "Basic Portfolio Features",
        "Community Support",
      ];
    case "paid":
      return [
        "Unlimited Categories",
        "Unlimited Projects",
        "Advanced Portfolio Features",
        "Priority Support",
        "Custom Domain",
      ];
    case "premium":
      return [
        "Everything in Paid plan",
        "Client Management",
        "Financial Management",
        "Advanced Analytics",
        "Priority Support",
        "1-on-1 Consultation",
      ];
    default:
      return [];
  }
};
