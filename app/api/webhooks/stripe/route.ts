import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { User } from '@/models/user';
import dbConnect from '@/lib/db';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (!customer || !('email' in customer)) break;

        await dbConnect();
        
        // Update user subscription tier based on price ID
        const priceId = subscription.items.data[0].price.id;
        const tier = priceId === process.env.STRIPE_PRICE_ID_PREMIUM ? 'premium' : 'paid';
        
        await User.findOneAndUpdate(
          { email: customer.email },
          { subscriptionTier: tier },
          { new: true }
        );
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        const deletedCustomer = await stripe.customers.retrieve(deletedSubscription.customer as string);
        
        if (!deletedCustomer || !('email' in deletedCustomer)) break;

        await dbConnect();
        
        await User.findOneAndUpdate(
          { email: deletedCustomer.email },
          { subscriptionTier: 'free' },
          { new: true }
        );
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}