'use client'

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AppointmentsCalendar } from '@/components/admin/AppointmentsCalendar';
import { useRouter } from 'next/navigation';
import { useAdminStats } from '@/hooks/useAdminStats';
import { StatCard, ActionButton, adminIcons } from '@/components/admin/AdminComponents';
import { Calendar, ChevronLeft, ChevronRight, BarChart2, Users, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

interface DayProps {
  day: number;
  hasAppointment?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
}

const DayCell = ({ day, hasAppointment, isToday, isSelected }: DayProps) => (
  <button
    className={`
      relative w-8 h-8 flex items-center justify-center rounded-full text-sm
      ${isToday ? 'font-bold' : ''}
      ${isSelected ? 'bg-[#FF69B4] text-white' : 'hover:bg-pink-50'}
      ${hasAppointment ? 'text-[#FF69B4] font-medium' : 'text-gray-700'}
    `}
  >
    {day}
    {hasAppointment && (
      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#FF69B4] rounded-full" />
    )}
  </button>
);

export default function AdminDashboard() {
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
  }, [supabase, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF69B4]"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FF69B4]">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Gerencie os agendamentos e configurações do sistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Estatísticas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#FF69B4]" />
              Estatísticas
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4 text-[#FF69B4]" />
                  <span className="text-sm">Agendamentos hoje</span>
                </div>
                <p className="text-2xl font-bold text-[#FF69B4]">{stats.todayAppointments}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-[#FF69B4]" />
                  <span className="text-sm">Agendamentos esta semana</span>
                </div>
                <p className="text-2xl font-bold text-[#FF69B4]">{stats.weekAppointments}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-[#FF69B4]" />
                  <span className="text-sm">Total de clientes</span>
                </div>
                <p className="text-2xl font-bold text-[#FF69B4]">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          {/* Calendário e Agendamentos */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-pink-50 rounded-full">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Junho 2025</h2>
              <button className="p-2 hover:bg-pink-50 rounded-full">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-sm text-gray-500 font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => (
                <DayCell
                  key={i + 1}
                  day={i + 1}
                  hasAppointment={[4, 6, 15].includes(i + 1)}
                  isToday={i + 1 === 3}
                  isSelected={i + 1 === 3}
                />
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-4 text-sm text-gray-600 justify-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF69B4] rounded-full"></span>
                  <span>Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span>Hoje</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-200 rounded-full"></span>
                  <span>Com Agendamento</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/agendar"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 text-gray-700 hover:text-[#FF69B4]"
            >
              <Calendar className="w-5 h-5 text-[#FF69B4]" />
              <span>Novo Agendamento</span>
            </Link>
            
            <Link
              href="/admin/servicos"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 text-gray-700 hover:text-[#FF69B4]"
            >
              <Calendar className="w-5 h-5 text-[#FF69B4]" />
              <span>Gerenciar Serviços</span>
            </Link>
            
            <Link
              href="/admin/configuracoes"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 text-gray-700 hover:text-[#FF69B4]"
            >
              <Calendar className="w-5 h-5 text-[#FF69B4]" />
              <span>Configurações</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 