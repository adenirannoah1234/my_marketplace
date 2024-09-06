import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),  // Set a default empty string
  price: z.number().positive(),
});

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'An error occurred while fetching products' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    } else if (error instanceof Error) {
      console.error('Error creating product:', error);
      return NextResponse.json({ message: 'An error occurred', error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect();
  }
}