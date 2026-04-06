'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

type Language = 'de' | 'pt' | 'en' | 'es'
type ServiceVariant = { label: string; price: string }

export type ServiceEntry = {
  id: string
  nameDE: string
  icon: React.ElementType
  names: Record<Language, string>
  descKey: string
  fromPrice: string
  variants: Record<Language, ServiceVariant[]>
}

interface Props {
  services: ServiceEntry[]
}

export function ServiceCategoryGrid({ services }: Props) {
  const { t, language } = useLanguage()
  const lang = language as Language
  const [selected, setSelected] = useState<ServiceEntry | null>(null)

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  return (
    <>
      {/* ── Cards grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {services.map((svc) => {
          const Icon = svc.icon
          return (
            <motion.button
              key={svc.id}
              onClick={() => setSelected(svc)}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="group relative flex flex-col items-center gap-2 rounded-2xl border border-[#E5D9CC] bg-white p-4 text-center shadow-sm transition-shadow duration-200 hover:border-[#C8A27A] hover:shadow-[0_6px_20px_rgba(200,162,122,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A27A]"
            >
              {/* gold top bar on hover */}
              <span className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-[#C8A27A] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              {/* icon */}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F1EC]">
                <Icon className="h-5 w-5 text-[#C8A27A]" strokeWidth={1.5} />
              </span>

              {/* nameDE badge */}
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#C8A27A]">
                {svc.nameDE}
              </span>

              {/* translated name */}
              <span className="font-display text-[1rem] italic leading-tight text-[#2C2C2C]">
                {svc.names[lang]}
              </span>

              {/* description (clamped) */}
              <p className="line-clamp-2 text-[0.75rem] leading-[1.55] text-[#6B5B4E]/75">
                {t(svc.descKey)}
              </p>

              {/* from price */}
              <span className="mt-auto inline-block rounded-full bg-[#F5F1EC] px-3 py-0.5 text-[0.75rem] font-semibold text-[#8A5C4A]">
                {t('luxury.nails.fromPrice')} {svc.fromPrice}
              </span>

              {/* details hint */}
              <span className="text-[0.72rem] font-medium text-[#C8A27A] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {t('luxury.nails.detailsBtn')} →
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* ── Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            >
              {/* gold stripe */}
              <div className="h-1 w-full bg-gradient-to-r from-[#C8A27A] via-[#E8D5BC] to-[#C8A27A]" />

              <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
                {/* header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#C8A27A]">
                      {selected.nameDE}
                    </p>
                    <h3 className="font-display text-2xl italic text-[#2C2C2C]">
                      {selected.names[lang]}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F5F1EC] text-[#8A5C4A] transition-colors hover:bg-[#E5D9CC]"
                    aria-label={t('luxury.nails.close')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* description */}
                <p className="mb-5 text-[0.9rem] leading-[1.7] text-[#6B5B4E]">
                  {t(selected.descKey)}
                </p>

                {/* variants */}
                {(selected.variants[lang]?.length ?? 0) > 0 && (
                  <div>
                    <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#C8A27A]">
                      {t('luxury.nails.variants')}
                    </p>
                    <ul className="space-y-2">
                      {selected.variants[lang].map((v, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between rounded-xl border border-[#E5D9CC] bg-[#FAF7F4] px-4 py-3"
                        >
                          <span className="text-[0.9rem] text-[#2C2C2C]">{v.label}</span>
                          <span className="text-[0.95rem] font-semibold text-[#8A5C4A]">{v.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
