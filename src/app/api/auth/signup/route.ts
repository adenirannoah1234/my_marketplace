// pages/api/auth/signup.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
});

async function handleSignUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const phoneNumber = formData.get('phoneNumber') as string;

  // Validate the fields using Zod
  SignUpSchema.parse({ email, password, name, address, phoneNumber });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      address,
      phoneNumber,
    },
  });

  return NextResponse.json({
    message: 'User created successfully',
    user: { id: user.id, email: user.email, name: user.name },
  }, { status: 201 });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Parse FormData from the request
    return await handleSignUp(formData);
  } catch (error) {
    console.error('Signup Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    } else if (error instanceof Error) {
      return NextResponse.json({ message: 'An error occurred', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect();
  }
}
