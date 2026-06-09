import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Testimonial } from "@/models/testimonial";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await dbConnect();
    const testimonials = await Testimonial.find(userId ? { userId } : {}).sort({ createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
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

    const testimonial = await Testimonial.create({
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create testimonial" }, { status: 500 });
  }
}
