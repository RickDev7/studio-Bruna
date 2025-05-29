import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bruna Silva - Estética & Unhas",
  description: "Tratamentos profissionais de beleza e cuidados para seu bem-estar e autoestima.",
  keywords: "unhas, estética, beleza, Cuxhaven, design de unhas, cuidados faciais, lifting de cílios, design de sobrancelhas",
  authors: [{ name: "Bruna Silva" }],
  openGraph: {
    title: "Bruna Silva - Estética & Unhas",
    description: "Tratamentos profissionais de beleza e cuidados para seu bem-estar e autoestima.",
    url: "https://bs-aesthetic-nails.de",
    siteName: "BS Estética & Unhas",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
