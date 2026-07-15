import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { authOptions } from "@/lib/auth-options";
import { isAdmin as isAdminFunc } from "@/lib/auth";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("PUT Profile - ID:", params.id);
    const session = await getServerSession(authOptions);
    const admin = await isAdminFunc();
    console.log("PUT Profile - Session exists:", !!session, "Is Admin:", admin);

    // Only allow users to edit their own profile or admins to edit any profile
    if (!session || (!admin && session.user.id !== params.id)) {
      console.log("PUT Profile - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("PUT Profile - Payload:", body);
    const { name, email, image } = body;
    await dbConnect();

    const user = await User.findById(params.id);
    if (!user) {
      console.log("PUT Profile - User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      console.log("PUT Profile - Checking email uniqueness for:", email);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("PUT Profile - Email already in use");
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (image) user.image = image;

    console.log("PUT Profile - Attempting to save user...");
    await user.save();
    console.log("PUT Profile - User saved successfully");

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Profile update error detailed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}