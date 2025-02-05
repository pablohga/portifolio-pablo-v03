import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature")!;
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = (customer as Stripe.Customer).email;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        const tier =
          priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
          priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
          priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR
            ? "premium"
            : "paid";

        await dbConnect();
        await User.findOneAndUpdate(
          { email: customerEmail },
          { subscriptionTier: tier, updatedAt: new Date() },
          { upsert: true }
        );

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = (customer as Stripe.Customer).email;

        await dbConnect();
        if (event.type === "customer.subscription.deleted") {
          await User.findOneAndUpdate(
            { email: customerEmail },
            { subscriptionTier: "free", updatedAt: new Date() }
          );
        } else {
          const priceId = subscription.items.data[0].price.id;
          const tier =
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR
              ? "premium"
              : "paid";

          await User.findOneAndUpdate(
            { email: customerEmail },
            { subscriptionTier: tier, updatedAt: new Date() }
          );
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}