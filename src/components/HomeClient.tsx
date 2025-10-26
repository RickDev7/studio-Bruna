'use client'

import React from 'react';
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/sections/Hero'
import About from '@/components/sections/About'
import { Pricing } from '@/components/sections/Pricing'
import { Gallery } from '@/components/sections/Gallery'
import { AvisoAgendamento } from '@/components/AvisoAgendamento'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/data/translations'

const HomeClient = () => {
  const { t, language } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Aviso de Agendamento */}
        <AvisoAgendamento />
        
        <section id="servicos" className="py-24 bg-gradient-to-b from-white to-pink-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#FF69B4] font-medium text-sm uppercase tracking-wider">{t('services.title')}</span>
              <h2 className="mt-2 text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
                {t('services.subtitle')}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                {t('services.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card de Depilação */}
              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-pink-100">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] p-0.5 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#FF69B4] transform group-hover:scale-110 transition-transform duration-300">
                        <path d="M8 6h8" />
                        <path d="m12 6 4 14" />
                        <path d="M8 6c0-1.5.5-3 2.5-3s2.5 1.5 2.5 3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 group-hover:text-[#FF69B4] transition-colors duration-300">{t('services.depilation.title')}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {t('services.depilation.description')}
                  </p>
                  <ul className="mt-8 space-y-4">
                    {translations[language].services.depilation.services.map((service, index) => (
                      <li key={index} className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-[#FF69B4] mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card de Unhas */}
              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-pink-100">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] p-0.5 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#FF69B4] transform group-hover:scale-110 transition-transform duration-300">
                        <circle cx="6" cy="6" r="3" />
                        <path d="M8.12 8.12 12 12" />
                        <path d="M20 4 8.12 15.88" />
                        <circle cx="6" cy="18" r="3" />
                        <path d="M14.8 14.8 20 20" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 group-hover:text-[#FF69B4] transition-colors duration-300">{t('services.nails.title')}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {t('services.nails.description')}
                  </p>
                  <ul className="mt-8 space-y-4">
                    {translations[language].services.nails.services.map((service, index) => (
                      <li key={index} className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-[#FF69B4] mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card de Sobrancelhas & Cílios */}
              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-pink-100">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] p-0.5 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#FF69B4] transform group-hover:scale-110 transition-transform duration-300">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        <path d="M5 3v4" />
                        <path d="M19 17v4" />
                        <path d="M3 5h4" />
                        <path d="M17 19h4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 group-hover:text-[#FF69B4] transition-colors duration-300">{t('services.eyebrows.title')}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {t('services.eyebrows.description')}
                  </p>
                  <ul className="mt-8 space-y-4">
                    {translations[language].services.eyebrows.services.map((service, index) => (
                      <li key={index} className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-[#FF69B4] mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card de Tratamentos Faciais */}
              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-pink-100">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] p-0.5 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#FF69B4] transform group-hover:scale-110 transition-transform duration-300">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 group-hover:text-[#FF69B4] transition-colors duration-300">{t('services.facial.title')}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {t('services.facial.description')}
                  </p>
                  <ul className="mt-8 space-y-4">
                    {translations[language].services.facial.services.map((service, index) => (
                      <li key={index} className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-[#FF69B4] mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>
        <Gallery />
        <Pricing />
        <About />
      </main>
      <Footer />
    </div>
  )
}

export default HomeClient;