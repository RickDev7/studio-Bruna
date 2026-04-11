'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SupabaseAuthConfigBanner } from '@/components/SupabaseAuthConfigBanner'
import {
  createClient,
  getAuthCallbackUrl,
  isSupabaseEnvConfigured,
} from '@/config/supabase-client'
import { toast } from 'sonner'

const COOLDOWN_MS = 45 * 60 * 1000
const COOLDOWN_STORAGE_KEY = 'sb_forgot_pw_cooldown_until'

function messageForResetPasswordError(error: unknown): string {
  const msg =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message?: string }).message ?? '')
      : String(error ?? '')
  if (/rate limit|too many requests/i.test(msg) || /over_email_send_rate_limit/i.test(msg)) {
    return 'Limite de envio de emails atingido (proteção do Supabase). Aguarda cerca de uma hora antes de pedir de novo, ou revisa Authentication → Rate Limits no painel do projeto.'
  }
  return 'Erro ao enviar o email de recuperação. Tente novamente.'
}

function isRateLimitAuthError(error: unknown): boolean {
  const msg =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message?: string }).message ?? '')
      : ''
  const status =
    error && typeof error === 'object' && 'status' in error
      ? Number((error as { status?: number }).status)
      : NaN
  return (
    status === 429 ||
    /rate limit|too many requests|over_email_send_rate_limit/i.test(msg)
  )
}

function readCooldownUntil(): number | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(COOLDOWN_STORAGE_KEY)
  if (!raw) return null
  const until = parseInt(raw, 10)
  if (!Number.isFinite(until) || until <= Date.now()) {
    sessionStorage.removeItem(COOLDOWN_STORAGE_KEY)
    return null
  }
  return until
}

export default function ForgotPassword() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)
  const [cooldownTick, setCooldownTick] = useState(0)
  const queryToastDone = useRef(false)
  /** Evita hydration mismatch quando extensões injetam atributos (ex. fdprocessedid) em inputs. */
  const [formMounted, setFormMounted] = useState(false)
  useEffect(() => {
    setFormMounted(true)
  }, [])

  useEffect(() => {
    const until = readCooldownUntil()
    if (until) {
      setCooldownUntil(until)
      const mins = Math.max(1, Math.ceil((until - Date.now()) / 60_000))
      setFormError(
        `Limite de emails recente. O botão fica desativado ~${mins} min para evitar novos erros; o Supabase pode exigir mais tempo (vê Authentication → Rate Limits).`
      )
    }
  }, [])

  useEffect(() => {
    if (!cooldownUntil || Date.now() >= cooldownUntil) return
    const id = window.setInterval(() => {
      setCooldownTick((n) => n + 1)
      if (Date.now() >= cooldownUntil) {
        setCooldownUntil(null)
        sessionStorage.removeItem(COOLDOWN_STORAGE_KEY)
        setFormError((msg) =>
          msg.startsWith('Limite de emails recente.') ? '' : msg
        )
      }
    }, 10_000)
    return () => window.clearInterval(id)
  }, [cooldownUntil])

  const cooldownMinsLeft = useMemo(() => {
    if (!cooldownUntil || Date.now() >= cooldownUntil) return 0
    return Math.max(1, Math.ceil((cooldownUntil - Date.now()) / 60_000))
  }, [cooldownUntil, cooldownTick])

  useEffect(() => {
    if (typeof window === 'undefined' || queryToastDone.current) return
    const q = new URLSearchParams(window.location.search)
    const err = q.get('error')
    if (err === 'otp_expired') {
      queryToastDone.current = true
      toast.error('Link expirado. Solicite novamente.')
      router.replace('/forgot-password', { scroll: false })
      return
    }
    if (err === 'auth') {
      queryToastDone.current = true
      const msg = q.get('message')
      toast.error(msg ? decodeURIComponent(msg) : 'Não foi possível validar o link.')
      router.replace('/forgot-password', { scroll: false })
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSupabaseEnvConfigured()) {
      toast.error(
        'Configura NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para usar o teu Supabase.'
      )
      return
    }

    const blocked = readCooldownUntil()
    if (blocked) {
      const mins = Math.max(1, Math.ceil((blocked - Date.now()) / 60_000))
      toast.error(`Aguarda ~${mins} min antes de voltar a pedir o email.`)
      return
    }

    setLoading(true)
    setFormError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthCallbackUrl('/reset-password'),
      })

      if (error) {
        const text = messageForResetPasswordError(error)
        setFormError(text)
        toast.error(text)
        if (isRateLimitAuthError(error)) {
          const until = Date.now() + COOLDOWN_MS
          sessionStorage.setItem(COOLDOWN_STORAGE_KEY, String(until))
          setCooldownUntil(until)
        }
        return
      }

      sessionStorage.removeItem(COOLDOWN_STORAGE_KEY)
      setCooldownUntil(null)
      setSubmitted(true)
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.')
    } catch (error) {
      if (!isRateLimitAuthError(error)) {
        console.error('Error:', error)
      }
      const text = messageForResetPasswordError(error)
      setFormError(text)
      toast.error(text)
      if (isRateLimitAuthError(error)) {
        const until = Date.now() + COOLDOWN_MS
        sessionStorage.setItem(COOLDOWN_STORAGE_KEY, String(until))
        setCooldownUntil(until)
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-purple-100">
        <div className="max-w-md mx-auto pt-16 p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Verifique seu Email</h1>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <p className="text-gray-900 mb-4">
              Enviamos instruções de recuperação para <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-700">
              Siga as instruções no email para redefinir sua senha.
            </p>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-700">
              Não recebeu o email?{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-purple-700 hover:text-purple-900 hover:underline font-medium"
              >
                Tentar novamente
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Recuperar senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/login" className="font-medium text-[#FF69B4] hover:text-[#FF1493]">
            voltar para o login
          </Link>
            </p>
          </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SupabaseAuthConfigBanner />
          {!formMounted ? (
            <div className="space-y-6" aria-hidden>
              <div className="space-y-2">
                <div className="h-4 w-14 rounded bg-gray-200" />
                <div className="h-10 w-full rounded-md border border-gray-200 bg-gray-50" />
              </div>
              <div className="h-10 w-full rounded-md bg-gray-100" />
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (cooldownMinsLeft === 0) setFormError('')
                    }}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF69B4] focus:border-[#FF69B4] sm:text-sm"
                  />
                </div>
              </div>

              {formError ? (
                <div
                  className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"
                  role="alert"
                >
                  {formError}
                  {cooldownMinsLeft > 0 ? (
                    <p className="mt-2 text-xs text-amber-900/90" suppressHydrationWarning>
                      Tempo estimado: ~{cooldownMinsLeft} min (pausa local; o Supabase pode exigir mais).
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div>
                <button
                  type="submit"
                  disabled={loading || cooldownMinsLeft > 0}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF69B4] hover:bg-[#FF1493] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF69B4] disabled:opacity-50"
                >
                  {loading
                    ? 'Enviando...'
                    : cooldownMinsLeft > 0
                      ? `Aguardar (~${cooldownMinsLeft} min)`
                      : 'Enviar email de recuperação'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 