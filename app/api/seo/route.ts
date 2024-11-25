import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { SEO } from "@/models/seo";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();
    const seo = await SEO.findOne().sort({ createdAt: -1 });
    return NextResponse.json(seo || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch SEO data" }, { status: 500 });
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
    
    // Delete previous SEO data
    await SEO.deleteMany({});
    
    // Create new SEO data
    const seo = await SEO.create({
      ...data,
      userId: session.user.id,
    });
    
    return NextResponse.json(seo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update SEO data" }, { status: 500 });
  }
}