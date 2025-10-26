'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/data/translations'

export function AvisoAgendamento() {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguage()
  
  // Acessar as traduções diretamente
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  useEffect(() => {
    // Mostrar o aviso com um pequeno delay para animação
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  return (
    <div 
      className={`
        max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8
        transform transition-all duration-700 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
    >
      <div className="
        bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50
        rounded-2xl shadow-md border border-pink-200/50
        backdrop-blur-sm relative overflow-hidden
        hover:shadow-lg transition-shadow duration-300
      ">
        {/* Decoração de fundo sutil */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative p-6 sm:p-8">
          {/* Header com ícone */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="
              w-12 h-12 bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] 
              rounded-full flex items-center justify-center
              shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300
            ">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="
                text-xl sm:text-2xl font-bold 
                bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] 
                bg-clip-text text-transparent
                leading-tight
              ">
                {t('bookingNotice.title')}
              </h2>
            </div>
          </div>

          {/* Conteúdo do aviso */}
          <div className="space-y-4 text-gray-700">
            <p className="text-lg font-medium text-gray-800">
              {t('bookingNotice.greeting')}
            </p>
            
            <p className="text-base leading-relaxed">
              {t('bookingNotice.intro')}
            </p>
            
            {/* Lista de regras */}
            <div className="space-y-3">
              {t('bookingNotice.rules').map((rule: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#FF69B4] to-[#FFB6C1] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✨</span>
                    </div>
                  </div>
                  <p 
                    className="text-sm sm:text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: rule }}
                  />
                </div>
              ))}
            </div>
            
            <div className="pt-4 space-y-3">
              <p className="text-base font-medium text-gray-800">
                {t('bookingNotice.conclusion')}
              </p>
              
              <p className="text-base font-medium text-[#FF69B4]">
                {t('bookingNotice.thanks')}
              </p>
            </div>
          </div>

          {/* Assinatura */}
          <div className="mt-6 pt-4 border-t border-pink-200/50">
            <p className="text-sm text-gray-600 text-center font-medium">
              — Bruna Silva Aesthetic & Nails 💅
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
