import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Testimonial } from "@/models/testimonial";
import { authOptions } from "@/lib/auth-options";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();

    const testimonial = await Testimonial.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const testimonial = await Testimonial.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
