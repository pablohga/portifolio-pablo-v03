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
      { error: "Failed to fetch expenses" },
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
    
    const expense = await Expense.create({
      ...data,
      userId: session.user.id,
    });
    
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create expense" },
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

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: session.user.id }, // Certifique-se de que o serviço pertence ao usuário autenticado
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}
