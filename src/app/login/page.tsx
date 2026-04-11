'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleButton } from '@/components/GoogleButton'
import { PasswordInput } from '@/components/PasswordInput'
import { SupabaseAuthConfigBanner } from '@/components/SupabaseAuthConfigBanner'
import {
  createClient,
  getAuthCallbackUrl,
  isSupabaseEnvConfigured,
  isUnreachableLegacySupabaseUrl,
} from '@/config/supabase-client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    form: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: ''
  })
  /** Evita hydration mismatch quando extensões injetam atributos (ex. fdprocessedid) nos inputs. */
  const [formMounted, setFormMounted] = useState(false)
  useEffect(() => {
    setFormMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const reason = params.get('reason')
    const err = params.get('error')
    if (reason === 'admin_only') {
      toast.error(
        'Acesso reservado a administradores. No Supabase, define role = admin na tabela profiles para o teu utilizador.'
      )
    }
    if (reason === 'no_profile') {
      toast.error(
        'Não existe linha em profiles para esta conta. Confirma o trigger handle_new_user / migrações no Supabase.'
      )
    }
    if (params.get('reset') === 'success') {
      toast.success('Senha atualizada com sucesso. Faça login novamente.')
    }
    if (err === 'auth') {
      const msg = params.get('message')
      toast.error(
        msg
          ? `Sessão não iniciada: ${decodeURIComponent(msg)}`
          : 'Falha ao confirmar o email ou o link (OAuth / recuperação). Tenta de novo.'
      )
    } else if (err === 'missing_code') {
      toast.error('Link de autenticação incompleto. Abre o link diretamente do email.')
    } else if (err === 'server_config') {
      toast.error('Servidor sem NEXT_PUBLIC_SUPABASE_URL / ANON_KEY configuradas.')
    }
  }, [])

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      form: ''
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor, insira um email válido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseEnvConfigured()) {
      toast.error(
        'Configura NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local ou na Vercel.'
      )
      return
    }
    if (isUnreachableLegacySupabaseUrl()) {
      toast.error(
        'NEXT_PUBLIC_SUPABASE_URL aponta para um projeto Supabase antigo (ddpf…) que já não existe. Atualiza no Dashboard → API e na Vercel, depois redeploy.'
      )
      return
    }
    setLoading(true)
    setErrors({
      email: '',
      password: '',
      form: ''
    })

    if (!validateForm()) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message === 'Email not confirmed') {
          setErrors(prev => ({
            ...prev,
            form: 'Por favor, confirme seu email antes de fazer login.'
          }))
        } else {
          setErrors(prev => ({
            ...prev,
            form: 'Email ou senha inválidos'
          }))
        }
        return
      }

      const {
        data: { user: signedUser },
      } = await supabase.auth.getUser()
      if (!signedUser) {
        setErrors((prev) => ({
          ...prev,
          form: 'Sessão inválida após login. Tenta novamente.',
        }))
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', signedUser.id)
        .maybeSingle()

      const role = String(profile?.role ?? '')
        .trim()
        .toLowerCase()
      if (role !== 'admin') {
        await supabase.auth.signOut()
        setErrors((prev) => ({
          ...prev,
          form: 'Acesso reservado a administradores. Contacta a responsável se precisares de permissões.',
        }))
        return
      }

      // Navegação completa: garante que os cookies da sessão (chunked) chegam ao servidor antes do layout /admin.
      window.location.assign('/admin')
    } catch (error) {
      console.error('Erro de login:', error)
      const isNetwork =
        error instanceof TypeError &&
        /fetch|network|Failed to fetch/i.test(String(error.message))
      setErrors((prev) => ({
        ...prev,
        form: isNetwork
          ? 'Sem ligação ao servidor Supabase (URL errada ou projeto inexistente). Confirma NEXT_PUBLIC_SUPABASE_URL na Vercel e faz redeploy.'
          : 'Erro ao fazer login. Verifique suas credenciais.',
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isSupabaseEnvConfigured()) {
      toast.error(
        'Configura NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local ou na Vercel.'
      )
      return
    }
    if (isUnreachableLegacySupabaseUrl()) {
      toast.error(
        'Atualiza NEXT_PUBLIC_SUPABASE_URL na Vercel (projeto ddpf… já não existe) e faz redeploy.'
      )
      return
    }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthCallbackUrl('/admin'),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error:', error)
      setErrors(prev => ({
        ...prev,
        form: 'Ocorreu um erro durante o login com Google. Por favor, tente novamente.'
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login Administrativo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/signup" className="font-medium text-[#FF69B4] hover:text-[#FF1493]">
            criar uma nova conta
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!formMounted ? (
            <div className="space-y-6" aria-hidden>
              <div className="space-y-2">
                <div className="h-4 w-12 rounded bg-gray-200" />
                <div className="h-10 w-full rounded-md bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-14 rounded bg-gray-200" />
                <div className="h-10 w-full rounded-md bg-gray-100" />
              </div>
              <div className="h-10 w-full rounded-md bg-gray-100" />
              <div className="h-10 w-full rounded-md bg-gray-100" />
            </div>
          ) : (
            <>
              <SupabaseAuthConfigBanner />
              <form className="space-y-6" onSubmit={handleLogin}>
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
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF69B4] focus:border-[#FF69B4] sm:text-sm ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="mt-1">
                    <PasswordInput
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      error={errors.password}
                      className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF69B4] focus:border-[#FF69B4] sm:text-sm"
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-[#FF69B4] hover:text-[#FF1493]">
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </div>

                {errors.form && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{errors.form}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF69B4] hover:bg-[#FF1493] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF69B4] disabled:opacity-50"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                  </div>
                </div>

                <div className="mt-6">
                  <GoogleButton onClick={handleGoogleSignIn} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 