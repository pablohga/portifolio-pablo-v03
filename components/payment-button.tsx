import Link from "next/link";
import { Button } from "./ui/button";
import { loadStripe } from "@stripe/stripe-js"
import { useCallback } from "react";
import { Dialog, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js'

type PaymentButtonProps = {
  children: React.ReactNode
}

export default function PaymentButton({children}: PaymentButtonProps){
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
  )
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/checkout", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, []);

  const options = {fetchClientSecret};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="payment-button">
          <Button
            className="w-full mt-5"
            variant="default"
          >
            {children}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[600px] h-[600px] bg-gray-200 rounded-lg shadow-lg absolute top-[-20%] left-[-50%] z-[10000]">
        <DialogTitle className="text-center text-primary-foreground">
          Assinatura Pro
        </DialogTitle>
        <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
        >
        <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </DialogContent>
      
    </Dialog>
    
  )
}