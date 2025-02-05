// app/api/seo/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { SEO } from "@/models/seo";
import { authOptions } from "@/lib/auth-options";
import { isAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Fetch user-specific SEO if userId is provided, otherwise fetch system-wide SEO
    const seo = await SEO.findOne(userId ? { userId } : { userId: null }).sort({ createdAt: -1 });
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

    // Check if the request is for system-wide SEO (admin only)
    if (!data.userId && (await isAdmin())) {
      // Delete previous system-wide SEO data
      await SEO.deleteMany({ userId: null });

      // Create new system-wide SEO data
      const seo = await SEO.create({
        ...data,
        userId: null,
      });

      return NextResponse.json(seo);
    }

    // Otherwise, process user-specific SEO update
    if (data.userId) {
      // Delete previous SEO data for this user
      await SEO.deleteMany({ userId: data.userId });

      // Create new SEO data for the user
      const seo = await SEO.create({
        ...data,
        userId: data.userId,
      });

      return NextResponse.json(seo);
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error updating SEO data:", error);
    return NextResponse.json({ error: "Failed to update SEO data" }, { status: 500 });
  }
}