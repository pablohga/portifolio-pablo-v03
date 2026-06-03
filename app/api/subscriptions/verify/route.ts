import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Get all users with paid or premium subscriptions
    const users = await User.find({
      subscriptionTier: { $in: ['paid', 'premium'] }
    });

    const updates = await Promise.all(users.map(async (user) => {
      if (user.manualTierOverride) {
        return { email: user.email, status: 'skipped (manual override active)' };
      }
      try {
        // Find customer in Stripe
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1,
          expand: ['data.subscriptions']
        });

        const customer = customers.data[0];
        if (!customer) {
          // No Stripe customer found - revert to free tier
          user.subscriptionTier = 'free';
          user.subscriptionStatus = 'canceled';
          user.subscriptionPastDueSince = undefined;
          await user.save();
          return { email: user.email, status: 'reverted to free (no customer)' };
        }

        const subscription = customer.subscriptions?.data[0];
        if (!subscription) {
          // No subscription found - revert to free tier
          user.subscriptionTier = 'free';
          user.subscriptionStatus = 'canceled';
          user.subscriptionPastDueSince = undefined;
          await user.save();
          return { email: user.email, status: 'reverted to free (no subscription)' };
        }

        // Check subscription status
        if (subscription.status === 'past_due') {
          // Subscription is past due - mark for monitoring but don't revert yet
          user.subscriptionStatus = 'past_due';
          user.subscriptionPastDueSince = new Date();
          await user.save();
          return { email: user.email, status: 'marked as past_due', subscriptionStatus: subscription.status };
        }

        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          // Subscription canceled or unpaid after grace period - revert to free
          user.subscriptionTier = 'free';
          user.subscriptionStatus = 'canceled';
          user.subscriptionPastDueSince = undefined;
          await user.save();
          return { email: user.email, status: 'reverted to free (subscription ' + subscription.status + ')' };
        }

        if (subscription.status === 'active' || subscription.status === 'trialing') {
          // Active or trialing subscription - ensure status is correct
          const priceId = subscription.items.data[0].price.id;
          const newTier =
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR
              ? 'premium'
              : 'paid';

          if (user.subscriptionTier !== newTier || user.subscriptionStatus !== 'active') {
            user.subscriptionTier = newTier;
            user.subscriptionStatus = 'active';
            user.subscriptionPastDueSince = undefined;
            await user.save();
            return { email: user.email, status: `updated to ${newTier}`, subscriptionStatus: 'active' };
          }
        }

        return { email: user.email, status: 'verified', subscriptionStatus: subscription.status };
      } catch (error) {
        return { email: user.email, status: 'error', error: (error as Error).message };
      }
    }));

    return NextResponse.json({
      message: "Subscription verification completed",
      updates
    });
  } catch (error) {
    console.error("Subscription verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify subscriptions" },
      { status: 500 }
    );
  }
}