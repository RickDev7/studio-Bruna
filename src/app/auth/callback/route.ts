import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function safeInternalPath(next: string | null): string {
  const raw = next?.trim() ? decodeURIComponent(next.trim()) : '/admin'
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/admin'
  return raw.split('?')[0] || '/admin'
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const nextPath = safeInternalPath(url.searchParams.get('next'))
  const isPasswordReset = nextPath === '/reset-password'
  const origin = url.origin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!code) {
    if (isPasswordReset) {
      return NextResponse.redirect(`${origin}/reset-password?error=expired`)
    }
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isPasswordReset) {
      return NextResponse.redirect(`${origin}/reset-password?error=config`)
    }
    return NextResponse.redirect(`${origin}/login?error=server_config`)
  }

  const redirectTarget =
    isPasswordReset ? `${origin}/reset-password` : new URL(nextPath, origin).toString()

  const response = NextResponse.redirect(redirectTarget)
  const cookieSecure = url.protocol === 'https:'

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set(name, value, {
          ...options,
          ...(cookieSecure ? { secure: true } : {}),
        })
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set(name, '', {
          ...options,
          maxAge: 0,
          ...(cookieSecure ? { secure: true } : {}),
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[auth/callback]', error.message)
    if (isPasswordReset) {
      return NextResponse.redirect(`${origin}/reset-password?error=expired`)
    }
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=${encodeURIComponent(error.message)}`
    )
  }

  return response
}
