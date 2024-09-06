import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { verifyAuth, JwtPayload } from '../../utils/auth';

const prisma = new PrismaClient();

// Schemas for validation
const CreateCommentSchema = z.object({
  content: z.string().min(1),
  productId: z.number().positive(),
});

const UpdateCommentSchema = z.object({
  content: z.string().min(1),
});

// GET: Fetch comments for a product
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { productId: Number(productId) },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'An error occurred while fetching comments' }, { status: 500 });
  }
}

// POST: Create a new comment
export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content, productId } = CreateCommentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: { content, productId, userId: auth.userId },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error('Error creating comment:', error);
    return NextResponse.json({ message: 'An error occurred while creating the comment' }, { status: 500 });
  }
}

// PUT: Update a comment
export async function PUT(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ message: 'Comment ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { content } = UpdateCommentSchema.parse(body);

    const comment = await prisma.comment.updateMany({
      where: { id: Number(commentId), userId: auth.userId },
      data: { content },
    });

    if (comment.count === 0) {
      return NextResponse.json({ message: 'Comment not found or you do not have permission to edit' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error('Error updating comment:', error);
    return NextResponse.json({ message: 'An error occurred while updating the comment' }, { status: 500 });
  }
}

// DELETE: Delete a comment
export async function DELETE(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('id');

  if (!commentId) {
    return NextResponse.json({ message: 'Comment ID is required' }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.deleteMany({
      where: { id: Number(commentId), userId: auth.userId },
    });

    if (comment.count === 0) {
      return NextResponse.json({ message: 'Comment not found or you do not have permission to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: 'An error occurred while deleting the comment' }, { status: 500 });
  }
}