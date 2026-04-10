import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function applyResponseCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value, {
      path: cookie.path ?? '/',
      domain: cookie.domain,
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite as 'lax' | 'strict' | 'none' | undefined,
    })
  })
}

async function profileIsAdmin(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()
  return String(data?.role ?? '')
    .trim()
    .toLowerCase() === 'admin'
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  if (pathname.includes('/_next/static/chunks/')) {
    response.headers.set('Content-Type', 'application/javascript; charset=utf-8')
    return response
  }

  const needsAuthCheck =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')

  if (!needsAuthCheck) {
    return response
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value
      },
      set(name, value, options) {
        response.cookies.set(name, value, options)
      },
      remove(name, options) {
        response.cookies.set(name, '', { ...options, maxAge: 0 })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  /* URLs antigas da área cliente → admin (se admin) ou início */
  if (pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    if (!user) {
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      const redirect = NextResponse.redirect(url)
      applyResponseCookies(response, redirect)
      return redirect
    }
    const isAdmin = await profileIsAdmin(supabase, user.id)
    url.pathname = isAdmin ? '/admin' : '/'
    url.search = ''
    const redirect = NextResponse.redirect(url)
    applyResponseCookies(response, redirect)
    return redirect
  }

  /* /admin: só exige sessão; papel admin é validado no layout (servidor) — o Edge
   * por vezes falha leituras a `profiles` com o mesmo JWT que o Node aplica bem. */
  if (!user && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    const redirect = NextResponse.redirect(url)
    applyResponseCookies(response, redirect)
    return redirect
  }

  /* Com sessão: admins vão direto ao painel; outros ficam na página (login/signup)
   * sem redirecionar para / — no Edge a leitura de `profiles` falha por vezes e
   * isso bloqueava admins e impedia abrir /login para terminar sessão. */
  if (user && pathname === '/login') {
    const isAdmin = await profileIsAdmin(supabase, user.id)
    if (isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      const redirect = NextResponse.redirect(url)
      applyResponseCookies(response, redirect)
      return redirect
    }
  }

  if (user && pathname === '/signup') {
    const isAdmin = await profileIsAdmin(supabase, user.id)
    if (isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      const redirect = NextResponse.redirect(url)
      applyResponseCookies(response, redirect)
      return redirect
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/_next/static/chunks/:path*',
  ],
}
