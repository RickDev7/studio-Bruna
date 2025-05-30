'use client'

import { Toaster } from 'sonner'

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  )
} 