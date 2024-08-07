import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
const JWT_SECRET = process.env.JWT_SECRET;

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fields = Object.fromEntries(formData.entries());
    const { email, password, name, address, phoneNumber } = SignUpSchema.parse(fields);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Handle file upload
    let pictureUrl = '';
    const picture = formData.get('picture') as File | null;
    if (picture) {
      const bytes = await picture.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const pictureName = `${Date.now()}-${picture.name}`;
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      
      // Ensure the uploads directory exists
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      const filePath = path.join(uploadsDir, pictureName);
      await writeFile(filePath, buffer);
      pictureUrl = `/uploads/${pictureName}`;
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        address,
        phoneNumber,
        picture: pictureUrl,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return NextResponse.json({ message: 'User created successfully', user, token }, { status: 201 });
  } catch (error) {
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
