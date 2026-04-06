'use client'

import Image from 'next/image'
import { Instagram, MapPin, Mail, MessageCircle, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { FRESHA_CONFIG } from '@/config/fresha'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-[#2C2C2C]" id="contatos">
      {/* Gold accent top border */}
      <div className="h-[3px] w-full bg-[#C8A27A]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:py-16 md:grid-cols-3 md:gap-8 lg:gap-14">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-display text-xl italic text-[#F5F1EC]">Bruna Silva</p>
              <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#C8A27A]">
                Aesthetic &amp; Nails · Cuxhaven
              </p>
            </div>
            <p className="max-w-[36ch] text-sm leading-[1.7] text-[#F5F1EC]/50">
              {t('footer.slogan')}
            </p>
            <div className="mt-1 flex gap-3">
              <a
                href="https://www.instagram.com/bs.aesthetic.nails"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F5F1EC]/10 text-[#F5F1EC]/40 transition-colors duration-200 hover:border-[#C8A27A]/50 hover:text-[#C8A27A]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/4915208007814"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F5F1EC]/10 text-[#F5F1EC]/40 transition-colors duration-200 hover:border-[#25D366]/50 hover:text-[#25D366]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links column */}
          <div className="flex flex-col gap-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#C8A27A]">
              Links
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { href: 'https://wa.me/4915208007814', icon: MessageCircle, label: 'WhatsApp · +49 152 0800 7814', color: 'hover:text-[#25D366]' },
                { href: 'https://www.instagram.com/bs.aesthetic.nails', icon: Instagram, label: '@bs.aesthetic.nails', color: 'hover:text-[#C8A27A]' },
                { href: FRESHA_CONFIG.url, icon: ExternalLink, label: t('nav.schedule'), color: 'hover:text-[#C8A27A]' },
              ].map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 text-sm text-[#F5F1EC]/50 transition-colors duration-200 ${color}`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div className="flex flex-col gap-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#C8A27A]">
              {t('footer.contact')}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.google.com/maps/place/Bruna+Silva+-+Aesthetic+%26+Nails/@53.8412161,8.7260103,19z/data=!3m1!4b1!4m6!3m5!1s0x47b401a4dd9c26d9:0x4498ec52d00a746b!8m2!3d53.8412161!4d8.726654!16s%2Fg%2F11x646h3bx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm leading-[1.6] text-[#F5F1EC]/50 transition-colors duration-200 hover:text-[#C8A27A]"
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8A27A]" />
                <span>Bei der Grodener Kirche 7<br />27472 Cuxhaven, Deutschland</span>
              </a>
              <a
                href="mailto:bs.aestheticnails@gmail.com"
                className="flex items-center gap-2.5 text-sm text-[#F5F1EC]/50 transition-colors duration-200 hover:text-[#C8A27A]"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#C8A27A]" />
                bs.aestheticnails@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#F5F1EC]/8 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#F5F1EC]/30">
            © 2025 Bruna Silva – Aesthetic &amp; Nails · Cuxhaven
          </p>
          <p className="text-xs text-[#F5F1EC]/25">
            {t('footer.vatNote')}
          </p>
        </div>
      </div>
    </footer>
  )
}
