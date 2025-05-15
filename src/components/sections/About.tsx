'use client'

import { Instagram } from 'lucide-react'

export function About() {
  return (
    <section className="py-24 bg-white" id="sobre">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Über Mich
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Spezialistin für Nägel und ästhetische Behandlungen
          </p>
        </div>

        <div className="mt-20">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-semibold text-gray-900">
                  BS Aesthetic Nails
                </h3>
                <p className="mt-6 text-gray-600 leading-relaxed">
                  Willkommen in meinem Beauty-Studio! Als Spezialistin für Nägel und Ästhetik 
                  widme ich mich der Bereitstellung hochwertiger Dienstleistungen und 
                  individueller Betreuung für jeden Kunden.
                </p>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Mit jahrelanger Erfahrung biete ich umfassende Dienstleistungen in den Bereichen 
                  Maniküre, Pediküre, Augenbrauendesign und ästhetische Behandlungen an, 
                  stets unter Verwendung erstklassiger Produkte und aktueller Techniken.
                </p>
                
                <a
                  href="https://www.instagram.com/bs.aesthetic.nails?igsh=eXR0a2VqbmxqYXY0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#FFC0CB] hover:text-[#FFB6C1]"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  Folgen Sie mir auf Instagram
                </a>
              </div>
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFC0CB] to-[#FFB6C1] opacity-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Öffnungszeiten</h3>
                    <div className="mt-4 space-y-2 text-gray-600">
                      <p>Montag bis Freitag: 9:00 - 13:00</p>
                      <p>Dienstag und Donnerstag: 15:00 - 18:00</p>
                      <p>Samstag: 9:30 - 17:00</p>
                    </div>
                    <div className="mt-6">
                      <a
                        href="/agendar"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#FFC0CB] hover:bg-[#FFB6C1]"
                      >
                        Termin Buchen
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