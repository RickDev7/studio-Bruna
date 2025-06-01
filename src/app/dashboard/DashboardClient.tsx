'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

interface Profile {
  id: string
  role: 'user' | 'admin' | null
  email: string
  full_name: string | null
  phone: string | null
  updated_at: string
}

interface DashboardClientProps {
  initialProfile: Profile | null
  userId: string
}

export function DashboardClient({ initialProfile, userId }: DashboardClientProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error: any) {
      toast.error('Erro ao sair. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Minha Conta</h1>
        <div className="space-x-4">
          {profile.role === 'admin' && (
            <Link
              href="/admin"
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Painel Admin
            </Link>
          )}
          <button
            onClick={signOut}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="text-gray-900">{profile.full_name || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="text-gray-900">{profile.phone || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo de Conta</p>
            <p className="text-gray-900 capitalize">{profile.role || 'user'}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 