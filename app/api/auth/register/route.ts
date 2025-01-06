import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { sendWelcomeEmail } from "@/lib/email";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Send welcome email
    await sendWelcomeEmail(email, name);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 }
    );
  }
}