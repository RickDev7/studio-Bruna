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

/** Domínio canónico (OG, etc.). Não usar VERCEL_URL aqui — em domínio próprio os absolutos ficariam errados. */
function metadataBaseFromEnv(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return undefined
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(withProto.endsWith('/') ? withProto.slice(0, -1) : withProto)
  } catch {
    return undefined
  }
}

const metadataBase = metadataBaseFromEnv()

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: 'Bruna Silva - Aesthetic & Nails | Cuxhaven',
  description: 'Professionelle Schönheitsbehandlungen und Nagelpflege in Cuxhaven. Termine über Fresha buchen.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '48x48' },
    ],
    shortcut: [{ url: '/favicon.ico', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', sizes: `${180}x${180}`, type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="48x48" />
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
