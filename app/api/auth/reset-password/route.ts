import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

import clientPromise from "@/lib/mongodb"; // Use the correct import for MongoDB connection

export async function POST(request: Request) {
  const { token, password } = await request.json();

  const client = await clientPromise; // Connect to the database
  const database = client.db(); // Get the database instance

  // Logic to verify the token and update the password goes here
  const user = await database.collection('users').findOne({ resetToken: token }); // Find user by reset token
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  // Hash the new password before saving
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10

  // Update the user's password
  await database.collection('users').updateOne(
    { resetToken: token }, 
    { $set: { password: hashedPassword, resetToken: null } } // Clear the reset token after use
  );

  return NextResponse.json({ message: 'Password has been reset successfully!' });


}
