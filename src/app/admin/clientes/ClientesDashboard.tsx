'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Profile {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  created_at: string
}

interface ClientesDashboardProps {
  initialClients: Profile[]
}

export function ClientesDashboard({ initialClients }: ClientesDashboardProps) {
  const [clients, setClients] = useState(initialClients || [])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const makeAdmin = async (userId: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId)

      if (error) throw error

      setClients(prev =>
        prev.map(client =>
          client.id === userId ? { ...client, role: 'admin' } : client
        )
      )

      toast.success('Usuário promovido a administrador com sucesso!')
      router.refresh()
    } catch (error) {
      toast.error('Erro ao atualizar o papel do usuário')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeAdmin = async (userId: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', userId)

      if (error) throw error

      setClients(prev =>
        prev.map(client =>
          client.id === userId ? { ...client, role: 'user' } : client
        )
      )

      toast.success('Permissões de administrador removidas com sucesso!')
      router.refresh()
    } catch (error) {
      toast.error('Erro ao atualizar o papel do usuário')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Clientes</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Papel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {client.phone || 'Não informado'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex text-sm font-semibold ${
                        client.role === 'admin' ? 'text-pink-600' : 'text-gray-600'
                      }`}>
                        {client.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {client.role === 'admin' ? (
                        <button
                          onClick={() => removeAdmin(client.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Remover Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => makeAdmin(client.id)}
                          disabled={loading}
                          className="text-pink-600 hover:text-pink-900 disabled:opacity-50"
                        >
                          Tornar Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 