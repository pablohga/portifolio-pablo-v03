import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb"; // Use the correct import for MongoDB connection
import { sendRecoveryEmail } from "@/lib/email";

import crypto from 'crypto';

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex'); // Generate a secure random token
}

export async function POST(request: Request) {

  const { email } = await request.json();

  const client = await clientPromise; // Connect to the database
  const database = client.db(); // Get the database instance

  // Check if the user exists
  const user = await database.collection('users').findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }
  
  const name = user.name; // Get the user's name
  const token = generateToken(); // Generate a token for password recovery



  if (!user) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  // Send recovery email
  await sendRecoveryEmail(email, name, token); // Pass the user's name for the email



  return NextResponse.json({ message: 'Recovery email sent successfully!' });
}
