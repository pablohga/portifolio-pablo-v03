import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Expense } from "@/models/expense";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const clientId = searchParams.get('clientId');
    
    await dbConnect();
    const expenses = await Expense.find(
      clientId 
        ? { clientId }
        : userId 
        ? { userId }
        : {}
    ).sort({ createdAt: -1 });
    
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
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
    
    const service = await Expense.create({
      ...data,
      userId: session.user.id,
    });
    
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Expense" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params; // ID do serviço a ser atualizado
    const data = await request.json();

    const updatedService = await Expense.findOneAndUpdate(
      { _id: id, userId: session.user.id }, // Certifique-se de que o serviço pertence ao usuário autenticado
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}
