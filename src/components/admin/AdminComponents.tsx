import { Tooltip } from '@/components/ui/Tooltip';
import { IconType } from 'react-icons';
import { 
  FaCalendarPlus, 
  FaCog, 
  FaList,
  FaCalendarAlt,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  isLoading?: boolean;
}

export function StatCard({ title, value, icon: Icon, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white/50 p-4 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 p-4 rounded-lg transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <Icon className="text-[#FF69B4] text-xl" />
        <p className="text-sm text-gray-500">{title}</p>
      </div>
      <p className="text-2xl font-semibold text-[#FF69B4] mt-2">{value}</p>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  icon: IconType;
  onClick: () => void;
  tooltip?: string;
}

export function ActionButton({ label, icon: Icon, onClick, tooltip }: ActionButtonProps) {
  const button = (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-lg 
                hover:bg-pink-100 transition-all duration-200 flex items-center gap-2
                focus:ring-2 focus:ring-pink-200 focus:outline-none"
      aria-label={label}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        {button}
      </Tooltip>
    );
  }

  return button;
}

export const adminIcons = {
  calendar: FaCalendarAlt,
  users: FaUsers,
  stats: FaChartLine,
  newAppointment: FaCalendarPlus,
  services: FaList,
  settings: FaCog,
}; 