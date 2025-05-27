'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

export function Hero() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, {
      threshold: 0.1
    })

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach(element => observer.observe(element))

    return () => {
      elements.forEach(element => observer.unobserve(element))
    }
  }, [])

  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <h1 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Realce sua beleza natural com nossos cuidados especializados
          </h1>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 ease-out mt-6 text-lg leading-8 text-gray-600">
            Oferecemos serviços premium de estética e cuidados com unhas, proporcionando uma experiência única de bem-estar e beleza.
          </p>
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 ease-out mt-10 flex items-center gap-x-6">
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
        <div className="animate-on-scroll opacity-0 translate-x-4 transition-all duration-1000 delay-500 ease-out mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              src="/hero-image.jpg"
              alt="Serviços de estética e unhas"
              className="w-[76rem] rounded-md shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 