'use client'

import { Calendar } from 'lucide-react'
import { FRESHA_CONFIG } from '@/config/fresha'

interface FreshaButtonProps {
  className?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export function FreshaButton({ 
  className = '', 
  children, 
  size = 'md',
  variant = 'primary',
  onClick
}: FreshaButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] text-white shadow-xl hover:opacity-90',
    secondary: 'bg-white text-[#FF69B4] border-2 border-[#FF69B4] shadow-lg hover:bg-[#FF69B4] hover:text-white'
  }

  return (
    <a
      href={FRESHA_CONFIG.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full font-medium transition-all duration-300 
        transform hover:scale-105 focus:outline-none 
        focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50
        flex items-center justify-center space-x-2
        border-2 border-transparent hover:border-pink-300
        ${className}
      `}
    >
      <Calendar className="w-5 h-5" />
      <span>{children || FRESHA_CONFIG.title}</span>
    </a>
  )
}
