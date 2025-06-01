import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req: request, res })

  // Debug das variáveis de ambiente
  console.log('DEBUG - Variáveis de ambiente:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não estiver autenticado, redireciona para o login
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (request.nextUrl.pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Se estiver tentando acessar o painel admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Verifica se o email é o autorizado
    if (session?.user.email !== 'bs.aestheticnails@gmail.com') {
      // Redireciona para a página inicial se não for o email autorizado
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Se estiver autenticado e tentar acessar login/signup
  if (session && (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup'
  ],
} 