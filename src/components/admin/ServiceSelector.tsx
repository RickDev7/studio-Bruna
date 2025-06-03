import { services } from '@/data/services';
import { Check } from 'lucide-react';

interface ServiceSelectorProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
}

export function ServiceSelector({ selectedService, onServiceSelect }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service) => {
        const isSelected = selectedService === service.name;
        const Icon = service.icon;

        return (
          <button
            type="button"
            key={service.id}
            onClick={() => onServiceSelect(service.name)}
            className={`
              relative p-4 rounded-lg text-left transition-all duration-200
              group hover:shadow-md
              ${isSelected 
                ? 'bg-pink-50 border-2 border-[#FF69B4] shadow-sm' 
                : 'bg-white border-2 border-transparent hover:border-pink-100'}
            `}
            aria-pressed={isSelected}
          >
            <div className="flex items-start gap-4">
              <div className={`
                p-2 rounded-full 
                ${isSelected ? 'bg-[#FF69B4] text-white' : 'bg-pink-50 text-[#FF69B4]'}
              `}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`
                    font-medium text-lg
                    ${isSelected ? 'text-[#FF69B4]' : 'text-gray-900'}
                  `}>
                    {service.name}
                  </h3>
                  {isSelected && (
                    <Check 
                      className="w-5 h-5 text-[#FF69B4]" 
                      aria-hidden="true"
                    />
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-1">
                  {service.description}
                </p>
                
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-pink-50 text-xs text-[#FF69B4]">
                  Duração: {service.duration}
                </div>
              </div>
            </div>

            {/* Overlay de hover */}
            <div className={`
              absolute inset-0 rounded-lg border-2 border-[#FF69B4] opacity-0
              group-hover:opacity-100 transition-opacity duration-200
              pointer-events-none
              ${isSelected ? 'opacity-100' : ''}
            `} />
          </button>
        );
      })}
    </div>
  );
} 