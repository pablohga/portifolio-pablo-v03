import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Boolean(process.env.SMTP_SECURE),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}