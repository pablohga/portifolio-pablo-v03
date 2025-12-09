import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { template } = await request.json();

  if (!template || !["default", "template1", "template2", "template3"].includes(template)) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.portfolioTemplate = template;
  await user.save();

  return NextResponse.json({ message: "Template updated successfully" });
}
