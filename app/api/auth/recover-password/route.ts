import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendRecoveryEmail } from "@/lib/email";
import { generateToken } from "@/lib/utils"; // Importando a função correta

export async function POST(request: Request) {
  const { email } = await request.json();

  const client = await clientPromise;
  const database = client.db();

  // Verifica se o usuário existe
  const user = await database.collection("users").findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  const name = user.name;
  const token = generateToken(); // Gerando o token corretamente

  // Envia o e-mail de recuperação
  await sendRecoveryEmail(email, name, token);

  return NextResponse.json({ message: "Recovery email sent successfully!" });
}
