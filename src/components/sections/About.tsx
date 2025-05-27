'use client'

import { Instagram } from 'lucide-react'
import Image from 'next/image'

export function About() {
  return (
    <section className="py-24 bg-white" id="sobre">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Sobre Mim
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Especialista em Unhas e Tratamentos Estéticos
          </p>
        </div>

        <div className="mt-20">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-64 h-64 mb-8 rounded-full overflow-hidden relative bg-gradient-to-r from-[#FFC0CB] to-[#FFB6C1]">
                    <Image
                      src="/images/bruna-profile.jpg"
                      alt="Bruna Silva"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    BS Estética & Unhas
                  </h3>
                  <p className="mt-6 text-gray-600 leading-relaxed">
                    Bem-vinda ao meu estúdio de beleza! Como especialista em unhas e estética, 
                    dedico-me a oferecer serviços de alta qualidade e atendimento 
                    personalizado para cada cliente.
                  </p>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Com anos de experiência, ofereço serviços completos em design de unhas 
                    e tratamentos estéticos. Meu objetivo é realçar sua beleza natural, 
                    sempre utilizando produtos de primeira linha e técnicas atualizadas.
                  </p>
                  
                  <a
                    href="https://www.instagram.com/bs.aesthetic.nails?igsh=eXR0a2VqbmxqYXY0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center text-[#FFC0CB] hover:text-[#FFB6C1]"
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    Me siga no Instagram
                  </a>
                </div>
              </div>
              
              <div className="relative lg:h-full bg-gray-50">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFC0CB] to-[#FFB6C1] opacity-10"></div>
                <div className="relative h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Horário de Funcionamento</h3>
                    <div className="mt-4 space-y-2 text-gray-600">
                      <p>Segunda a Sexta: 9:00 - 13:00</p>
                      <p>Terça e Quinta: 15:00 - 18:00</p>
                      <p>Sábado: 9:30 - 17:00</p>
                    </div>
                    <div className="mt-6">
                      <a
                        href="/agendar"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#FFC0CB] hover:bg-[#FFB6C1]"
                      >
                        Agendar Horário
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 