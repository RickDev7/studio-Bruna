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
    handleScroll() // Checa elementos visíveis no carregamento inicial

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative isolate min-h-screen flex items-center">
      {/* Fundo gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-pink-50 to-white opacity-90" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="text-center lg:text-left">
            <h1 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Realce sua beleza natural com nossos cuidados especializados
            </h1>
            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 ease-out mt-6 text-lg leading-8 text-gray-600">
              Oferecemos serviços premium de estética e cuidados com unhas, proporcionando uma experiência única de bem-estar e beleza.
            </p>
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 ease-out mt-10 flex items-center gap-x-6 justify-center lg:justify-start">
              <a
                href="/agendar"
                className="rounded-md bg-[#FFC0CB] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FFB6C1] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC0CB] transition-all duration-300"
              >
                Agendar Horário
              </a>
              <a
                href="/#todos-servicos"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#FFC0CB] transition-colors duration-200 group"
              >
                Nossos Serviços <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative">
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-400 ease-out">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/images/hero-nails.jpg"
                  alt="Serviços de estética e unhas"
                  width={800}
                  height={600}
                  className="object-cover object-center w-full h-full shadow-2xl"
                  priority
                  quality={100}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 