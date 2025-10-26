'use client'

import { useEffect, useState } from 'react'
import { FRESHA_CONFIG } from '@/config/fresha'

interface FreshaRedirectProps {
  delay?: number
  onRedirect?: () => void
}

export function FreshaRedirect({ delay = 2000, onRedirect }: FreshaRedirectProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [countdown, setCountdown] = useState(Math.ceil(delay / 1000))

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Redirect after delay
    const redirectTimeout = setTimeout(() => {
      setIsVisible(false)
      
      // Small delay for fade out animation
      setTimeout(() => {
        window.open(FRESHA_CONFIG.url, '_blank')
        onRedirect?.()
      }, 300)
    }, delay)

    return () => {
      clearTimeout(redirectTimeout)
      clearInterval(countdownInterval)
    }
  }, [delay, onRedirect])

  if (!isVisible) return null

  return (
    <div 
      className={`
        fixed inset-0 bg-black bg-opacity-50 z-50 
        flex items-center justify-center p-4
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-white animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {FRESHA_CONFIG.redirectMessage}
          </h3>
          <p className="text-gray-600">
            Você será redirecionado em <span className="font-bold text-[#FF69B4]">{countdown}</span> segundos
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => {
                window.open(FRESHA_CONFIG.url, '_blank')
                onRedirect?.()
              }, 300)
            }}
            className="w-full bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] text-white py-3 px-6 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Ir Agora
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="w-full text-gray-500 py-2 px-6 rounded-full font-medium hover:text-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
