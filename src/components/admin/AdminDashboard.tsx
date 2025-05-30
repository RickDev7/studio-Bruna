'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

type Appointment = {
  id: string;
  created_at: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  user_id: string;
  user_name: string;
  user_email: string;
};

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      let query = supabase
        .from('appointments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('date', { ascending: true });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedAppointments = data.map(appointment => ({
        ...appointment,
        user_name: appointment.profiles.full_name,
        user_email: appointment.profiles.email
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }

  async function updateAppointmentStatus(id: string, status: 'confirmed' | 'cancelled') {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Agendamento ${status === 'confirmed' ? 'confirmado' : 'cancelado'} com sucesso`);
      loadAppointments();
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      toast.error('Erro ao atualizar agendamento');
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded ${filter === 'confirmed' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          >
            Confirmados
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded ${filter === 'cancelled' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          >
            Cancelados
          </button>
        </div>
        <button
          onClick={loadAppointments}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando agendamentos...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8">Nenhum agendamento encontrado</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(appointment.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{appointment.user_name}</div>
                      <div className="text-sm text-gray-500">{appointment.user_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {appointment.status === 'confirmed' ? 'Confirmado' :
                        appointment.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 