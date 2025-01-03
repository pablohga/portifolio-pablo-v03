"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check } from "lucide-react";
import Link from "next/link";

interface SubscriptionInfoProps {
  user: any;
}

export function SubscriptionInfo({ user }: SubscriptionInfoProps) {
  const planFeatures = {
    free: [
      "3 Categories",
      "3 Projects per Category",
      "Basic Portfolio Features",
      "Community Support",
    ],
    paid: [
      "Unlimited Categories",
      "Unlimited Projects",
      "Advanced Portfolio Features",
      "Priority Support",
      "Custom Domain",
    ],
    premium: [
      "Everything in Paid plan",
      "Client Management",
      "Financial Management",
      "Advanced Analytics",
      "Priority Support",
      "1-on-1 Consultation",
    ],
  };

  const getPlanFeatures = () => {
    return planFeatures[user.subscriptionTier as keyof typeof planFeatures] || planFeatures.free;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge variant={user.subscriptionTier === "premium" ? "default" : "secondary"}>
              {user.subscriptionTier === "premium" ? (
                <span className="flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  Premium
                </span>
              ) : user.subscriptionTier === "paid" ? (
                "Paid"
              ) : (
                "Free"
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Features included:</h4>
              <ul className="space-y-2">
                {getPlanFeatures().map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {user.subscriptionTier === "free" && (
              <div className="pt-4">
                <Button asChild>
                  <Link href="/dashboard/upgrade">Upgrade Plan</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}