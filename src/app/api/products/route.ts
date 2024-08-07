import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
});

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price } = CreateProductSchema.parse(body);

    // Assume JWT token is verified and userId is extracted
    const userId = 1; // Replace this with the actual user ID from the token

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        sellerId: userId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'An error occurred', error: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 400 });
    }
  }
}
