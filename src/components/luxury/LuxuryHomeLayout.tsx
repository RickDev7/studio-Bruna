'use client'

import React from 'react'
import {
  Sparkles,
  Flower2,
  Clock3,
  CalendarDays,
  Award,
  MessageCircle,
  AlarmClock,
} from 'lucide-react'
import { CinematicHero } from '@/components/luxury/CinematicHero'
import { SectionWrapper } from '@/components/luxury/SectionWrapper'
import { LuxuryCTA } from '@/components/luxury/LuxuryCTA'
import { StorySection } from '@/components/luxury/StorySection'
import { ServiceCatalog } from '@/components/luxury/ServiceCatalog'
import { FRESHA_CONFIG } from '@/config/fresha'
import { useLanguage } from '@/contexts/LanguageContext'

export function LuxuryHomeLayout() {
  const { t, language } = useLanguage()
  const L = (k: string) => t(`luxury.${k}`)

  const whatsappBooking =
    language === 'de'
      ? 'https://wa.me/4915208007814?text=Hallo+Bruna%2C+ich+m%C3%B6chte+einen+Termin+f%C3%BCr+%5BBehandlung%5D+anfragen.'
      : language === 'pt'
      ? 'https://wa.me/4915208007814?text=Ol%C3%A1+Bruna%2C+gostaria+de+agendar+%5BServi%C3%A7o%5D.'
      : language === 'es'
      ? 'https://wa.me/4915208007814?text=Hola+Bruna%2C+me+gustar%C3%ADa+reservar+%5BTratamiento%5D.'
      : 'https://wa.me/4915208007814?text=Hello+Bruna%2C+I+would+like+to+book+%5BTreatment%5D.'

  const whatsappQuestion =
    language === 'de'
      ? 'https://wa.me/4915208007814?text=Hallo+Bruna%2C+ich+habe+eine+Frage+zu+Ihren+Dienstleistungen.'
      : language === 'pt'
      ? 'https://wa.me/4915208007814?text=Ol%C3%A1+Bruna%2C+tenho+uma+d%C3%BAvida+sobre+os+servi%C3%A7os.'
      : language === 'es'
      ? 'https://wa.me/4915208007814?text=Hola+Bruna%2C+tengo+una+pregunta+sobre+sus+servicios.'
      : 'https://wa.me/4915208007814?text=Hello+Bruna%2C+I+have+a+question+about+your+services.'

  return (
    <div className="bg-[#F5F1EC]">
      <CinematicHero />


      {/* ── Story ─────────────────────────────────────────────── */}
      <StorySection
        className="bg-[#F5F1EC]"
        title={L('story1.title')}
        subtitle={L('story1.sub')}
      />

      {/* ── Services ──────────────────────────────────────────── */}
      <SectionWrapper
        id="servicos"
        className="bg-[#F5F1EC]"
        label={L('services.label')}
        title={L('services.title')}
        subtitle={L('services.sub')}
      >
        {/* ── 5-category service catalog ────────────────────── */}
        <ServiceCatalog />

        {/* Comparison table */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#D6C1B1]">
          <div className="border-b border-[#D6C1B1] bg-[#E7DBD1] px-5 py-4 sm:px-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#C8A27A]">
              {L('services.compareLabel')}
            </p>
            <h3 className="font-display mt-0.5 text-lg italic text-[#8A5C4A] sm:text-xl">
              {L('services.compareTitle')}
            </h3>
          </div>
          <div className="grid grid-cols-3 bg-[#F5F1EC]">
            <div className="border-b border-[#D6C1B1] px-4 py-3 sm:px-5" />
            <div className="border-b border-l border-[#D6C1B1] px-4 py-3 text-center sm:px-5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#8A5C4A]/55">
                {L('services.compareClassic')}
              </p>
            </div>
            <div className="border-b border-l border-[#D6C1B1] bg-[#E7DBD1]/50 px-4 py-3 text-center sm:px-5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#C8A27A]">
                {L('services.compareShellac')}
              </p>
            </div>
            {[
              { name: L('services.compareRow1'), classic: '18€', shellac: '30€' },
              { name: L('services.compareRow2'), classic: '30€', shellac: '35€' },
            ].map((row, i) => (
              <React.Fragment key={row.name}>
                <div className={`px-4 py-4 sm:px-5 ${i === 0 ? 'border-b border-[#D6C1B1]/60' : ''}`}>
                  <p className="text-sm font-medium text-[#8A5C4A] sm:text-[0.9375rem]">{row.name}</p>
                </div>
                <div className={`border-l border-[#D6C1B1]/60 px-4 py-4 text-center sm:px-5 ${i === 0 ? 'border-b border-[#D6C1B1]/60' : ''}`}>
                  <p className="text-[0.9375rem] font-bold text-[#8A5C4A]">{row.classic}</p>
                </div>
                <div className={`border-l border-[#D6C1B1]/60 bg-[#E7DBD1]/35 px-4 py-4 text-center sm:px-5 ${i === 0 ? 'border-b border-[#D6C1B1]/60' : ''}`}>
                  <p className="text-[0.9375rem] font-bold text-[#C8A27A]">{row.shellac}</p>
                  <p className="mt-0.5 text-[0.65rem] text-[#8A5C4A]/45">{L('services.compareWeeks')}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="border-t border-[#D6C1B1] bg-[#F5F1EC] px-5 py-3 sm:px-6">
            <p className="text-[0.75rem] leading-[1.55] text-[#8A5C4A]/50">
              {L('services.compareFooter')}
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Experience ────────────────────────────────────────── */}
      <SectionWrapper
        className="bg-[#E7DBD1]"
        label={L('experience.label')}
        title={L('experience.title')}
        subtitle={L('experience.sub')}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: Flower2, title: L('experience.relaxTitle'), text: L('experience.relaxText') },
            { icon: Award, title: L('experience.exclTitle'), text: L('experience.exclText') },
            { icon: Sparkles, title: L('experience.indTitle'), text: L('experience.indText') },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border border-[#D6C1B1] bg-[#F5F1EC] p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(138,92,74,0.10)] sm:p-7"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6C1B1] bg-[#E7DBD1]">
                <Icon className="h-4 w-4 text-[#C8A27A]" />
              </div>
              <h4 className="font-display mt-4 text-base italic text-[#8A5C4A]">{title}</h4>
              <p className="mt-2 text-xs leading-[1.65] text-[#8A5C4A]/65 sm:text-sm">{text}</p>
            </div>
          ))}
        </div>

      </SectionWrapper>

      {/* ── About ─────────────────────────────────────────────── */}
      <SectionWrapper
        id="sobre"
        className="bg-[#F5F1EC]"
        label={L('about.label')}
        title={L('about.title')}
      >
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-6">
            <blockquote className="border-l-2 border-[#C8A27A] pl-5">
              <p className="font-display text-[1.2rem] italic leading-[1.45] text-[#8A5C4A] sm:text-[1.35rem]">
                {L('about.quote')}
              </p>
            </blockquote>
            <p className="text-sm leading-[1.75] text-[#2C2C2C] sm:text-[0.9375rem]">
              {L('about.bio')}
            </p>
            <a
              href="https://www.instagram.com/bs.aesthetic.nails"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-[9px] bg-[#C8A27A] px-5 text-sm font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#8A5C4A]"
            >
              <Sparkles className="h-4 w-4" />
              {L('about.instagram')}
            </a>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Breathing moment ─────────────────────────────────── */}
      <StorySection
        className="bg-[#E7DBD1]"
        title={L('story2.title')}
        subtitle={L('story2.sub')}
      />

      {/* ── Booking ──────────────────────────────────────────── */}
      <SectionWrapper
        className="bg-[#F5F1EC]"
        label={L('booking.label')}
        title={L('booking.title')}
        subtitle={L('booking.sub')}
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: AlarmClock,
                title: L('booking.pTitle'),
                sub: L('booking.pSub'),
                text: L('booking.pText'),
                cta: null,
              },
              {
                icon: Clock3,
                title: L('booking.cTitle'),
                sub: L('booking.cSub'),
                text: L('booking.cText'),
                cta: null,
              },
              {
                icon: MessageCircle,
                title: L('booking.qTitle'),
                sub: L('booking.qSub'),
                text: L('booking.qText'),
                cta: { href: whatsappQuestion, label: L('booking.qCta') },
              },
            ].map(({ icon: Icon, title, sub, text, cta }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl border border-[#D6C1B1] bg-[#F5F1EC] p-5 sm:p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6C1B1] bg-[#E7DBD1]">
                  <Icon className="h-4 w-4 text-[#C8A27A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#8A5C4A]">{title}</p>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[#C8A27A]">{sub}</p>
                </div>
                <p className="text-xs leading-[1.65] text-[#8A5C4A]/65 sm:text-sm">{text}</p>
                {cta ? (
                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-[36px] w-fit items-center gap-1.5 rounded-[7px] border border-[#D6C1B1] px-3.5 text-xs font-medium text-[#8A5C4A] transition-colors duration-200 hover:bg-[#E7DBD1]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                    {cta.label}
                  </a>
                ) : null}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#D6C1B1] bg-[#E7DBD1] px-6 py-5 sm:px-8 sm:py-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#C8A27A]">
              {L('booking.dLabel')}
            </p>
            <p className="mt-2 text-sm leading-[1.7] text-[#8A5C4A] sm:text-[0.9375rem]">
              {L('booking.dText')}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={FRESHA_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-[9px] bg-[#C8A27A] px-5 text-sm font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#8A5C4A]"
              >
                <CalendarDays className="h-4 w-4" />
                {L('booking.dFresha')}
              </a>
              <a
                href={whatsappBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-[9px] border border-[#D6C1B1] bg-[#F5F1EC] px-5 text-sm font-medium text-[#8A5C4A] transition-all duration-200 hover:bg-[#D6C1B1]"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                {L('booking.dWa')}
              </a>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <LuxuryCTA />
    </div>
  )
}
