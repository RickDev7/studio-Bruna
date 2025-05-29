'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/config/supabase'
import { toast } from 'sonner'

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    if (!supabase) {
      toast.error('Erro ao conectar com o banco de dados')
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push('/login')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <Link
              href="/dashboard"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                pathname === '/dashboard'
                  ? 'bg-[#FF69B4] text-white'
                  : 'text-gray-600 hover:bg-[#FFB6C1] hover:text-white'
              }`}
            >
              Contatos
            </Link>
            <Link
              href="/dashboard/agendamentos"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                pathname === '/dashboard/agendamentos'
                  ? 'bg-[#FF69B4] text-white'
                  : 'text-gray-600 hover:bg-[#FFB6C1] hover:text-white'
              }`}
            >
              Agendamentos
            </Link>
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <button
            onClick={handleSignOut}
            className="flex-shrink-0 w-full group block"
          >
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#FF69B4]">
                  Sair
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </aside>
  )
} 