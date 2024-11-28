import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactSettings } from "@/models/contact";

export async function GET() {
  try {
    await dbConnect();
    const settings = await ContactSettings.findOne().sort({ createdAt: -1 });
    return NextResponse.json({ 
      _id: settings?._id,
      imageUrl: settings?.imageUrl 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contact image" },
      { status: 500 }
    );
  }
}