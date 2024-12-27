// app/api/stripe/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const PRICE_IDS = {
  paid: process.env.STRIPE_PRICE_ID_PAID!,
  premium: process.env.STRIPE_PRICE_ID_PREMIUM!,
};

export async function POST(request: Request) {
  try {
    const { plan, email } = await request.json();

    if (!PRICE_IDS[plan as keyof typeof PRICE_IDS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
    
    // Get the origin from the request headers
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;
    
    // Construct the success and cancel URLs
    const successUrl = `${origin}/auth/register?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}&plan=${plan}`;
    const cancelUrl = `${origin}/auth/register`;

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      payment_method_types: ['card'],
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
