import { stripe } from "@/lib/stripe";
import type { SubscriptionTier } from "@/types/subscription";

export async function verifyStripeSubscription(email: string): Promise<SubscriptionTier> {
  try {
    // Find customer by email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
      expand: ['data.subscriptions']
    });

    // If no customer found, return free tier
    if (customers.data.length === 0) {
      return 'free';
    }

    const customer = customers.data[0];
    const subscription = customer.subscriptions?.data[0];

    // If no active subscription, return free tier
    if (!subscription || subscription.status !== 'active') {
      return 'free';
    }

    // Get the price ID of the subscription
    const priceId = subscription.items.data[0].price.id;

    // Determine tier based on price ID
    if (priceId === process.env.STRIPE_PRICE_ID_PREMIUM) {
      return 'premium';
    } else if (priceId === process.env.STRIPE_PRICE_ID_PAID) {
      return 'paid';
    }

    // Default to free tier if price ID doesn't match
    return 'free';
  } catch (error) {
    console.error('Error verifying Stripe subscription:', error);
    // Default to free tier on error
    return 'free';
  }
}