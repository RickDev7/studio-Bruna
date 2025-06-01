'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export function Hero() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll')
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top <= window.innerHeight * 0.75

        if (isVisible) {
          element.classList.add('opacity-100', 'translate-y-0')
          element.classList.remove('opacity-0', 'translate-y-4')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-[#FFC0CB]/20">
      {/* Imagem de fundo com efeito parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/hero-nails.jpg"
          alt="Studio Bruna - Estética & Unhas"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          className="opacity-50"
          priority
        />
      </div>

      {/* Conteúdo principal */}
      <div className="relative w-full py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-12">
            {/* Título com animação */}
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
                Bruna Silva - Aesthetic & Nails
              </h1>
              <p className="text-xl sm:text-2xl leading-relaxed text-gray-600 max-w-xl mx-auto">
                Realce sua beleza natural com nossos serviços especializados em estética e cuidados pessoais.
              </p>
            </div>

            {/* Botões com animação */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 animate-fade-in-up">
              <a
                href="/agendar"
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-[#FF69B4] hover:to-[#FFB6C1] transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                Agendar Horário
              </a>
              <a
                href="#servicos"
                className="w-full sm:w-auto text-lg font-semibold leading-6 text-gray-700 hover:text-[#FF69B4] transition-colors duration-200 flex items-center justify-center group"
              >
                Ver Serviços 
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 