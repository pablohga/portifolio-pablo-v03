import { NextResponse } from "next/server";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";
import { verifyUserSubscription, updateUserSubscriptionTier } from "@/lib/stripe/subscription";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const users = await User.find({
      subscriptionTier: { $in: ['free', 'paid', 'premium'] }
    });

    const updates = await Promise.all(users.map(async (user) => {
      try {
        const newTier = await verifyUserSubscription(user.email);
        
        if (user.subscriptionTier !== newTier) {
          await updateUserSubscriptionTier(user.email, newTier);
          return { 
            email: user.email, 
            status: `updated to ${newTier}` 
          };
        }

        return { 
          email: user.email, 
          status: 'verified' 
        };
      } catch (error) {
        return { 
          email: user.email, 
          status: 'error', 
          error: (error as Error).message 
        };
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