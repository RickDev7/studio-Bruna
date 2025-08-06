'use client'

import React from 'react';
import { Instagram } from 'lucide-react'
import Image from 'next/image'

export default function About() {
  return (
    <section className="py-24 bg-white" id="sobre">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Sobre Mim
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Especialista em Unhas e Tratamentos Estéticos
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Coluna da Esquerda */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-64 h-64 rounded-full overflow-hidden relative">
                <Image
                  src="/images/bruna-profile.jpg"
                  alt="Bruna Silva"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 256px"
                />
              </div>

              <h3 className="mt-8 text-2xl font-semibold text-gray-900">
                Bruna Silva - Aesthetic & Nails
              </h3>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Bem-vinda ao meu Studio de Beleza! Como especialista em unhas e estética, 
                dedico-me a oferecer serviços de alta qualidade e atendimento 
                personalizado para cada cliente.
              </p>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Com anos de experiência, ofereço serviços abrangentes nas áreas de 
                design de unhas e tratamentos estéticos. Meu objetivo é realçar sua 
                beleza natural, sempre utilizando produtos de primeira linha e técnicas 
                atualizadas.
              </p>

              <a
                href="https://www.instagram.com/bs.aesthetic.nails"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center text-[#FF69B4] hover:text-[#FFB6C1] transition-colors"
              >
                <Instagram className="h-5 w-5 mr-2" />
                Siga-me no Instagram
              </a>
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="bg-pink-50 rounded-2xl p-8">
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold text-[#FF69B4] mb-4">
                  Nossa História
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  A Bruna Silva - Aesthetic & Nails nasceu do sonho de proporcionar 
                  serviços de beleza de alta qualidade em Cuxhaven. Com anos de 
                  experiência e formação especializada em Portugal, trazemos para a 
                  Alemanha o melhor da técnica portuguesa em serviços de beleza.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[#FF69B4] mb-4">
                  Nossa Missão
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Nosso compromisso é realçar a beleza natural de cada cliente, 
                  oferecendo serviços personalizados e de alta qualidade. Buscamos 
                  não apenas resultados estéticos excepcionais, mas também 
                  proporcionar uma experiência relaxante e acolhedora.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 