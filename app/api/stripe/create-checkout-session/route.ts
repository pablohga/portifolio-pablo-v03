import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const PRICE_IDS = {
  paid: process.env.STRIPE_PRICE_ID_PAID!,
  premium: process.env.STRIPE_PRICE_ID_PREMIUM!,
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { plan, email } = await request.json();

    if (!PRICE_IDS[plan as keyof typeof PRICE_IDS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
    const successUrl = session?.user 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}`;

    if (session?.user) {
      // For authenticated users, use Embedded Checkout
      const checkoutSession = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        customer_email: session.user.email!,
        return_url: successUrl,
      });

      return NextResponse.json({
        clientSecret: checkoutSession.client_secret,
      });
    } else {
      // For non-authenticated users, use Hosted Checkout
      const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        customer_email: email,
      });

      return NextResponse.json({
        url: checkoutSession.url,
      });
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}