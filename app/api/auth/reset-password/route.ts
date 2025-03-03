import crypto from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Ajuste o caminho conforme necessário
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (!password) {
      
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    

    // Buscar usuário pelo token
    const user = await db.collection("users").findOne({
      resetToken: token, // Se o token estiver salvo como hash
      //resetTokenExpiry: { $gt: Date.now() },  Verifica se ainda está válido
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar senha e remover o token de redefinição
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword }, $unset: { resetToken: "", resetTokenExpiry: "" } }
    );
    return NextResponse.json({ message: "Password has been reset successfully!" });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
