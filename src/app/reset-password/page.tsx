'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { SupabaseAuthConfigBanner } from '@/components/SupabaseAuthConfigBanner'
import { PasswordInput } from '@/components/PasswordInput'
import {
  createClient,
  isSupabaseEnvConfigured,
} from '@/config/supabase-client'

const EXPIRED_MSG = 'Link expirado. Solicite novamente.'
const SUCCESS_MSG = 'Senha atualizada com sucesso. Faça login novamente.'

type Phase = 'loading' | 'ready' | 'submitting' | 'success' | 'error'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phase, setPhase] = useState<Phase>('loading')
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    form: '',
  })

  const urlError = searchParams.get('error')

  const verifySession = useCallback(async () => {
    if (!isSupabaseEnvConfigured()) {
      setPhase('ready')
      return
    }
    const supabase = createClient({ singleton: false })
    for (let i = 0; i < 4; i++) {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setPhase('ready')
        return
      }
      await new Promise((r) => setTimeout(r, 400))
    }
    setErrors((prev) => ({ ...prev, form: EXPIRED_MSG }))
    setPhase('error')
  }, [])

  useEffect(() => {
    if (urlError === 'expired' || urlError === 'config') {
      setErrors((prev) => ({
        ...prev,
        form: urlError === 'config' ? 'Servidor sem configuração Supabase.' : EXPIRED_MSG,
      }))
      setPhase('error')
      return
    }

    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      const origin = window.location.origin
      const target = `${origin}/auth/callback?next=${encodeURIComponent('/reset-password')}&code=${encodeURIComponent(code)}`
      window.location.replace(target)
      return
    }

    void verifySession()
  }, [urlError, verifySession])

  const validateForm = () => {
    const next = { password: '', confirmPassword: '', form: '' }
    if (!formData.password) {
      next.password = 'Nova senha é obrigatória'
    } else if (formData.password.length < 6) {
      next.password = 'A senha deve ter pelo menos 6 caracteres'
    }
    if (!formData.confirmPassword) {
      next.confirmPassword = 'Confirme a nova senha'
    } else if (formData.password !== formData.confirmPassword) {
      next.confirmPassword = 'As senhas não coincidem'
    }
    setErrors((prev) => ({ ...prev, ...next }))
    return !next.password && !next.confirmPassword
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (!isSupabaseEnvConfigured()) {
      setErrors((prev) => ({
        ...prev,
        form: 'Configura NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      }))
      return
    }

    setPhase('submitting')
    setErrors((prev) => ({ ...prev, form: '' }))

    try {
      const supabase = createClient({ singleton: false })
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      })

      if (error) {
        const msg = error.message?.toLowerCase() ?? ''
        const expired =
          msg.includes('expired') ||
          msg.includes('invalid') ||
          msg.includes('jwt') ||
          msg.includes('session')
        if (expired) {
          setErrors((prev) => ({ ...prev, form: EXPIRED_MSG }))
          setPhase('error')
        } else {
          setErrors((prev) => ({
            ...prev,
            form: 'Não foi possível atualizar a senha. Tente novamente.',
          }))
          setPhase('ready')
        }
        return
      }

      await supabase.auth.signOut()

      setPhase('success')
      window.setTimeout(() => {
        router.replace('/login?reset=success')
      }, 2200)
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: 'Não foi possível atualizar a senha. Tente novamente.',
      }))
      setPhase('ready')
    }
  }

  const showForm = phase === 'ready' || phase === 'submitting'
  const locked = phase === 'submitting' || phase === 'loading'

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Nova senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <Link href="/login" className="font-medium text-[#FF69B4] hover:text-[#FF1493]">
            Voltar ao login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg bg-white px-4 py-8 shadow sm:px-10">
          <SupabaseAuthConfigBanner />

          {phase === 'loading' ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-gray-600">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF69B4] border-t-transparent"
                aria-hidden
              />
              <p>A verificar o link…</p>
            </div>
          ) : null}

          {phase === 'success' ? (
            <div
              className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-900"
              role="status"
            >
              {SUCCESS_MSG}
            </div>
          ) : null}

          {phase === 'error' && errors.form ? (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              {errors.form}
              <div className="mt-4 text-center">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#FF69B4] underline underline-offset-2 hover:text-[#FF1493]"
                >
                  Solicitar novo link
                </Link>
              </div>
            </div>
          ) : null}

          {showForm ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nova senha
                </label>
                <div className="mt-1">
                  <PasswordInput
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    error={errors.password}
                    disabled={locked}
                    className="block w-full appearance-none rounded-md border px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-[#FF69B4] focus:outline-none focus:ring-[#FF69B4] sm:text-sm"
                    placeholder="Nova senha"
                  />
                  {errors.password ? (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar senha
                </label>
                <div className="mt-1">
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    error={errors.confirmPassword}
                    disabled={locked}
                    className="block w-full appearance-none rounded-md border px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-[#FF69B4] focus:outline-none focus:ring-[#FF69B4] sm:text-sm"
                    placeholder="Confirmar nova senha"
                  />
                  {errors.confirmPassword ? (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  ) : null}
                </div>
              </div>

              {errors.form && phase === 'ready' ? (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{errors.form}</div>
              ) : null}

              <button
                type="submit"
                disabled={locked}
                className="flex w-full justify-center rounded-md border border-transparent bg-[#FF69B4] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#FF1493] focus:outline-none focus:ring-2 focus:ring-[#FF69B4] focus:ring-offset-2 disabled:opacity-50"
              >
                {phase === 'submitting' ? 'A guardar…' : 'Definir nova senha'}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF69B4] border-t-transparent"
            aria-hidden
          />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
