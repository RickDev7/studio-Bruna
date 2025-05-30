import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bruna Silva - Aesthetic & Nails',
  description: 'Serviços profissionais de estética e unhas em Cuxhaven, Alemanha. Agendamento online disponível.',
  keywords: [
    'estética',
    'unhas',
    'beleza',
    'Cuxhaven',
    'manicure',
    'pedicure',
    'design de unhas',
    'limpeza de pele',
    'lifting de cílios',
    'lifting de sobrancelhas',
    'hidratação labial',
    'técnica com fio'
  ],
  authors: [{ name: 'Bruna Silva' }],
  creator: 'Bruna Silva',
  publisher: 'Bruna Silva',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Bruna Silva - Aesthetic & Nails',
    description: 'Serviços profissionais de estética e unhas em Cuxhaven, Alemanha.',
    url: 'https://brunasilva.de',
    siteName: 'Bruna Silva - Aesthetic & Nails',
    locale: 'pt-BR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verificação_google_aqui',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo-favicon.svg" />
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
