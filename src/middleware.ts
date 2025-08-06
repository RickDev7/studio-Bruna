import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function middleware(request: NextRequest) {
  try {
  const res = NextResponse.next()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definida');
    }

    if (!supabaseAnonKey) {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida');
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

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
  } catch (error) {
    console.error('Erro no middleware:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup'
  ],
} 