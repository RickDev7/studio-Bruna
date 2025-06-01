import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AdminStats {
  todayAppointments: number;
  weekAppointments: number;
  totalClients: number;
  isLoading: boolean;
  error: string | null;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    todayAppointments: 0,
    weekAppointments: 0,
    totalClients: 0,
    isLoading: true,
    error: null
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        // Data de hoje
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Data de início da semana (domingo)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

        // Data de fim da semana (sábado)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

        // Buscar agendamentos de hoje
        const { data: todayAppointments, error: todayError } = await supabase
          .from('appointments')
          .select('id')
          .eq('date', todayStr)
          .eq('status', 'confirmed');

        if (todayError) throw todayError;

        // Buscar agendamentos da semana
        const { data: weekAppointments, error: weekError } = await supabase
          .from('appointments')
          .select('id')
          .gte('date', startOfWeekStr)
          .lte('date', endOfWeekStr)
          .eq('status', 'confirmed');

        if (weekError) throw weekError;

        // Buscar total de clientes únicos
        const { data: uniqueClients, error: clientsError } = await supabase
          .from('profiles')
          .select('id')
          .neq('role', 'admin');

        if (clientsError) throw clientsError;

        setStats({
          todayAppointments: todayAppointments?.length || 0,
          weekAppointments: weekAppointments?.length || 0,
          totalClients: uniqueClients?.length || 0,
          isLoading: false,
          error: null
        });
      } catch (err: any) {
        console.error('Erro ao buscar estatísticas:', err);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao carregar estatísticas'
        }));
      }
    }

    fetchStats();
  }, [supabase]);

  return stats;
} 