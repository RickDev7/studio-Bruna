'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Check } from 'lucide-react';

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
          <Link
            href="/planos"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:opacity-90 transition-all duration-300"
          >
            Ver todos os planos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Conteúdo do plano sem modal */}
          <div className="max-w-4xl mx-auto">
            {/* Header com gradiente */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
                    {plano.name}
                  </h1>
                  {plano.destaque && (
                    <div className="flex items-center mt-2 text-[#FF69B4]">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="text-sm font-medium">Plano Mais Popular</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conteúdo com grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={plano.imagem}
                  alt={plano.name || 'Imagem do plano'}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-gray-600 text-lg mb-6">{plano.description}</p>
                <div className="space-y-4">
                  {plano.beneficios.map((beneficio, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-[#FF69B4] mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{beneficio}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Opções de preço */}
            <div className="space-y-4 mb-8">
              {/* Com Fidelização */}
              <Link
                href={`/pagamento?plano=${encodeURIComponent(plano.name)}&valor=${encodeURIComponent(plano.precoFidelidade)}&tipo=fidelidade`}
                className="block bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white transform hover:scale-[1.02] transition-transform shadow-lg hover:shadow-xl group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-medium">Com Fidelização</p>
                    <p className="text-xs opacity-90">(3 ou 6 meses)</p>
                  </div>
                  <div className="bg-white/20 rounded-full px-3 py-1">
                    <p className="text-xs font-medium">Melhor Valor!</p>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plano.precoFidelidade}</span>
                  <span className="ml-2 text-sm">/mês</span>
                </div>
              </Link>

              {/* Sem Fidelização */}
              <Link
                href={`/pagamento?plano=${encodeURIComponent(plano.name)}&valor=${encodeURIComponent(plano.precoSemFidelidade)}&tipo=sem_fidelidade`}
                className="block bg-white p-6 rounded-2xl border-2 border-[#FFB6C1] transform hover:scale-[1.02] transition-transform shadow-lg hover:shadow-xl group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Sem Fidelização</p>
                    <p className="text-xs text-gray-500">Maior flexibilidade</p>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-800">{plano.precoSemFidelidade}</span>
                  <span className="ml-2 text-sm text-gray-600">/mês</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/pagamento?plano=${encodeURIComponent(plano.name)}&valor=${encodeURIComponent(plano.precoFidelidade)}&tipo=fidelidade`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:opacity-90 transition-all duration-300"
            >
              Assinar Plano
            </Link>
            
            <Link
              href="/planos"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-[#FF69B4] bg-white border-2 border-[#FFB6C1] hover:bg-pink-50 transition-all duration-300"
            >
              Voltar para Planos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 