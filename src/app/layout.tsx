import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import type { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#FFC0CB',
}

export const metadata: Metadata = {
  title: 'BS Aesthetic & Nails',
  description: 'Serviços de estética e unhas em Cuxhaven',
  metadataBase: new URL('http://localhost:3002'),
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon.png', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
