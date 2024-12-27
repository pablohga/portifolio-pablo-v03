import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/checkout';

export async function POST(request: Request) {
  try {
    const { plan, email, name, password } = await request.json();
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createCheckoutSession({
      plan,
      email,
      name,
      password,
      origin
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}