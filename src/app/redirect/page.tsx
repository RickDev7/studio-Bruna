'use client'

import { FreshaRedirect } from '@/components/FreshaRedirect'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RedirectPage() {
  const router = useRouter()

  const handleRedirect = () => {
    // Opcional: redirecionar de volta para a página inicial após o redirecionamento
    // router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] flex items-center justify-center">
      <FreshaRedirect 
        delay={2000} 
        onRedirect={handleRedirect}
      />
    </div>
  )
}
