'use client'

import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 py-20 bg-white sm:py-24 md:py-32">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                  Bruna Silva
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#FFC0CB] to-[#FFB6C1]">
                  Aesthetic & Nails
                </span>
              </h1>
              
              <p className="mt-8 text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Gönn dir eine Beauty-Auszeit! 
                <span className="block mt-2 font-light">
                  Professionelle Beauty- und Pflegebehandlungen für Ihr Wohlbefinden und Selbstbewusstsein.
                </span>
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/agendar"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-gradient-to-r from-[#FFC0CB] to-[#FFB6C1] hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Jetzt Termin buchen
                </a>
                <a
                  href="/#servicos"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-[#FFC0CB] bg-white border-2 border-[#FFC0CB] hover:bg-[#FFC0CB] hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Unsere Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 