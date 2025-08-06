import { useState, useEffect } from 'react'
import { createClient } from '@/config/supabase-client'

interface AdminStats {
  totalAppointments: number
  confirmedAppointments: number
  pendingAppointments: number
  canceledAppointments: number
  totalClients: number
  totalRevenue: number
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    canceledAppointments: 0,
    totalClients: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()

        // Buscar estatísticas de agendamentos
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('status')

        if (appointmentsError) throw appointmentsError

        // Buscar total de clientes
        const { count: clientsCount, error: clientsError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'client')

        if (clientsError) throw clientsError

        // Calcular estatísticas
        const stats = appointments?.reduce((acc, curr) => ({
          ...acc,
          totalAppointments: acc.totalAppointments + 1,
          confirmedAppointments: curr.status === 'confirmed' ? acc.confirmedAppointments + 1 : acc.confirmedAppointments,
          pendingAppointments: curr.status === 'pending' ? acc.pendingAppointments + 1 : acc.pendingAppointments,
          canceledAppointments: curr.status === 'canceled' ? acc.canceledAppointments + 1 : acc.canceledAppointments,
        }), {
          totalAppointments: 0,
          confirmedAppointments: 0,
          pendingAppointments: 0,
          canceledAppointments: 0,
          totalClients: clientsCount || 0,
          totalRevenue: 0 // Implementar cálculo de receita se necessário
        })

        setStats(stats || {
          totalAppointments: 0,
          confirmedAppointments: 0,
          pendingAppointments: 0,
          canceledAppointments: 0,
          totalClients: clientsCount || 0,
          totalRevenue: 0
        })
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
        setError(error instanceof Error ? error.message : 'Erro ao buscar estatísticas')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
} 