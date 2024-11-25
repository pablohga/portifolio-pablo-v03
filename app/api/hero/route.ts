import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Hero } from "@/models/hero";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();
    const hero = await Hero.findOne().sort({ createdAt: -1 });
    return NextResponse.json(hero || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    
    // Delete previous hero data
    await Hero.deleteMany({});
    
    // Create new hero data
    const hero = await Hero.create({
      ...data,
      userId: session.user.id,
    });
    
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hero data" }, { status: 500 });
  }
}