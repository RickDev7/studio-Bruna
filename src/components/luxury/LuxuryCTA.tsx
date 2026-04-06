'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { FreshaButton } from '@/components/FreshaButton'
import { useLanguage } from '@/contexts/LanguageContext'

export function LuxuryCTA() {
  const { t, language } = useLanguage()
  const L = (k: string) => t(`luxury.${k}`)

  const waMsg =
    language === 'de'
      ? 'https://wa.me/4915208007814?text=Hallo+Bruna%2C+ich+m%C3%B6chte+einen+Termin+f%C3%BCr+%5BBehandlung%5D+anfragen.'
      : language === 'pt'
      ? 'https://wa.me/4915208007814?text=Ol%C3%A1+Bruna%2C+gostaria+de+informações+sobre+%5BServi%C3%A7o%5D.'
      : language === 'es'
      ? 'https://wa.me/4915208007814?text=Hola+Bruna%2C+me+gustar%C3%ADa+consultar+sobre+%5BTratamiento%5D.'
      : 'https://wa.me/4915208007814?text=Hello+Bruna%2C+I+would+like+to+enquire+about+%5BTreatment%5D.'

  return (
    <section
      className="relative flex min-h-[60vh] items-center overflow-hidden"
      style={{ backgroundColor: '#8A5C4A' }}
    >
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #C8A27A 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top edge accent */}
      <div className="absolute left-0 right-0 top-0 h-px bg-[#C8A27A]/40" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative mx-auto w-full max-w-3xl px-6 py-16 text-center sm:px-10 sm:py-20"
      >
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#C8A27A]">
          {L('cta.label')}
        </p>

        <h2 className="font-display mx-auto mt-5 max-w-[20ch] text-[2rem] font-normal italic leading-[1.25] tracking-tight text-[#F5F1EC] sm:text-[2.75rem] lg:text-[3.25rem]">
          {L('cta.headline')}
        </h2>

        <div className="mx-auto mt-6 h-px w-14 bg-[#C8A27A]/60" />

        <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-[1.7] text-[#F5F1EC]/60 sm:text-[0.9375rem]">
          {L('cta.text')}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <FreshaButton
            size="lg"
            className="w-full bg-[#C8A27A] px-8 hover:bg-[#F5F1EC] hover:text-[#8A5C4A] sm:w-auto"
          >
            {L('cta.fresha')}
          </FreshaButton>

          <a
            href={waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] border border-[#C8A27A]/50 bg-transparent px-8 text-sm font-medium text-[#F5F1EC]/80 transition-all duration-200 ease-out hover:border-[#C8A27A] hover:bg-[#C8A27A]/15 hover:text-[#F5F1EC] sm:w-auto"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  )
}
