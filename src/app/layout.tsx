import React from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/AppProviders'
import { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Bruna Silva - Aesthetic & Nails | Cuxhaven',
  description: 'Professionelle Schönheitsbehandlungen und Nagelpflege in Cuxhaven. Termine über Fresha buchen.',
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
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className}`} suppressHydrationWarning>
        <div id="app" className="min-h-screen bg-gray-50">
          <AppProviders>
            {children}
          </AppProviders>
        </div>
      </body>
    </html>
  )
}