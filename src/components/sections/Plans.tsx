'use client'

import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Basis-Plan',
    description: 'Grundlegende Pflege',
    price: '40',
    priceWithoutLoyalty: '45',
    features: [
      '1 Maniküre mit Shellac',
      '1 einfache Pediküre',
      '10% Rabatt auf zusätzliche Dienstleistungen'
    ],
    details: 'Ideal für Kunden, die ihre Hände und Füße mit einer monatlichen Grundpflege gepflegt halten möchten.',
    savings: '',
    totalValue: '50'
  },
  {
    name: 'Balance-Plan',
    description: 'Komplette Selbstpflege',
    price: '65',
    priceWithoutLoyalty: '70',
    features: [
      '1 Gel-Nagelpflege',
      '1 Pediküre mit Shellac',
      '1 Augenbrauen-Design',
      'Bis zu 2 Nagelreparaturen',
      '10% Rabatt auf zusätzliche Dienstleistungen',
      'Terminpriorität'
    ],
    details: 'Perfekt für alle, die immer perfekt gepflegte Nägel und Augenbrauen haben möchten.',
    savings: '',
    totalValue: '77'
  },
  {
    name: 'Premium-Plan',
    description: 'VIP-Erlebnis',
    price: '115',
    priceWithoutLoyalty: '130',
    features: [
      '1 Spa-Pediküre mit Shellac',
      '1 Gel-Nagelpflege',
      '1 Gesichtsreinigung',
      '1 Augenbrauen-Design',
      'Unbegrenzte Nagelreparaturen',
      '15% Rabatt auf zusätzliche Dienstleistungen',
      'Terminpriorität'
    ],
    details: 'Für Frauen, die sich den Luxus der Pflege gönnen und ein komplettes und entspannendes Erlebnis wünschen — von den Füßen bis zum Gesicht, mit Verwöhnung und Exklusivität.',
    savings: '',
    totalValue: '135-140'
  }
]

export function Plans() {
  return (
    <section className="py-24 bg-white" id="planos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Unsere Pläne
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Wählen Sie den Plan, der am besten zu Ihren Bedürfnissen passt
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col hover:border-[#FFC0CB] hover:shadow-lg transition-all duration-300"
            >
              <div className="border-b border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}€</span>
                  <span className="text-base font-medium text-gray-500">/Monat</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Ohne Bindung: {plan.priceWithoutLoyalty}€
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Einzelpreis: {plan.totalValue}€
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-between p-6">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-[#FFC0CB]" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <p className="text-sm text-gray-500 italic">{plan.details}</p>
                </div>

                <a
                  href="/agendar"
                  className="mt-8 block w-full bg-[#FFC0CB] text-white text-center px-6 py-3 rounded-md font-medium hover:bg-[#FFB6C1] transition-colors"
                >
                  Plan Auswählen
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Alle Pläne können mit oder ohne Bindung abgeschlossen werden.
          </p>
          <p className="mt-2 text-sm">
            • Plan ohne Bindung: Kündigung jederzeit möglich
          </p>
          <p className="text-sm">
            • Plan mit 3-Monats-Bindung: reduzierter Preis
          </p>
        </div>
      </div>
    </section>
  )
} 