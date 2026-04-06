'use client'

import { Calendar } from 'lucide-react'
import { FRESHA_CONFIG } from '@/config/fresha'

interface FreshaButtonProps {
  className?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function FreshaButton({
  className = '',
  children,
  size = 'md',
  onClick,
}: FreshaButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <a
      href={FRESHA_CONFIG.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-[10px] font-medium
        bg-[#8A5C4A] text-[#F5F1EC]
        border border-transparent
        shadow-[0_2px_12px_rgba(138,92,74,0.18)]
        transition-all duration-300 ease-out
        hover:bg-[#C8A27A] hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(138,92,74,0.28)]
        focus:outline-none focus:ring-2 focus:ring-[#C8A27A]/30 focus:ring-offset-1
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <Calendar className="w-4 h-4 shrink-0" />
      <span>{children || FRESHA_CONFIG.title}</span>
    </a>
  )
}
