'use client'

import { useState, useMemo } from 'react'
import { X, Loader2 } from 'lucide-react'
import { services } from '@/config/services'
import { sendBookingEmails } from '@/services/bookingEmailService'
import { toast } from 'react-hot-toast'

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContactFormData) => void
  serviceIds: string[]
  date: Date
  time: string
}

const allServices = services // Array importado de services.ts

export interface ContactFormData {
  name: string
  email: string
  phone: string
  notes?: string
}

export function ContactForm({ isOpen, onClose, onSubmit, serviceIds, date, time }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedServiceNames = useMemo(() => {
    return allServices
      .filter(service => serviceIds.includes(service.id))
      .map(service => service.name)
  }, [serviceIds])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return

    setIsSubmitting(true)
    
    try {
      await sendBookingEmails({
        ...formData,
        serviceIds,
        date,
        time
      })

      toast.success('Agendamento solicitado com sucesso! Verifique seu email.')
      onClose()
      
    } catch (error) {
      console.error('Erro ao enviar emails:', error)
      toast.error('Não foi possível enviar a confirmação. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Confirmar Agendamento</h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor, preencha seus dados para confirmar o agendamento dos seguintes serviços:
          </p>
          <div className="mt-4 p-4 bg-pink-50 rounded-lg">
            <div className="space-y-2">
              {selectedServiceNames.map((serviceName, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mr-2" />
                  <p className="text-sm font-medium text-pink-900">{serviceName}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-pink-700 border-t border-pink-200 pt-4">
              {formattedDate} às {time}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo *
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone *
              </label>
              <input
                type="tel"
                id="phone"
                required
                placeholder="(00) 00000-0000"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Observações (opcional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Alguma informação adicional que devemos saber?"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Confirmar e Prosseguir</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}