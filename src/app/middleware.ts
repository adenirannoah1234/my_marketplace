import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token && request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    if (token) {
      jwt.verify(token, JWT_SECRET)
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
