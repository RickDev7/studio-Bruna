import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Forçar MIME type correto para arquivos JavaScript
  if (request.nextUrl.pathname.includes('/_next/static/chunks/')) {
    response.headers.set('Content-Type', 'application/javascript; charset=utf-8')
  }

  return response
}

export const config = {
  matcher: [
    '/_next/static/chunks/:path*'
  ]
}