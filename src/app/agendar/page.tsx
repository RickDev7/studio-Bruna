'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ServiceMultiSelector } from '@/components/ServiceMultiSelector'
import { Calendar } from '@/components/Calendar'
import { TimeSlots } from '@/components/TimeSlots'
import { ContactForm, type ContactFormData } from '@/components/ContactForm'
import { Check, Clock, Calendar as CalendarIcon, ListChecks, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AgendarPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const router = useRouter()

  // Refs para cada seção
  const dateRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)

  // Função para rolar suavemente até um elemento
  const scrollToElement = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Handlers modificados para incluir o scroll e atualização do passo
  const handleServicesSelect = (services: string[]) => {
    setSelectedServices(services)
    if (services.length > 0) {
      setCurrentStep(2)
      setTimeout(() => scrollToElement(dateRef), 100)
    }
  }

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date)
    if (date) {
      setCurrentStep(3)
      setTimeout(() => scrollToElement(timeRef), 100)
    }
  }

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || selectedServices.length === 0) return
    setIsContactFormOpen(true)
  }

  const handleContactFormSubmit = () => {
    setIsContactFormOpen(false)
    setSelectedServices([])
    setSelectedDate(null)
    setSelectedTime(null)
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]">
      {/* Botão Voltar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center">
            <Link
              href="/"
              className="flex items-center text-[#FF69B4] hover:text-[#FF1493] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Voltar para o início</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header com progresso */}
      <div className="bg-white shadow-lg border-b border-pink-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
              Agendar Serviço
            </h1>
            <div className="flex items-center space-x-8">
              <StepIndicator 
                number={1}
                title="Serviços"
                icon={<ListChecks className="w-5 h-5" />}
                active={currentStep === 1}
                completed={currentStep > 1}
              />
              <div className="h-px w-12 bg-pink-200 hidden md:block" />
              <StepIndicator 
                number={2}
                title="Data"
                icon={<CalendarIcon className="w-5 h-5" />}
                active={currentStep === 2}
                completed={currentStep > 2}
              />
              <div className="h-px w-12 bg-pink-200 hidden md:block" />
              <StepIndicator 
                number={3}
                title="Horário"
                icon={<Clock className="w-5 h-5" />}
                active={currentStep === 3}
                completed={currentStep > 3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Seleção de Serviços */}
          <div 
            className={`
              bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300
              ${currentStep === 1 ? 'ring-4 ring-pink-400 ring-opacity-50 transform scale-100' : 'transform scale-98 opacity-90'}
            `}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <ListChecks className="w-6 h-6 text-[#FF69B4]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Selecione os Serviços</h2>
                </div>
                {currentStep > 1 && (
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-pink-500 hover:text-pink-600 text-sm font-medium rounded-full border-2 border-pink-200 hover:border-pink-400 transition-all duration-300"
                  >
                    Editar Serviços
                  </button>
                )}
              </div>
              <ServiceMultiSelector
                onSelect={handleServicesSelect}
                initialSelected={selectedServices}
              />
            </div>
          </div>

          {/* Seleção de Data */}
          {selectedServices.length > 0 && (
            <div 
              ref={dateRef}
              className={`
                bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300
                ${currentStep === 2 ? 'ring-4 ring-pink-400 ring-opacity-50 transform scale-100' : 'transform scale-98 opacity-90'}
              `}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-[#FF69B4]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Escolha a Data</h2>
                  </div>
                  {currentStep > 2 && (
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 text-pink-500 hover:text-pink-600 text-sm font-medium rounded-full border-2 border-pink-200 hover:border-pink-400 transition-all duration-300"
                    >
                      Editar Data
                    </button>
                  )}
                </div>
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
              </div>
            </div>
          )}

          {/* Seleção de Horário */}
          {selectedServices.length > 0 && selectedDate && (
            <div 
              ref={timeRef}
              className={`
                bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300
                ${currentStep === 3 ? 'ring-4 ring-pink-400 ring-opacity-50 transform scale-100' : 'transform scale-98 opacity-90'}
              `}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[#FF69B4]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Escolha o Horário</h2>
                  </div>
                </div>
                <TimeSlots
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              </div>
            </div>
          )}

          {/* Botão de Finalizar */}
          {selectedServices.length > 0 && selectedDate && selectedTime && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                className="
                  px-8 py-4 bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] text-white 
                  rounded-full font-medium text-lg shadow-xl
                  hover:opacity-90 transition-all duration-300 transform hover:scale-105 
                  focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50
                  flex items-center space-x-2
                "
              >
                <span>Finalizar Agendamento</span>
                <Check className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Formulário de Contato */}
          {selectedServices.length > 0 && selectedDate && selectedTime && (
            <ContactForm
              isOpen={isContactFormOpen}
              onClose={() => setIsContactFormOpen(false)}
              onSubmit={handleContactFormSubmit}
              serviceIds={selectedServices}
              date={selectedDate}
              time={selectedTime}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Componente do indicador de passo
function StepIndicator({ 
  number, 
  title, 
  icon,
  active, 
  completed 
}: { 
  number: number
  title: string
  icon: React.ReactNode
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-300
          ${completed 
            ? 'bg-pink-500 text-white shadow-lg' 
            : active 
              ? 'bg-pink-100 text-pink-600 ring-4 ring-pink-200' 
              : 'bg-gray-100 text-gray-400'
          }
        `}
      >
        {completed ? <Check className="w-6 h-6" /> : icon}
      </div>
      <div className="flex flex-col">
        <span className={`text-xs uppercase tracking-wider font-medium ${active ? 'text-pink-600' : 'text-gray-400'}`}>
          Passo {number}
        </span>
        <span className={`text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-500'}`}>
          {title}
        </span>
      </div>
    </div>
  )
} 