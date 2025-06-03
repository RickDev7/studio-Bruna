import { Calendar, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface AppointmentFiltersProps {
  onFilterChange: (filters: {
    status: string[];
    date: 'all' | 'today' | 'week' | 'month';
    search: string;
  }) => void;
}

const statusOptions = [
  { value: 'confirmado', label: 'Confirmados' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'cancelado', label: 'Cancelados' },
];

const dateOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mês' },
];

export function AppointmentFilters({ onFilterChange }: AppointmentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status];
    
    setSelectedStatus(newStatus);
    onFilterChange({ status: newStatus, date: selectedDate, search: searchTerm });
  };

  const handleDateChange = (date: 'all' | 'today' | 'week' | 'month') => {
    setSelectedDate(date);
    onFilterChange({ status: selectedStatus, date, search: searchTerm });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({ status: selectedStatus, date: selectedDate, search: value });
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedDate('all');
    setSearchTerm('');
    onFilterChange({ status: [], date: 'all', search: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#FF69B4]" />
          Filtros
        </h3>
        {(selectedStatus.length > 0 || selectedDate !== 'all' || searchTerm) && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-[#FF69B4] flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Busca */}
        <div>
          <input
            type="text"
            placeholder="Buscar por nome do cliente..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF69B4] focus:border-[#FF69B4]"
          />
        </div>

        {/* Filtro por Data */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF69B4]" />
            Período
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dateOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleDateChange(option.value as any)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium
                  transition-colors duration-200
                  ${selectedDate === option.value
                    ? 'bg-pink-50 text-[#FF69B4] ring-1 ring-[#FF69B4]'
                    : 'bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-[#FF69B4]'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por Status */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium
                  transition-colors duration-200
                  ${selectedStatus.includes(option.value)
                    ? 'bg-pink-50 text-[#FF69B4] ring-1 ring-[#FF69B4]'
                    : 'bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-[#FF69B4]'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 