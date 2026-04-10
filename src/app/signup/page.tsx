'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { PasswordInput } from '@/components/PasswordInput'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  /** Evita hydration mismatch (ex.: extensões com fdprocessedid nos inputs). */
  const [formMounted, setFormMounted] = useState(false)
  useEffect(() => {
    setFormMounted(true)
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (formData.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres')
      }

      if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
        throw new Error('O telefone deve ter 10 ou 11 dígitos')
      }

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
        }),
      })

      const text = await res.text()
      let payload: {
        error?: string
        code?: string
        raw?: string
        ok?: boolean
        preview?: string
      } = {}
      if (text) {
        try {
          payload = JSON.parse(text) as typeof payload
        } catch {
          payload = {
            error: `Resposta não é JSON (provavelmente página de erro HTML). Primeiros caracteres: ${text.slice(0, 120).replace(/\s+/g, ' ')}`,
          }
        }
      }

      if (!res.ok) {
        console.error('[signup] API', res.status, text?.slice(0, 500), payload)
        const detail =
          payload.error ||
          [payload.raw, payload.code != null && `código ${payload.code}`]
            .filter(Boolean)
            .join(' — ')
        throw new Error(detail || `Erro ${res.status} ao criar conta (corpo vazio).`)
      }

      toast.success('Conta criada com sucesso! Verifique seu email para confirmar.')
      router.push('/login?registered=true')
    } catch (error: unknown) {
      const isNetworkFail =
        error instanceof TypeError ||
        (error instanceof Error && error.message === 'Failed to fetch')
      const errorMessage = isNetworkFail
        ? 'Sem ligação ao servidor (Failed to fetch). Verifica a internet, recarrega a página e confirma que o npm run dev está a correr na mesma origem (ex.: não misturar portas 3000/3002).'
        : error instanceof Error
          ? error.message
          : 'Erro ao criar conta. Por favor, tente novamente.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Criar nova conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              href="/login"
              className="font-medium text-pink-600 hover:text-pink-500"
            >
              faça login em sua conta existente
            </Link>
          </p>
        </div>
        {!formMounted ? (
          <div className="mt-8 space-y-4" aria-hidden>
            <div className="rounded-md border border-gray-200 overflow-hidden space-y-px bg-gray-200">
              <div className="h-10 bg-gray-100" />
              <div className="h-10 bg-gray-100" />
              <div className="h-10 bg-gray-100" />
              <div className="h-10 bg-gray-100" />
            </div>
            <div className="h-10 w-full rounded-md bg-gray-100" />
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="fullName" className="sr-only">
                  Nome completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Nome completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">
                  Telefone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10,11}"
                  title="Digite um número de telefone válido (10 ou 11 dígitos)"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Telefone (apenas números)"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setFormData({ ...formData, phone: value })
                  }}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Senha
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Senha (mínimo 6 caracteres)"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 