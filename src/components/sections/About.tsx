'use client'

import React from 'react';
import { Instagram } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function About() {
  const { t } = useLanguage()
  return (
    <section className="py-24 bg-white" id="sobre">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            {t('about.title')}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Coluna da Esquerda */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-64 h-64 rounded-full overflow-hidden relative">
                <Image
                  src="/images/bruna-profile.jpg"
                  alt="Bruna Silva - Aesthetic & Nails"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 256px"
                />
              </div>

              <h3 className="mt-8 text-2xl font-semibold text-gray-900">
                {t('about.name')}
              </h3>

              <p className="mt-4 text-gray-600 leading-relaxed">
                {t('about.welcome')}
              </p>

              <p className="mt-4 text-gray-600 leading-relaxed">
                {t('about.experience')}
              </p>

              <a
                href="https://www.instagram.com/bs.aesthetic.nails"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center text-[#FF69B4] hover:text-[#FFB6C1] transition-colors"
              >
                <Instagram className="h-5 w-5 mr-2" />
                {t('about.followInstagram')}
              </a>
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="bg-pink-50 rounded-2xl p-8">
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold text-[#FF69B4] mb-4">
                  {t('about.history.title')}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.history.description')}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[#FF69B4] mb-4">
                  {t('about.mission.title')}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.mission.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 