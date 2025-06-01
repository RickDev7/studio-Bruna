import { useState } from 'react';
import { X } from 'lucide-react';
import { PlanDetails } from './PlanDetails';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  planos: Array<{
    id: string;
    name: string;
    description: string;
    precoFidelidade: string;
    precoSemFidelidade: string;
    beneficios: string[];
    imagem: string;
    destaque?: boolean;
  }>;
}

export function PlansModal({ isOpen, onClose, planos }: PlansModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Detalhes dos Planos</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-12">
          {planos.map((plano) => (
            <div key={plano.id} className="pb-12 border-b border-gray-200 last:border-0 last:pb-0">
              <PlanDetails plan={plano} isOpen={true} onClose={() => {}} />
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
} 