import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb"; 
import { sendRecoveryEmail } from "@/lib/email";
import crypto from 'crypto';

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex'); // Gera um token seguro
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const client = await clientPromise; 
    const database = client.db(); 

    // Verificar se o usuário existe
    const user = await database.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const name = user.name; 
    const token = generateToken(); 
    /* const hashedToken = crypto.createHash("sha256").update(token).digest("hex"); // Token criptografado*/
    // 
    /* const hashedToken = token */
    const expiryDate = new Date(Date.now() + 3600000); // Token válido por 1 hora

    console.log("🔑 Token gerado:", token);
    /* console.log("🔒 Token criptografado para armazenamento:", hashedToken); */
    
    // Salvar token no banco
    await database.collection('users').updateOne(
      { _id: user._id },
      { $set: { resetToken: token, resetTokenExpiry: expiryDate } }
    );

    // Enviar email de recuperação
    await sendRecoveryEmail(email, name, token); 

    return NextResponse.json({ message: 'Recovery email sent successfully!' });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
