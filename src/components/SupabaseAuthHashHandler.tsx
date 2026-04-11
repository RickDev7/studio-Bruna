'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Erros de magic link / recovery vêm no fragmento (#) e caem no Site URL (ex. /).
 * Limpa o hash e envia o utilizador para recuperação com contexto legível.
 */
export function SupabaseAuthHashHandler() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.location.hash
    if (!raw || raw.length < 2) return

    const trimmed = raw.startsWith('#') ? raw.slice(1) : raw
    const params = new URLSearchParams(trimmed)
    if (!params.has('error') && !params.has('error_code')) return

    const errorCode = params.get('error_code') ?? ''
    const description = (params.get('error_description') ?? '').replace(/\+/g, ' ')

    const cleanPath = `${window.location.pathname}${window.location.search}`
    window.history.replaceState(null, '', cleanPath)

    if (
      errorCode === 'otp_expired' ||
      /invalid.*expired|link.*invalid|expired/i.test(description)
    ) {
      router.replace('/forgot-password?error=otp_expired')
      return
    }

    const msg = description || errorCode || 'Erro de autenticação'
    if (params.get('error') === 'access_denied') {
      router.replace(`/login?error=auth&message=${encodeURIComponent(msg)}`)
      return
    }
    router.replace(`/forgot-password?error=auth&message=${encodeURIComponent(msg)}`)
  }, [pathname, router])

  return null
}
