import { stripe } from '@/lib/stripe';
import { User } from '@/models/user';
import dbConnect from '@/lib/db';

export async function verifyUserSubscription(email: string) {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
    expand: ['data.subscriptions']
  });

  const customer = customers.data[0];
  if (!customer) {
    return 'free';
  }

  const subscription = customer.subscriptions?.data[0];
  if (!subscription || subscription.status !== 'active') {
    return 'free';
  }

  const priceId = subscription.items.data[0].price.id;
  return priceId === process.env.STRIPE_PRICE_ID_PREMIUM ? 'premium' : 'paid';
}

export async function updateUserSubscriptionTier(email: string, tier: string) {
  await dbConnect();
  await User.findOneAndUpdate(
    { email },
    { subscriptionTier: tier }
  );
}