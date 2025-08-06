import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/AppProviders'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bruna Silva - Aesthetic & Nails',
  description: 'Serviços profissionais de estética e beleza em Cuxhaven.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon.png',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div id="app" className="min-h-screen bg-gray-50">
          <AppProviders>
            {children}
          </AppProviders>
        </div>
      </body>
    </html>
  )
}