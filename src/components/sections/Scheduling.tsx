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
    'Limpeza de Pele - R$ 120,00',
    'Massagem Relaxante - R$ 150,00',
    'Drenagem Linfática - R$ 130,00',
    'Design de Sobrancelhas - R$ 50,00',
    'Depilação - R$ 80,00',
    'Microagulhamento - R$ 250,00'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Substitua com suas credenciais do EmailJS
      const templateParams = {
        from_name: name,
        from_email: email,
        to_name: 'Estética & Bem-estar',
        message: `
          Novo Agendamento:
          
          Nome: ${name}
          Telefone: ${phone}
          Email: ${email}
          Serviço: ${selectedService}
          Data: ${formatarData(date)}
          Horário: ${selectedTime}
        `,
      }

      await emailjs.send(
        'YOUR_SERVICE_ID', // Substitua com seu Service ID
        'YOUR_TEMPLATE_ID', // Substitua com seu Template ID
        templateParams,
        'YOUR_PUBLIC_KEY' // Substitua com sua Public Key
      )

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Limpa o formulário
      setSelectedTime('')
      setSelectedService('')
      setName('')
      setPhone('')
      setEmail('')
    } catch (err) {
      setError('Ocorreu um erro ao enviar o agendamento. Por favor, tente novamente.')
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
            Agende seu Horário
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Escolha o serviço, data e horário de sua preferência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Selecione uma Data</h3>
              <input
                type="date"
                min={formatDateForInput(new Date())}
                value={formatDateForInput(date)}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB]"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Horários Disponíveis</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Manhã</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {periodos.manha.map((slot) => (
                      <button
                        key={slot.hora}
                        onClick={() => setSelectedTime(slot.hora)}
                        disabled={!slot.disponivel}
                        className={`p-2 text-sm rounded-md transition-colors ${
                          selectedTime === slot.hora
                            ? 'bg-[#FFC0CB] text-white'
                            : slot.disponivel
                            ? 'bg-white border border-gray-300 text-gray-700 hover:border-[#FFC0CB]'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.hora}
                        {!slot.disponivel && ' - Indisponível'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tarde</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {periodos.tarde.map((slot) => (
                      <button
                        key={slot.hora}
                        onClick={() => setSelectedTime(slot.hora)}
                        disabled={!slot.disponivel}
                        className={`p-2 text-sm rounded-md transition-colors ${
                          selectedTime === slot.hora
                            ? 'bg-[#FFC0CB] text-white'
                            : slot.disponivel
                            ? 'bg-white border border-gray-300 text-gray-700 hover:border-[#FFC0CB]'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.hora}
                        {!slot.disponivel && ' - Indisponível'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Serviço</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB] rounded-md"
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data e Horário Selecionados
                </label>
                <input
                  type="text"
                  value={`${formatarData(date)} às ${selectedTime}`}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FFC0CB] focus:border-[#FFC0CB]"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
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
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
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
                {isLoading ? 'Enviando...' : 'Confirmar Agendamento'}
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