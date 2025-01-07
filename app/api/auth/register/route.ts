import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, password, subscriptionTier = 'free' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      subscriptionTier,
    });

    // Try to send welcome email, but don't fail if it fails
    try {
      console.log('tentando enviar o email Welcome')
      await sendWelcomeEmail(email, name);
      console.log('enviado', email, name);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue with registration even if email fails
    }

    return NextResponse.json(
      { 
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          subscriptionTier: user.subscriptionTier,
        }
      },
      { status: 201 }
      
    )
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
