'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const planos = [
  {
    id: 'basico',
    nome: 'Básico',
    descricao: 'Ideal para quem está começando sua jornada de cuidados com a beleza.',
    precoFidelidade: '40€',
    precoSemFidelidade: '45€',
    beneficios: [
      'Manicure com Shellac',
      'Pediküre com Shellac',
      'Design de Sobrancelhas',
      'Depilação de Sobrancelhas',
      'Limpeza de Pele Básica'
    ],
    imagem: '/images/plano-basico.png'
  },
  {
    id: 'balance',
    nome: 'Balance',
    descricao: 'Equilibrio perfeito entre cuidados básicos e tratamentos especiais.',
    precoFidelidade: '65€',
    precoSemFidelidade: '70€',
    beneficios: [
      'Tudo do plano Básico',
      'Gel Nails',
      'Spa Pediküre',
      'Brow Lamination',
      'Tratamentos Faciais Avançados',
      'Depilação Corporal'
    ],
    imagem: '/images/plano-balance.png'
  },
  {
    id: 'premium',
    nome: 'Premium',
    descricao: 'Experiência completa com todos os tratamentos e cuidados especiais.',
    precoFidelidade: '115€',
    precoSemFidelidade: '130€',
    beneficios: [
      'Tudo dos planos anteriores',
      'Nail Art Personalizada',
      'Tratamentos Faciais Premium',
      'Depilação Intima',
      'Sessões de Spa',
      'Consultoria Personalizada'
    ],
    imagem: '/images/plano-premium.png'
  }
];

export default function PlanoPage() {
  const params = useParams();
  const { t } = useLanguage();
  const planoId = params.id as string;
  
  const plano = planos.find(p => p.id === planoId);

  if (!plano) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB]/20 via-white to-[#FFE4E1]/20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Plano não encontrado</h1>
            <p className="text-gray-600">O plano solicitado não existe.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB]/20 via-white to-[#FFE4E1]/20">
      <Navbar />
      <main className="flex-1 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">{plano.nome}</h1>
              <p className="text-xl opacity-90">{plano.descricao}</p>
            </div>

            {/* Conteúdo */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Imagem */}
                <div className="relative h-80 rounded-2xl overflow-hidden">
                  <img
                    src={plano.imagem}
                    alt={plano.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Preços */}
                <div className="space-y-6">
                  {/* Com Fidelização */}
                  <div className="bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] p-6 rounded-2xl text-white">
                    <h3 className="text-lg font-semibold mb-2">{t('common.withLoyalty')}</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{plano.precoFidelidade}</span>
                      <span className="ml-2 text-sm">{t('common.perMonth')}</span>
                    </div>
                    <p className="text-sm opacity-90 mt-2">(3 ou 6 meses)</p>
                  </div>

                  {/* Sem Fidelização */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('common.withoutLoyalty')}</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-800">{plano.precoSemFidelidade}</span>
                      <span className="ml-2 text-sm text-gray-600">{t('common.perMonth')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Maior flexibilidade</p>
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('planDetails.includedBenefits')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plano.beneficios.map((beneficio, index) => (
                    <div key={index} className="flex items-center p-4 bg-pink-50 rounded-xl">
                      <div className="w-3 h-3 bg-[#FF69B4] rounded-full mr-3"></div>
                      <span className="text-gray-700">{beneficio}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-8 space-y-4">
                <a
                  href={`/pagamento?plano=${encodeURIComponent(plano.nome)}&valor=${encodeURIComponent(plano.precoFidelidade)}&tipo=fidelidade`}
                  className="block w-full py-4 px-6 bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] text-white rounded-full text-center font-semibold hover:opacity-90 transition-opacity"
                >
                  Contratar com Fidelização
                </a>
                <a
                  href={`/pagamento?plano=${encodeURIComponent(plano.nome)}&valor=${encodeURIComponent(plano.precoSemFidelidade)}&tipo=sem_fidelidade`}
                  className="block w-full py-4 px-6 border-2 border-[#FF69B4] text-[#FF69B4] rounded-full text-center font-semibold hover:bg-[#FF69B4] hover:text-white transition-colors"
                >
                  Contratar sem Fidelização
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 