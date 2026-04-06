'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { FreshaButton } from '@/components/FreshaButton'

export function CinematicHero() {
  const { t } = useLanguage()
  const L = (k: string) => t(`luxury.${k}`)

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#F5F1EC]">

      {/* ── Background logo — full screen, objeto centrado ───── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/images/banner-logo-bs-v3.png"
          alt="Bruna Silva logo"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Overlay forte — disfarça o logo, mantém textura subtil */}
      <div className="absolute inset-0 bg-[#F5F1EC]/96" />

      {/* ── Content — vertically centered, left-anchored ─────── */}
      <div className="relative flex flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-28 sm:px-10 sm:pt-28 sm:pb-32 lg:pt-0 lg:pb-0">
          <div className="max-w-[520px]">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
              className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#8A5C4A]"
            >
              Bruna Silva · Aesthetic &amp; Nails
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
              className="font-display text-[2.6rem] font-normal italic leading-[1.25] tracking-tight text-[#8A5C4A] sm:text-[3.25rem] lg:text-[3.75rem]"
            >
              {L('hero.headline')}
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.38, delay: 0.3, ease: 'easeOut' }}
              className="mb-6 mt-7 h-px w-14 origin-left bg-[#C8A27A]"
            />

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.34, ease: 'easeOut' }}
              className="max-w-[42ch] text-sm leading-[1.75] text-[#8A5C4A]/80 sm:text-[0.9375rem]"
            >
              {L('hero.sub')}
            </motion.p>


            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.38, delay: 0.42, ease: 'easeOut' }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <FreshaButton size="lg" className="min-h-[52px] px-7">
                {L('hero.cta')}
              </FreshaButton>
              <a
                href="/#servicos"
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById('servicos')
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 88, behavior: 'smooth' })
                }}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-[10px] border border-[#D6C1B1] bg-[#F5F1EC]/70 px-7 text-sm font-medium text-[#8A5C4A]/70 backdrop-blur-sm transition-all duration-300 ease-out hover:border-[#C8A27A]/60 hover:bg-[#F5F1EC]/90 hover:text-[#8A5C4A]"
              >
                {L('hero.ctaServices')}
              </a>
            </motion.div>

          </div>
        </div>
      </div>

    </section>
  )
}
