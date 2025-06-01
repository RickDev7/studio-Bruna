'use client';

import { useParams } from 'next/navigation';
import { PlanDetails } from '@/components/PlanDetails';

const planos = [
  {
    id: 'basico',
    name: 'Plano Essencial',
    description: 'Cuidados básicos mensais para manter suas unhas sempre bonitas e saudáveis.',
    precoFidelidade: '40€',
    precoSemFidelidade: '45€',
    beneficios: [
      '1 Manicure com Shellac',
      '1 Pedicure simples',
      '10% de desconto em serviços adicionais'
    ],
    imagem: '/images/plano-basico.jpg'
  },
  {
    id: 'balance',
    name: 'Plano Equilíbrio',
    description: 'Autocuidado completo com serviços premium para sua beleza e bem-estar.',
    precoFidelidade: '65€',
    precoSemFidelidade: '70€',
    beneficios: [
      '1 Tratamento de unhas em gel',
      '1 Pedicure com Shellac',
      '1 Design de sobrancelhas',
      'Até 2 reparos de unhas',
      '10% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ],
    imagem: '/images/plano-equilibrio.jpg',
    destaque: true
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    description: 'Experiência VIP com tratamentos exclusivos e benefícios especiais.',
    precoFidelidade: '115€',
    precoSemFidelidade: '130€',
    beneficios: [
      '1 Spa pedicure com Shellac',
      '1 Tratamento de unhas em gel',
      '1 Limpeza facial',
      '1 Design de sobrancelhas',
      'Reparos ilimitados de unhas',
      '15% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ],
    imagem: '/images/plano-premium.jpg'
  }
];

export default function PlanPage() {
  const { id } = useParams();
  const plano = planos.find(p => p.id === id);

  if (!plano) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plano não encontrado</h1>
          <p className="text-gray-600 mb-8">O plano que você está procurando não existe.</p>
          <a
            href="/planos"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:opacity-90 transition-all duration-300"
          >
            Ver todos os planos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <PlanDetails plan={plano} isOpen={true} onClose={() => {}} />
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/pagamento?plano=${encodeURIComponent(plano.name)}&valor=${encodeURIComponent(plano.precoFidelidade)}&tipo=fidelidade`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:opacity-90 transition-all duration-300"
            >
              Assinar Plano
            </a>
            
            <a
              href="/planos"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-[#FF69B4] bg-white border-2 border-[#FFB6C1] hover:bg-pink-50 transition-all duration-300"
            >
              Voltar para Planos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 