import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicRoutes = ['/login', '/signup']

// Middleware to check if the user is logged in
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl
// check if the route is a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
// check if the user is logged in and redirect to the login page if not
  if (!token) {
    const loginUrl = new URL(`/login?callbackUrl=${encodeURIComponent(request.url)}`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
//  Middleware config
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
