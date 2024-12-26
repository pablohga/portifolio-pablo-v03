import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";

interface SubscriptionBadgeProps {
  tier: string;
}

export function SubscriptionBadge({ tier }: SubscriptionBadgeProps) {
  const router = useRouter();

  const getBadgeVariant = () => {
    switch (tier) {
      case 'premium':
        return 'default';
      case 'paid':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getDisplayName = () => {
    switch (tier) {
      case 'premium':
        return 'Premium';
      case 'paid':
        return 'Paid';
      default:
        return 'Free';
    }
  };

  return (
    <Button
      variant="ghost"
      className="gap-2"
      onClick={() => router.push('/dashboard/upgrade')}
    >
      <Crown className="h-4 w-4" />
      <Badge variant={getBadgeVariant()}>
        {getDisplayName()} Plan
      </Badge>
    </Button>
  );
}