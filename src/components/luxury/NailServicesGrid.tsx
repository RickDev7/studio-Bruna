'use client'

import { motion } from 'framer-motion'
import { Info, Sparkles, Hand, Droplets, Flower2, Scissors, Wind } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ServiceCategoryGrid, type ServiceEntry } from './ServiceCategoryGrid'

const NAIL_SERVICES: ServiceEntry[] = [
  {
    id: 'gel',
    nameDE: 'GELMODELLAGE',
    icon: Sparkles,
    names: { de: 'Gelmodellage', pt: 'Unhas em Gel', en: 'Gel Nails', es: 'Uñas en Gel' },
    descKey: 'luxury.svc.gelNeu',
    fromPrice: '35€',
    variants: {
      de: [{ label: 'Neu', price: '38€' }, { label: 'Auffüllen', price: '35€' }],
      pt: [{ label: 'Aplicação', price: '38€' }, { label: 'Manutenção', price: '35€' }],
      en: [{ label: 'New Set', price: '38€' }, { label: 'Refill', price: '35€' }],
      es: [{ label: 'Aplicación', price: '38€' }, { label: 'Relleno', price: '35€' }],
    },
  },
  {
    id: 'mani',
    nameDE: 'MANIKÜRE',
    icon: Hand,
    names: { de: 'Maniküre', pt: 'Manicure', en: 'Manicure', es: 'Manicura' },
    descKey: 'luxury.svc.maniShellac',
    fromPrice: '18€',
    variants: {
      de: [{ label: 'mit Shellac', price: '30€' }, { label: 'Klassisch', price: '18€' }],
      pt: [{ label: 'Com Verniz Gel', price: '30€' }, { label: 'Clássica', price: '18€' }],
      en: [{ label: 'with Shellac', price: '30€' }, { label: 'Classic', price: '18€' }],
      es: [{ label: 'con Shellac', price: '30€' }, { label: 'Clásica', price: '18€' }],
    },
  },
  {
    id: 'pedi',
    nameDE: 'PEDIKÜRE',
    icon: Flower2,
    names: { de: 'Pediküre', pt: 'Pedicure', en: 'Pedicure', es: 'Pedicura' },
    descKey: 'luxury.svc.pediShellac',
    fromPrice: '30€',
    variants: {
      de: [{ label: 'mit Shellac', price: '35€' }, { label: 'Klassisch', price: '30€' }],
      pt: [{ label: 'Com Verniz Gel', price: '35€' }, { label: 'Clássica', price: '30€' }],
      en: [{ label: 'with Shellac', price: '35€' }, { label: 'Classic', price: '30€' }],
      es: [{ label: 'con Shellac', price: '35€' }, { label: 'Clásica', price: '30€' }],
    },
  },
  {
    id: 'spa-pedi',
    nameDE: 'SPA PEDIKÜRE',
    icon: Droplets,
    names: { de: 'SPA Pediküre', pt: 'Pedicure SPA', en: 'SPA Pedicure', es: 'Pedicura SPA' },
    descKey: 'luxury.svc.spaPedi',
    fromPrice: '48€',
    variants: {
      de: [{ label: 'mit Shellac', price: '53€' }, { label: 'Klassisch', price: '48€' }],
      pt: [{ label: 'Com Verniz Gel', price: '53€' }, { label: 'Clássica', price: '48€' }],
      en: [{ label: 'with Shellac', price: '53€' }, { label: 'Classic', price: '48€' }],
      es: [{ label: 'con Shellac', price: '53€' }, { label: 'Clásica', price: '48€' }],
    },
  },
  {
    id: 'hand-spa',
    nameDE: 'HAND SPA',
    icon: Wind,
    names: { de: 'Hand SPA', pt: 'SPA de Mãos', en: 'Hand SPA', es: 'SPA de Manos' },
    descKey: 'luxury.svc.handSpa',
    fromPrice: '20€',
    variants: {
      de: [{ label: 'Hand SPA', price: '20€' }],
      pt: [{ label: 'SPA de Mãos', price: '20€' }],
      en: [{ label: 'Hand SPA', price: '20€' }],
      es: [{ label: 'SPA de Manos', price: '20€' }],
    },
  },
  {
    id: 'gel-removal',
    nameDE: 'GEL ENTFERNEN',
    icon: Scissors,
    names: { de: 'Gel Entfernen', pt: 'Remoção de Gel', en: 'Gel Removal', es: 'Eliminación de Gel' },
    descKey: 'luxury.svc.gelRemoval',
    fromPrice: '18€',
    variants: {
      de: [{ label: 'Gel Entfernen', price: '18€' }],
      pt: [{ label: 'Remoção de Gel', price: '18€' }],
      en: [{ label: 'Gel Removal', price: '18€' }],
      es: [{ label: 'Eliminación de Gel', price: '18€' }],
    },
  },
]

const EXTRAS = [
  { label: 'French / Babyboomer', price: '+5€' },
  { label: 'Nail Art', price: 'ab 2,50€' },
  { label: 'Nagelreparatur', price: 'ab 3,50€' },
  { label: 'Länge XL', price: 'ab 15€' },
]

export function NailServicesGrid() {
  const { t } = useLanguage()

  return (
    <div>
      {/* ── Service cards via generic grid ────────────────────── */}
      <ServiceCategoryGrid services={NAIL_SERVICES} />

      {/* ── Extras ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
        className="mt-8 overflow-hidden rounded-2xl border border-[#D6C1B1]"
      >
        <div className="border-b border-[#D6C1B1] bg-[#E7DBD1] px-6 py-4">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#C8A27A]">
            {t('luxury.nails.extrasLabel')}
          </p>
          <h3 className="font-display mt-0.5 text-base italic text-[#8A5C4A]">Extras</h3>
        </div>
        <div className="flex flex-wrap gap-3 bg-[#F5F1EC] px-6 py-5">
          {EXTRAS.map((extra) => (
            <div
              key={extra.label}
              className="flex items-center gap-2.5 rounded-full border border-[#D6C1B1] bg-[#F5F1EC] px-4 py-2 transition-colors duration-200 hover:border-[#C8A27A]/60 hover:bg-[#E7DBD1]"
            >
              <span className="text-xs font-medium text-[#8A5C4A]">{extra.label}</span>
              <span className="font-display text-sm font-semibold text-[#C8A27A]">{extra.price}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Important notes ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
        className="mt-4 flex gap-3.5 rounded-2xl border border-[#C8A27A]/25 bg-[#C8A27A]/[0.07] px-5 py-5"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A27A]" />
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[#8A5C4A]/60">
            {t('luxury.nails.notesTitle')}
          </p>
          <p className="mt-1.5 text-xs leading-[1.7] text-[#8A5C4A]/65 sm:text-sm">
            {t('luxury.nails.notesText')}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
