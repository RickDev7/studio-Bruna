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

  // Se não estiver autenticado e tentar acessar rotas protegidas
  if (!session && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se estiver autenticado e tentar acessar login/signup
  if (session && (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se estiver acessando área administrativa, verificar se é admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session?.user?.id)
        .single()

      if (error) {
        console.error('Erro ao verificar perfil:', error)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      if (!profile || profile.role !== 'admin') {
        console.log('Acesso negado ao painel admin. Role:', profile?.role)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      console.error('Erro ao verificar permissões:', error)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
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