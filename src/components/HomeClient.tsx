'use client'

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LuxuryHomeLayout } from '@/components/luxury/LuxuryHomeLayout'
import { SplashScreen } from '@/components/SplashScreen'
import { useLanguage } from '@/contexts/LanguageContext'

const HomeClient = () => {
  const { language } = useLanguage()
  const [splashDone, setSplashDone] = useState(false)

  const waHref =
    language === 'de'
      ? 'https://wa.me/4915208007814?text=Hallo+Bruna%2C+ich+m%C3%B6chte+einen+Termin+anfragen.'
      : language === 'pt'
      ? 'https://wa.me/4915208007814?text=Ol%C3%A1+Bruna%2C+gostaria+de+agendar+um+servi%C3%A7o.'
      : language === 'es'
      ? 'https://wa.me/4915208007814?text=Hola+Bruna%2C+me+gustar%C3%ADa+reservar+una+cita.'
      : 'https://wa.me/4915208007814?text=Hello+Bruna%2C+I+would+like+to+book+an+appointment.'

  const ariaLabel =
    language === 'de' ? 'Kontakt via WhatsApp'
    : language === 'pt' ? 'Contato via WhatsApp'
    : language === 'es' ? 'Contacto por WhatsApp'
    : 'Contact via WhatsApp'

  return (
    <>
      {/* Splash screen — rendered on top, unmounts after fade-out */}
      <SplashScreen onDone={() => setSplashDone(true)} />

      {/* Main site — already loaded in background, revealed when splash fades */}
      <div
        className="flex flex-col min-h-screen transition-opacity duration-500"
        style={{ opacity: splashDone ? 1 : 0 }}
      >
        <Navbar />
        <main className="flex-1">
          <LuxuryHomeLayout />
        </main>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all duration-300 ease-out hover:scale-[1.07] hover:bg-[#1ebe5d] hover:shadow-[0_6px_20px_rgba(37,211,102,0.45)]"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
        <Footer />
      </div>
    </>
  )
}

export default HomeClient;