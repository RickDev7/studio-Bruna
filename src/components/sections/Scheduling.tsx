'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'

// Função auxiliar para formatar a data
function formatarData(data: Date): string {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Horários disponíveis por período
const periodos = {
  manha: [
    { hora: '09:00', disponivel: true },
    { hora: '10:00', disponivel: true },
    { hora: '11:00', disponivel: false },
    { hora: '12:00', disponivel: true }
  ],
  tarde: [
    { hora: '14:00', disponivel: true },
    { hora: '15:00', disponivel: true },
    { hora: '16:00', disponivel: false },
    { hora: '17:00', disponivel: true },
    { hora: '18:00', disponivel: true }
  ]
}

export function Scheduling() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const services = [
    'Manicure',
    'Pedicure',
    'Nageldesign',
    'Gesichtspflege',
    'Wimpernlift',
    'Augenbrauenlifting',
    'Hydra Lips',
    'Fadentechnik',
    'Haarentfernung mit Waxing'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        to_name: 'BS Aesthetic Nails',
        message: `
          Neue Terminanfrage:
          
          Name: ${name}
          Telefon: ${phone}
          Email: ${email}
          Service: ${selectedService}
          Datum: ${formatarData(date)}
          Uhrzeit: ${selectedTime}
        `,
      }

      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        templateParams,
        'YOUR_PUBLIC_KEY'
      )

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      setSelectedTime('')
      setSelectedService('')
      setName('')
      setPhone('')
      setEmail('')
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para formatar a data para o input type="date"
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <section className="py-24 bg-white" id="agendar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Termin Buchen
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Wählen Sie Ihren gewünschten Service, Datum und Uhrzeit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Datum Auswählen</h3>
              <input
                type="date"
                min={formatDateForInput(new Date())}
                value={formatDateForInput(date)}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB]"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Uhrzeit Auswählen</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(periodos).map(([periodo, horarios]) => (
                  <div key={periodo}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {periodo === 'manha' ? 'Vormittag' : 'Nachmittag'}
                    </h4>
                    <div className="space-y-2">
                      {horarios.map((horario) => (
                        <button
                          key={horario.hora}
                          onClick={() => setSelectedTime(horario.hora)}
                          disabled={!horario.disponivel}
                          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors
                            ${
                              selectedTime === horario.hora
                                ? 'bg-[#FFC0CB] text-white'
                                : horario.disponivel
                                ? 'bg-white text-gray-700 border border-gray-300 hover:border-[#FFC0CB]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }
                          `}
                        >
                          {horario.hora}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB] rounded-md"
                  required
                >
                  <option value="">Service auswählen</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ausgewähltes Datum und Uhrzeit
                </label>
                <input
                  type="text"
                  value={`${formatarData(date)} um ${selectedTime}`}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB]"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 XXX XXXXXXX"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB]"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedTime || !selectedService || isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${
                    !selectedTime || !selectedService || isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#FFC0CB] hover:bg-[#FFB6C1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC0CB]'
                  }`}
              >
                {isLoading ? 'Wird gesendet...' : 'Termin bestätigen'}
              </button>
            </form>

            {showSuccess && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                Agendamento realizado com sucesso! Em breve entraremos em contato para confirmar.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 