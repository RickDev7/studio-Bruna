import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Studio Bruna - Aesthetic & Nails",
  description: "Agende seu horário no melhor studio de beleza da região",
  keywords: ["estética", "unhas", "beleza", "Cuxhaven"],
  authors: [{ name: "Bruna Silva" }],
  openGraph: {
    title: "Bruna Silva - Estética & Unhas",
    description: "Tratamentos profissionais de beleza e cuidados para seu bem-estar e autoestima.",
    url: "https://bs-aesthetic-nails.de",
    siteName: "BS Estética & Unhas",
    locale: "pt_BR",
    type: "website",
    images: ['/og-image.png']
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.ico',
  },
};

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
  );
}
