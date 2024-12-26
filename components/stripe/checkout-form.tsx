import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
}

export function CheckoutForm({ isOpen, onClose, plan }: CheckoutFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen && !session?.user) {
      handleNonAuthenticatedCheckout();
    }
  }, [isOpen, session]);

  const handleNonAuthenticatedCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          email: session?.user?.email,
        }),
      });

      const { url } = await response.json();
      if (url) {
        router.push(url);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const createCheckoutSession = async () => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          email: session?.user?.email,
        }),
      });

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>Subscribe to {plan}</DialogTitle>
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret: createCheckoutSession }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </DialogContent>
    </Dialog>
  );
}