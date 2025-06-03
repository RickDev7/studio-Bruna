'use client'

import { useState } from 'react';
import { AppointmentFilters } from '@/components/admin/AppointmentFilters';
import { AppointmentCard } from '@/components/admin/AppointmentCard';
import { Calendar, ListFilter, Clock, XCircle } from 'lucide-react';
import { formatarData } from '@/utils/formatters';

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  user_name: string;
  user_email: string;
  user_phone: string;
}

// Simulação de dados - substitua pela integração real
const mockAppointments: Appointment[] = [
  {
    id: '1',
    service: 'Manicure',
    date: formatarData(new Date()),
    time: '09:00',
    status: 'confirmado',
    user_name: 'Maria Silva',
    user_email: 'maria@email.com',
    user_phone: '(11) 99999-9999'
  },
  {
    id: '2',
    service: 'Pedicure',
    date: formatarData(new Date()),
    time: '10:00',
    status: 'pendente',
    user_name: 'Ana Santos',
    user_email: 'ana@email.com',
    user_phone: '(11) 88888-8888'
  }
];

type ViewMode = 'list' | 'calendar';

export default function AgendamentosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);

  const handleFilterChange = (filters: {
    status: string[];
    date: 'all' | 'today' | 'week' | 'month';
    search: string;
  }) => {
    let filtered = [...appointments];

    // Filtro por status
    if (filters.status.length > 0) {
      filtered = filtered.filter(app => filters.status.includes(app.status));
    }

    // Filtro por data
    if (filters.date !== 'all') {
      const today = new Date();
      const appDate = new Date();

      filtered = filtered.filter(app => {
        // Implemente a lógica de filtro por data aqui
        return true; // Placeholder
      });
    }

    // Filtro por busca
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(app =>
        app.user_name.toLowerCase().includes(search) ||
        app.user_email.toLowerCase().includes(search)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusChange = (id: string, newStatus: 'confirmado' | 'pendente' | 'cancelado') => {
    const updatedAppointments = appointments.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments);
  };

  // Função para verificar se um agendamento é passado
  const isPastAppointment = (date: string, time: string) => {
    const [day, month, year] = date.split('/').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    return appointmentDate < new Date();
  };

  // Organizar agendamentos por categoria
  const categorizedAppointments = filteredAppointments.reduce((acc, appointment) => {
    const isPast = isPastAppointment(appointment.date, appointment.time);
    
    if (appointment.status === 'cancelado') {
      acc.canceled.push(appointment);
    } else if (isPast) {
      acc.past.push(appointment);
    } else {
      acc.upcoming.push(appointment);
    }
    
    return acc;
  }, {
    upcoming: [] as Appointment[],
    past: [] as Appointment[],
    canceled: [] as Appointment[]
  });

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-8 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Gerenciamento de Agendamentos"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
                Agendamentos
              </h1>
              <p className="mt-2 text-gray-600">
                Gerencie todos os agendamentos do salão
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded-lg transition-colors duration-200 flex items-center gap-2
                  ${viewMode === 'list'
                    ? 'bg-[#FF69B4] text-white'
                    : 'bg-white text-gray-600 hover:bg-pink-50'}
                `}
                aria-label="Visualizar em lista"
              >
                <ListFilter className="w-5 h-5" />
                <span className="hidden sm:inline">Lista</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`
                  p-2 rounded-lg transition-colors duration-200 flex items-center gap-2
                  ${viewMode === 'calendar'
                    ? 'bg-[#FF69B4] text-white'
                    : 'bg-white text-gray-600 hover:bg-pink-50'}
                `}
                aria-label="Visualizar em calendário"
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline">Calendário</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com filtros */}
          <aside className="lg:col-span-1">
            <AppointmentFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Lista de Agendamentos */}
          <section className="lg:col-span-3" aria-label="Lista de Agendamentos">
            {viewMode === 'list' ? (
              <div className="space-y-8">
                {/* Próximos Agendamentos */}
                {categorizedAppointments.upcoming.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#FF69B4]" />
                      Próximos Agendamentos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categorizedAppointments.upcoming.map(appointment => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Agendamentos Passados */}
                {categorizedAppointments.past.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#FF69B4]" />
                      Agendamentos Passados
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categorizedAppointments.past.map(appointment => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onStatusChange={handleStatusChange}
                          isPast={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Agendamentos Cancelados */}
                {categorizedAppointments.canceled.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-[#FF69B4]" />
                      Agendamentos Cancelados
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categorizedAppointments.canceled.map(appointment => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {filteredAppointments.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-500 text-lg">Nenhum agendamento encontrado</p>
                      <p className="text-gray-400 text-sm">Tente ajustar os filtros de busca</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex flex-col items-center gap-2">
                  <Calendar className="w-12 h-12 text-[#FF69B4]" />
                  <p className="text-gray-500 text-lg">
                    Visualização de calendário em desenvolvimento
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
} 