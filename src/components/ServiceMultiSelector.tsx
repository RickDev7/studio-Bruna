'use client';

import { Service, services } from '@/config/services';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ServiceMultiSelectorProps {
  onSelect: (selectedServices: string[]) => void;
  initialSelected?: string[];
}

export function ServiceMultiSelector({ onSelect, initialSelected = [] }: ServiceMultiSelectorProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(initialSelected);
  const [selectedCategory, setSelectedCategory] = useState<Service['category']>('nails');
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    setIsInteractive(true);
  }, []);

  const toggleService = (serviceId: string) => {
    if (!isInteractive) return;
    
    const newSelected = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(newSelected);
    onSelect(newSelected);
  };

  const categories = [
    { id: 'nails', name: 'Unhas', description: 'Serviços para suas unhas' },
    { id: 'face', name: 'Rosto', description: 'Tratamentos faciais' },
    { id: 'eyebrows', name: 'Sobrancelhas & Pestanas', description: 'Design e embelezamento' },
    { id: 'waxing', name: 'Depilação', description: 'Serviços de depilação' },
  ];

  const filteredServices = services.filter(service => service.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Seletor de Categorias */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id as Service['category'])}
            className={`flex-1 min-w-[200px] p-4 rounded-xl transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-pink-50 border-2 border-[#FF69B4] text-[#FF69B4]'
                : 'bg-white border border-pink-100 text-gray-600 hover:border-pink-200 hover:bg-pink-50'
            }`}
          >
            <h3 className="font-medium text-lg">{category.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
          </button>
        ))}
      </div>

      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => toggleService(service.id)}
              className={`relative p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-pink-50 border-2 border-[#FF69B4] transform scale-[1.02]'
                  : 'bg-white border border-pink-100 hover:border-pink-200 hover:bg-pink-50 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium text-lg ${isSelected ? 'text-[#FF69B4]' : 'text-gray-900'}`}>
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                </div>
                <div 
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#FF69B4] border-[#FF69B4]'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Resumo da Seleção */}
      {selectedServices.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-br from-pink-50 to-white rounded-xl border border-pink-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Serviços Selecionados ({selectedServices.length})
          </h3>
          <ul className="space-y-3">
            {selectedServices.map((serviceId) => {
              const service = services.find(s => s.id === serviceId);
              if (!service) return null;
              return (
                <li key={serviceId} className="flex items-center justify-between">
                  <span className="text-gray-600">{service.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
} 