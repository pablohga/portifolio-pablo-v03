import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Category } from "@/models/category";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
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
    
    // Create a URL-friendly ID from the name
    const id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const category = await Category.create({
      ...data,
      id,
      userId: session.user.id,
    });
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}