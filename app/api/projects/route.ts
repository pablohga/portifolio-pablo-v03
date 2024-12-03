import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Project } from "@/models/project";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkSubscriptionLimits } from "@/lib/subscription";
import { User } from "@/models/user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    await dbConnect();
    const projects = await Project.find(userId ? { userId } : {}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Get user's subscription tier
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription limits
    await checkSubscriptionLimits(session.user.id, user.subscriptionTier);

    const data = await request.json();
    const project = await Project.create({
      ...data,
      userId: session.user.id,
    });
    
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}