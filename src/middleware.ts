import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check for Supabase auth token (Edge-compatible — no @supabase packages)
  const hasAuthCookie = request.cookies.getAll()
    .some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

  // Protect /admin and /dashboard when not authenticated
  if (!hasAuthCookie) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect already-authenticated users away from auth pages
  if (hasAuthCookie && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}