import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    template: user.portfolioTemplate || "default"
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { template } = await request.json();

  if (!template || ![
    "default", 
    "template1", 
    "template2", 
    "template3", 
    "template4", 
    "template5", 
    "template6", 
    "template7", 
    "template8", 
    "template9", 
    "template10"
  ].includes(template)) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.portfolioTemplate = template;
  /* await user.save(); */
  await User.findOneAndUpdate(
  { email: session.user.email },
  { portfolioTemplate: template },
  { new: true }
);

  // Busca de novo para confirmar
const updated = await User.findOne({ email: session.user.email });
console.log("Template guardado:", updated.portfolioTemplate);

  return NextResponse.json({ message: "Template updated successfully!" });
}
