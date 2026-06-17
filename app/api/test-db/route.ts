import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

async function updateTestUser() {
  const client = await clientPromise;
  const db = client.db();
  
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expiryDate = new Date(Date.now() + 3600000); // Token válido por 1 hora

  await db.collection("users").updateOne(
    { email: "phga.bkp1@gmail.com" },
    { $set: { resetToken: hashedToken, resetTokenExpiry: expiryDate } }
  );
}

updateTestUser();

/* import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    console.log("📡 Conectado ao banco de dados.");

    // Testar se a coleção 'users' existe e quantos registros possui
    const usersCount = await db.collection("users").countDocuments();
    console.log(`👤 Total de usuários na coleção: ${usersCount}`);

    // Buscar um usuário de teste
    const user = await db.collection("users").findOne({});
    console.log("👤 Usuário encontrado:", user);

    return NextResponse.json({ usersCount, user });
  } catch (error) {
    console.error("🔥 Erro ao conectar ao banco de dados:", error);
    return NextResponse.json({ error: "Erro ao conectar ao banco" }, { status: 500 });
  }
}
 */