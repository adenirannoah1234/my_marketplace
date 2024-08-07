import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const UpdateProductSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, price } = UpdateProductSchema.parse(body);

    // Assume JWT token is verified and userId is extracted
    const userId = 1; // Replace this with the actual user ID from the token

    const product = await prisma.product.updateMany({
      where: {
        id: parseInt(params.id),
        sellerId: userId,
      },
      data: {
        title,
        description,
        price,
      },
    });

    if (product.count === 0) {
      return NextResponse.json({ message: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'An error occurred', error: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 400 });
    }
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Assume JWT token is verified and userId is extracted
    const userId = 1; // Replace this with the actual user ID from the token

    const product = await prisma.product.deleteMany({
      where: {
        id: parseInt(params.id),
        sellerId: userId,
      },
    });

    if (product.count === 0) {
      return NextResponse.json({ message: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'An error occurred', error: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 400 });
    }
  }
}
