'use client'

import { useState, useMemo } from 'react'
import { X, Loader2 } from 'lucide-react'
import { services } from '@/config/services'
import { sendBookingEmails } from '@/services/bookingEmailService'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/data/translations'

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
  const { t, language } = useLanguage()
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
      .map(service => t(service.translationKey))
  }, [serviceIds, t])

  const localeMap = {
    'de': 'de-DE',
    'pt': 'pt-BR',
    'en': 'en-US',
    'es': 'es-ES'
  }
  
  const formattedDate = new Intl.DateTimeFormat(localeMap[language] || 'de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)

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

      toast.success(t('scheduling.contactForm.success'))
      onClose()
      
    } catch (error) {
      console.error('Erro ao enviar emails:', error)
      toast.error(t('scheduling.contactForm.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] relative flex flex-col">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">{t('scheduling.contactForm.title')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('scheduling.contactForm.subtitle')}
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
              {formattedDate} {t('scheduling.contactForm.at')} {time}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('scheduling.contactForm.name')} *
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
                {t('scheduling.contactForm.email')} *
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
                {t('scheduling.contactForm.phone')} *
              </label>
              <input
                type="tel"
                id="phone"
                required
                placeholder={t('scheduling.contactForm.phonePlaceholder')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                {t('scheduling.contactForm.notes')}
              </label>
              <textarea
                id="notes"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t('scheduling.contactForm.notesPlaceholder')}
              />
            </div>
          </div>

          {/* Booking Rules Section */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('scheduling.bookingRules.title')}
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                {t('scheduling.bookingRules.greeting')}
              </p>
              <p className="text-sm text-gray-700">
                {t('scheduling.bookingRules.intro')}
              </p>
              <ul className="space-y-2">
                {translations[language].scheduling.bookingRules.rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-pink-500 font-bold text-sm">✨</span>
                    <span className="text-sm text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-700">
                {t('scheduling.bookingRules.conclusion')}
              </p>
              <p className="text-sm text-gray-700">
                {t('scheduling.bookingRules.thanks')}
              </p>
              <p className="text-sm text-pink-600 font-medium">
                {t('scheduling.bookingRules.signature')}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {t('scheduling.contactForm.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('scheduling.contactForm.sending')}</span>
                </>
              ) : (
                <span>{t('scheduling.contactForm.confirm')}</span>
              )}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}