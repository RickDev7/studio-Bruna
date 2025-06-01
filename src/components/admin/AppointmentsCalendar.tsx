'use client'

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Appointment } from '@/types/appointments';
import { Calendar } from '@/components/Calendar';

interface AppointmentsCalendarProps {
  onDateSelect?: (date: Date) => void;
}

export function AppointmentsCalendar({ onDateSelect }: AppointmentsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchAppointments() {
      setIsLoading(true);
      setError(null);

      try {
        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            service,
            date,
            time,
            status,
            notes,
            user_id,
            created_at,
            updated_at,
            profiles!inner (
              full_name,
              email
            )
          `)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])
          .eq('status', 'confirmed');

        if (error) throw error;

        // Garantir que os dados correspondem ao tipo Appointment
        const formattedAppointments = (data || []).map(appointment => {
          const { profiles, ...rest } = appointment;
          return {
            ...rest,
            profiles: {
              full_name: profiles?.[0]?.full_name || null,
              email: profiles?.[0]?.email || ''
            }
          } as Appointment;
        });

        setAppointments(formattedAppointments);
      } catch (err: any) {
        console.error('Erro ao buscar agendamentos:', err);
        setError('Não foi possível carregar os agendamentos');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAppointments();
  }, [selectedDate, supabase]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === dateString);
  };

  return (
    <div className="space-y-6">
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        highlightedDates={appointments.map(a => new Date(a.date))}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-6">
          <svg className="animate-spin w-8 h-8 text-pink-300" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}
          </h3>
          {getAppointmentsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500">Nenhum agendamento para esta data</p>
          ) : (
            <div className="space-y-2">
              {getAppointmentsForDate(selectedDate).map((appointment) => (
                <div key={appointment.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{appointment.service}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.profiles.full_name || 'Cliente'} - {appointment.profiles.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.time}
                  </p>
                  {appointment.notes && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      {appointment.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 