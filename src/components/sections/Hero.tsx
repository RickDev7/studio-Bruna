'use client'

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
  return (
    <div className="relative h-[600px] md:h-[700px] lg:h-[800px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-nails.jpg"
          alt="Hero background"
          fill
          priority
          quality={100}
          style={{ objectFit: 'cover', objectPosition: 'center 37%' }}
        />
        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
      </div>

      {/* Conteúdo */}
      <div className="relative h-full flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fadeIn">
            <span className="block text-white mb-4 drop-shadow-lg">
              Bruna Silva
            </span>
            <span className="block bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] bg-clip-text text-transparent">
              Aesthetic & Nails
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fadeIn delay-200">
            <span className="block font-medium drop-shadow-lg">
              Permita-se um momento de beleza!
            </span>
            <span className="block mt-2 font-light text-white/80">
              Tratamentos profissionais de beleza e cuidados para seu bem-estar e autoestima.
            </span>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn delay-300">
            <Link
              href="/agendar"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Agendar agora
            </Link>

            <Link
              href="/#servicos"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              Nossos Serviços
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 