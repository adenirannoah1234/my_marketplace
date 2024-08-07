// pages/api/auth/send-confirmation-email.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
const JWT_SECRET = process.env.JWT_SECRET;

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use any other email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate email confirmation token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    const confirmationLink = `${process.env.BASE_URL}/auth/confirm-email?token=${token}`;

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Confirmation',
      text: `Please confirm your email by clicking the following link: ${confirmationLink}`,
    });

    return NextResponse.json({ message: 'Confirmation email sent' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred', error: error.message }, { status: 500 });
  }
}
