import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const email = searchParams.get("email");
    const plan = searchParams.get("plan");

    if (!sessionId || !email || !plan) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid checkout session" },
        { status: 400 }
      );
    }

    if (session.payment_status === 'paid') {
      // Update user subscription tier
      await dbConnect();
      await User.findOneAndUpdate(
        { email },
        { subscriptionTier: plan }
      );
    }

    return NextResponse.json({ 
      status: session.payment_status,
      subscriptionTier: plan
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json(
      { error: "Failed to verify session" },
      { status: 500 }
    );
  }
}