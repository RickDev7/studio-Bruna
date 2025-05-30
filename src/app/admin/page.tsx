'use client'

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AppointmentsCalendar } from '@/components/admin/AppointmentsCalendar';
import { useRouter } from 'next/navigation';
import { useAdminStats } from '@/hooks/useAdminStats';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const stats = useAdminStats();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Verificar se o usuário é admin
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar perfil:', error);
          router.push('/dashboard');
          return;
        }

        if (!profile || profile.role !== 'admin') {
          console.log('Usuário não é admin:', profile);
          router.push('/dashboard');
          return;
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        router.push('/login');
      }
    }

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF69B4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie os agendamentos e configurações do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar com estatísticas */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h2>
              {stats.error ? (
                <div className="text-red-500 text-sm">{stats.error}</div>
              ) : stats.isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Agendamentos hoje</p>
                    <p className="text-2xl font-semibold text-[#FF69B4]">{stats.todayAppointments}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Agendamentos esta semana</p>
                    <p className="text-2xl font-semibold text-[#FF69B4]">{stats.weekAppointments}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total de clientes</p>
                    <p className="text-2xl font-semibold text-[#FF69B4]">{stats.totalClients}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => router.push('/admin/agendar')}
                  className="w-full px-4 py-2 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200"
                >
                  Novo Agendamento
                </button>
                <button 
                  onClick={() => router.push('/admin/servicos')}
                  className="w-full px-4 py-2 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200"
                >
                  Gerenciar Serviços
                </button>
                <button 
                  onClick={() => router.push('/admin/configuracoes')}
                  className="w-full px-4 py-2 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200"
                >
                  Configurações
                </button>
              </div>
            </div>
          </div>

          {/* Calendário e lista de agendamentos */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <AppointmentsCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 