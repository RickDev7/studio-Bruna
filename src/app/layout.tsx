import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bruna Silva - Aesthetic & Nails",
  description: "Serviços de estética e beleza em Cuxhaven",
  keywords: ["estética", "unhas", "beleza", "Cuxhaven"],
  authors: [{ name: "Bruna Silva" }],
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-icon.png?v=2' },
    ],
  },
  openGraph: {
    title: "Bruna Silva - Estética & Unhas",
    description: "Tratamentos profissionais de beleza e cuidados para seu bem-estar e autoestima.",
    url: "https://bs-aesthetic-nails.de",
    siteName: "BS Estética & Unhas",
    locale: "pt_BR",
    type: "website",
    images: ['/og-image.png?v=2'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=2" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
