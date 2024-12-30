import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Hero } from "@/models/hero";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    await dbConnect();
    const hero = await Hero.findOne(userId ? { userId } : {}).sort({ createdAt: -1 });
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
    
    // Delete previous hero data for this user
    await Hero.deleteMany({ userId: session.user.id });
    
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