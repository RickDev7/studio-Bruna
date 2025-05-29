'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/config/supabase'
import { toast } from 'sonner'

export default function MagicLink() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      toast.error('Erro ao conectar com o banco de dados')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      setSubmitted(true)
      toast.success('Link mágico enviado! Verifique seu email.')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao enviar o link mágico. Por favor, tente novamente.')
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
              Enviamos um link mágico para <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-700">
              Clique no link enviado para fazer login automaticamente.
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
          Login com Link Mágico
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/login" className="font-medium text-[#FF69B4] hover:text-[#FF1493]">
            voltar para o login tradicional
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF69B4] focus:border-[#FF69B4] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF69B4] hover:bg-[#FF1493] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF69B4] disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar link mágico'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 