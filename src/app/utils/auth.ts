import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: number;
  email: string;
}

export function verifyAuth(request: NextRequest): JwtPayload | null {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}