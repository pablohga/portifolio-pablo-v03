import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Retrieve customer email using customer ID
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = (customer as Stripe.Customer).email;

        // Get subscription details to determine the plan
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        // Determine subscription tier based on price ID
        const tier = priceId === process.env.STRIPE_PRICE_ID_PREMIUM 
          ? 'premium' 
          : 'paid';

        await dbConnect();
        
        // Update or create user
        await User.findOneAndUpdate(
          { email: customerEmail },
          { 
            subscriptionTier: tier,
            email: customerEmail,
            // If user doesn't exist, set default values
            $setOnInsert: {
              name: customerEmail?.split('@')[0] || "User",
              role: 'user',
            }
          },
          { upsert: true, new: true }
        );
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Retrieve customer email using customer ID
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = (customer as Stripe.Customer).email;

        await dbConnect();

        if (event.type === "customer.subscription.deleted") {
          await User.findOneAndUpdate(
            { email: customerEmail },
            { subscriptionTier: 'free' }
          );
        } else {
          const priceId = subscription.items.data[0].price.id;
          const tier = priceId === process.env.STRIPE_PRICE_ID_PREMIUM 
            ? 'premium' 
            : 'paid';

          await User.findOneAndUpdate(
            { email: customerEmail },
            { subscriptionTier: tier }
          );
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
