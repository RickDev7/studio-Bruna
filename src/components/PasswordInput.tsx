'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  error?: string
}

export function PasswordInput({ 
  id, 
  name, 
  value, 
  onChange,
  className = "appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm",
  placeholder = "Senha",
  error
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Evitar hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={name === 'confirmPassword' ? 'new-password' : 'current-password'}
        required
        placeholder={placeholder}
        className={`${className} ${error ? 'border-red-300' : 'border-gray-300'}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
        tabIndex={-1}
      >
        <span className="sr-only">{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</span>
        {showPassword ? (
          <EyeOff className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  )
} 