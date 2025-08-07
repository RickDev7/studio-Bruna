'use client'

import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface PlanDetailsProps {
  plan: {
    id: string
    name: string
    description: string
    priceWithLoyalty: string
    priceWithoutLoyalty: string
    benefits: string[]
    image: string
  }
}

export function PlanDetails({ plan }: PlanDetailsProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Imagem do Plano */}
      <div className="relative h-64">
        <Image
          src={plan.image}
          alt={plan.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-2xl font-bold">{plan.name}</h2>
          <p className="text-white/90 mt-2">{plan.description}</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-8">
        {/* Preços */}
        <div className="space-y-4 mb-8">
          {/* Com Fidelização */}
          <div className="bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-2">{t('common.withLoyalty')}</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.priceWithLoyalty}</span>
                  <span className="ml-2 text-sm opacity-90">{t('common.perMonth')}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {t('common.loyaltyProgram')}
                </span>
              </div>
            </div>
          </div>

          {/* Sem Fidelização */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 mb-2">{t('common.withoutLoyalty')}</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-800">{plan.priceWithoutLoyalty}</span>
                  <span className="ml-2 text-sm text-gray-600">{t('common.perMonth')}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">
                  {t('common.noLoyaltyProgram')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefícios */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('planDetails.includedBenefits')}
          </h3>
          <ul className="space-y-3">
            {plan.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <Check className="w-5 h-5 text-[#FF69B4] mr-3 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 