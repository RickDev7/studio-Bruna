'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FreshaButton } from '@/components/FreshaButton'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SobrePage() {
  const { t } = useLanguage()

  const valueItems = [0, 1, 2, 3, 4].map((i) => t(`about.values.items.${i}`))

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1EC]">
      <Navbar />
      <main className="flex-1 py-16 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 text-center">
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-[#C8A27A]">
              {t('luxury.about.label')}
            </p>
            <h1 className="font-display text-4xl italic text-[#8A5C4A]">
              {t('about.title')}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base text-[#8A5C4A]/65">
              {t('about.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-2xl border border-[#D6C1B1] bg-white p-8">
              <h3 className="font-display text-xl italic text-[#8A5C4A]">{t('about.mission.title')}</h3>
              <p className="mt-3 text-sm leading-[1.75] text-[#8A5C4A]/70">{t('about.mission.description')}</p>
            </div>

            {/* Values */}
            <div className="rounded-2xl border border-[#D6C1B1] bg-white p-8">
              <h3 className="font-display text-xl italic text-[#8A5C4A]">{t('about.values.title')}</h3>
              <ul className="mt-3 space-y-3">
                {valueItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A27A]" />
                    <span className="text-sm text-[#8A5C4A]/75">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* History */}
            <div className="rounded-2xl border border-[#D6C1B1] bg-white p-8">
              <h3 className="font-display text-xl italic text-[#8A5C4A]">{t('about.history.title')}</h3>
              <p className="mt-3 text-sm leading-[1.75] text-[#8A5C4A]/70">{t('about.history.description')}</p>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-[#D6C1B1] bg-white p-8">
              <h3 className="font-display text-xl italic text-[#8A5C4A]">{t('about.location.title')}</h3>
              <p className="mt-3 text-sm leading-[1.75] text-[#8A5C4A]/70">{t('about.location.text')}</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <FreshaButton size="lg">
              {t('about.bookButton')}
            </FreshaButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
