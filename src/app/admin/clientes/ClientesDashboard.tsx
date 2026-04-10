'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/config/supabase-client'
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
  const supabase = useMemo(() => createClient(), [])

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
    <div className="mx-auto max-w-7xl space-y-10 px-0 py-2">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-main)] md:text-4xl">
        Gerenciar Clientes
      </h1>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border)] text-left">
            <thead className="admin-table-head">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
                  Nome
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
                  Telefone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
                  Papel
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
                  Data de Cadastro
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-main)]/25">
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="whitespace-nowrap px-6 py-8 text-center text-sm text-[var(--text-main)]/65"
                  >
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="admin-table-row">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-[var(--text-main)]">
                        {client.full_name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-[var(--text-main)]/75">
                        {client.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-[var(--text-main)]/75">
                        {client.phone || 'Não informado'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex text-sm font-semibold ${
                          client.role === 'admin'
                            ? 'text-[var(--gold)]'
                            : 'text-[var(--text-main)]/80'
                        }`}
                      >
                        {client.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-main)]/70">
                      {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      {client.role === 'admin' ? (
                        <button
                          type="button"
                          onClick={() => removeAdmin(client.id)}
                          disabled={loading}
                          className="text-[#a85c5c] underline-offset-2 transition-opacity duration-300 hover:opacity-80 disabled:opacity-50"
                        >
                          Remover Admin
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => makeAdmin(client.id)}
                          disabled={loading}
                          className="text-[var(--gold)] underline-offset-2 transition-opacity duration-300 hover:opacity-80 disabled:opacity-50"
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