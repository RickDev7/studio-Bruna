'use client'

import React from 'react'
import {
  Hand,
  Sparkles,
  Eye,
  FlaskConical,
  Scissors,
  HeartHandshake,
  CalendarCheck,
  Gem,
  Building2,
} from 'lucide-react'
import { FreshaButton } from '@/components/FreshaButton'
import { CategorySection } from '@/components/services/CategorySection'
import { ServiceCard } from '@/components/services/ServiceCard'
import { useLanguage } from '@/contexts/LanguageContext'

export function ServicesAndPricesSection() {
  const { t } = useLanguage()

  const bookingRules = [
    t('luxury.booking.dText'),
    t('luxury.booking.cText'),
  ]

  return (
    <section id="servicos" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mb-12 rounded-3xl border border-[var(--accent-soft)] bg-[var(--bg-secondary)] px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-main)] sm:text-5xl">
              Bruna Silva - Aesthetic &amp; Nails
            </h1>
            <p className="mt-3 text-base text-[var(--text-main)]/85 sm:text-lg">
              {t('luxury.services.title')}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--text-main)]/80 sm:text-base">
              {t('services.description')}
            </p>
            <div className="mt-8 flex justify-center">
              <FreshaButton size="lg">
                {t('hero.scheduleNow')}
              </FreshaButton>
            </div>
          </div>
        </section>

        <CategorySection icon={Gem} title={t('about.title')} subtitle="">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
            <article className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--bg-secondary)] p-5">
              <p className="leading-relaxed text-[var(--text-main)]/90">
                {t('luxury.about.bio')}
              </p>
            </article>
          </div>
        </CategorySection>

        <div className="my-12">
          <CategorySection icon={Building2} title="Studio" subtitle={t('gallery.description')}>
            <article className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--bg-secondary)] p-5">
              <p className="text-[var(--text-main)]/90">{t('gallery.safetyText')}</p>
            </article>
          </CategorySection>
        </div>

        <div className="space-y-8">
          <CategorySection icon={Hand} title={t('luxury.cats.nails')} subtitle="">
            <ServiceCard
              title={t('luxury.cats.nails')}
              items={[
                { label: 'GELMODELLAGE – Neu', price: '38€', description: t('luxury.svc.gelNeu') },
                { label: 'GELMODELLAGE – Auffüllen', price: '35€' },
                { label: 'MANIKÜRE – mit Shellac', price: '30€', description: t('luxury.svc.maniShellac') },
                { label: 'MANIKÜRE – Klassisch', price: '18€' },
                { label: 'PEDIKÜRE – mit Shellac', price: '35€', description: t('luxury.svc.pediShellac') },
                { label: 'PEDIKÜRE – Klassisch', price: '30€' },
              ]}
            />
          </CategorySection>

          <CategorySection
            icon={Sparkles}
            title={t('luxury.cats.spa')}
            subtitle=""
            note={t('luxury.svc.french')}
          >
            <ServiceCard
              title={t('luxury.cats.spa')}
              items={[
                { label: 'SPA PEDIKÜRE – mit Shellac', price: '53€' },
                { label: 'SPA PEDIKÜRE – Klassisch', price: '48€' },
                { label: 'HAND SPA', price: '20€' },
                { label: 'GEL ENTFERNEN', price: '18€' },
                { label: 'French / Babyboomer', price: '+5€' },
                { label: 'Nail Art', price: '2,50€+' },
                { label: 'Nagelreparatur', price: '3,50€+' },
                { label: 'Länge XL', price: '15€+' },
              ]}
            />
          </CategorySection>

          <CategorySection icon={Eye} title={t('luxury.cats.brows')} subtitle="">
            <ServiceCard
              title={t('luxury.cats.brows')}
              items={[
                { label: 'LASH LIFTING', price: '48€' },
                { label: 'WIMPERN FÄRBEN', price: '18€' },
                { label: 'BROW LAMINATION', price: '48€' },
                { label: 'AUGENBRAUEN DESIGN', price: 'auf Anfrage' },
                { label: 'BROW REGENERATION', price: '59€', description: t('luxury.svc.browRegen') },
                { label: 'BROW REGENERATION + MICRONEEDLING', price: '70€' },
              ]}
            />
          </CategorySection>

          <CategorySection icon={FlaskConical} title={t('luxury.cats.face')} subtitle="">
            <ServiceCard
              title={t('luxury.cats.face')}
              items={[
                { label: 'KLASSISCHE TIEFENREINIGUNG', price: '60€', description: t('luxury.svc.tiefenClass') },
                { label: 'INTENSIVE TIEFENREINIGUNG', price: '80€', description: t('luxury.svc.tiefenIntens') },
                { label: 'MICRONEEDLING', price: '80€', description: t('luxury.svc.microneedling') },
                { label: 'AHA PEELING', price: '80€', description: t('luxury.svc.ahaPeeling') },
                { label: 'HYDRA LIPS BASIC', price: '32€', description: t('luxury.svc.hydraBasic') },
                { label: 'HYDRA LIPS PRO (mit Microneedling)', price: '65€', description: t('luxury.svc.hydraPro') },
              ]}
            />
          </CategorySection>

          <CategorySection icon={HeartHandshake} title={t('luxury.cats.massage')} subtitle="">
            <ServiceCard
              title={t('luxury.cats.massage')}
              items={[
                { label: 'KÖRPERFORMENDE MASSAGE (30 Min.)', price: '35€' },
                { label: 'LYMPHDRAINAGE', price: '45€' },
                { label: 'TEILMASSAGE RELAX (30 Min.)', price: '30€' },
              ]}
            />
          </CategorySection>
        </div>

        <div className="mt-8">
          <CategorySection icon={CalendarCheck} title={t('luxury.booking.title')} subtitle={t('luxury.booking.sub')}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--bg-secondary)] p-5">
                <h4 className="mb-3 text-base font-semibold text-[var(--text-main)]">{t('luxury.booking.qSub')}</h4>
                <ul className="space-y-1 text-sm text-[var(--text-main)]/90">
                  <li>WhatsApp</li>
                  <li>Instagram</li>
                  <li>Fresha</li>
                </ul>
              </article>
              <article className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--bg-secondary)] p-5">
                <h4 className="mb-3 text-base font-semibold text-[var(--text-main)]">{t('luxury.booking.cSub')}</h4>
                <ul className="space-y-1 text-sm text-[var(--text-main)]/90">
                  {bookingRules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="mt-8 flex justify-center">
              <FreshaButton size="lg">
                {t('hero.scheduleNow')}
              </FreshaButton>
            </div>
          </CategorySection>
        </div>
      </div>
    </section>
  )
}
