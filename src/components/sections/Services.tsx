'use client'

import { Scissors, Sparkles, Heart } from 'lucide-react'

const services = [
  {
    name: 'Unhas',
    description: 'Serviços profissionais para suas unhas.',
    icon: Scissors,
    items: ['Manicure', 'Pedicure', 'Nageldesign']
  },
  {
    name: 'Tratamentos Faciais',
    description: 'Cuidados especiais para sua pele.',
    icon: Sparkles,
    items: ['Gesichtspflege', 'Wimpernlift', 'Augenbrauenlifting', 'Hydra Lips']
  },
  {
    name: 'Outros Serviços',
    description: 'Serviços complementares para sua beleza.',
    icon: Heart,
    items: ['Fadentechnik', 'Haarentfernung mit Waxing']
  }
]

export function Services() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50" id="servicos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Dienstleistungen
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Professionelle Beauty- und Pflegebehandlungen
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.name} className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#FFC0CB] to-[#FFB6C1] rounded-lg opacity-25 blur-lg group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-xl transform group-hover:-translate-y-1 transition duration-500">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#FFC0CB] to-[#FFB6C1] rounded-full">
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{service.name}</h3>
                  <p className="mt-2 text-gray-500">{service.description}</p>
                  
                  <ul className="mt-6 space-y-3">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-[#FFC0CB] rounded-full mr-3"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-2">
            * 25% Rabatt für Neukunden!
          </p>
          <p className="text-gray-400 text-sm mb-8">
            (Nicht mit anderen Angeboten kombinierbar)
          </p>
          <a
            href="/agendar"
            className="inline-flex items-center px-8 py-3 border border-[#FFC0CB] text-base font-medium rounded-full text-white bg-[#FFC0CB] hover:bg-[#FFB6C1] transform hover:-translate-y-1 transition-all duration-300"
          >
            Jetzt Termin buchen
          </a>
        </div>
      </div>
    </section>
  )
} 