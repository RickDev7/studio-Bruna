import { Calendar, Clock, User, Scissors, CheckCircle2, AlertCircle, XCircle, Edit2, RefreshCw } from 'lucide-react';

interface AppointmentCardProps {
  appointment: {
    id: string;
    service: string;
    date: string;
    time: string;
    status: 'confirmado' | 'pendente' | 'cancelado';
    user_name: string;
    user_email: string;
    user_phone: string;
  };
  onStatusChange?: (id: string, status: 'confirmado' | 'pendente' | 'cancelado') => void;
  isPast?: boolean;
}

const statusConfig = {
  confirmado: {
    icon: CheckCircle2,
    label: 'Confirmado',
    className: 'bg-green-50 text-green-700 border-green-200',
    iconClass: 'text-green-600'
  },
  pendente: {
    icon: AlertCircle,
    label: 'Pendente',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    iconClass: 'text-yellow-600'
  },
  cancelado: {
    icon: XCircle,
    label: 'Cancelado',
    className: 'bg-red-50 text-red-700 border-red-200',
    iconClass: 'text-red-600'
  }
};

export function AppointmentCard({ appointment, onStatusChange, isPast = false }: AppointmentCardProps) {
  const { icon: StatusIcon, label: statusLabel, className: statusClassName, iconClass } = statusConfig[appointment.status];

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border transition-all duration-200
      ${isPast ? 'border-gray-200 opacity-75' : 'border-gray-100 hover:shadow-md'}
      ${appointment.status === 'cancelado' ? 'border-red-100 bg-red-50/10' : ''}
    `}>
      <div className="p-4">
        {/* Cabeçalho com Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-pink-50 p-2 rounded-lg">
              <Scissors className="w-5 h-5 text-[#FF69B4]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{appointment.service}</h3>
              <div className={`
                inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                ${statusClassName}
              `}>
                <StatusIcon className={`w-3.5 h-3.5 ${iconClass}`} />
                {statusLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Agendamento */}
        <div className="space-y-3 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-[#FF69B4]" />
              <span className="text-sm font-medium">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-[#FF69B4]" />
              <span className="text-sm font-medium">{appointment.time}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-gray-600 border-t border-gray-200 pt-3">
            <User className="w-4 h-4 text-[#FF69B4] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">{appointment.user_name}</p>
              <p className="text-xs text-gray-500">{appointment.user_email}</p>
              <p className="text-xs text-gray-500">{appointment.user_phone}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        {onStatusChange && appointment.status !== 'cancelado' && !isPast && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2 justify-end">
              {appointment.status === 'pendente' && (
                <button
                  onClick={() => onStatusChange(appointment.id, 'confirmado')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar
                </button>
              )}
              <button
                onClick={() => onStatusChange(appointment.id, 'cancelado')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <XCircle className="w-4 h-4" />
                Cancelar
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Reagendar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 