// pages/api/auth/logout.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Remove the token from the cookies
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Clear the cookie by setting an expired date
  response.cookies.set('token', '', { maxAge: 0, path: '/' });

  return response;
}
