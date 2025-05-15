import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bruna Silva - Aesthetic & Nails",
  description: "Professionelle Beauty- und Pflegebehandlungen für Ihr Wohlbefinden und Selbstbewusstsein.",
  keywords: "nails, aesthetic, beauty, Cuxhaven, Nageldesign, Gesichtspflege, Wimpernlift, Augenbrauenlifting",
  authors: [{ name: "Bruna Silva" }],
  openGraph: {
    title: "Bruna Silva - Aesthetic & Nails",
    description: "Professionelle Beauty- und Pflegebehandlungen für Ihr Wohlbefinden und Selbstbewusstsein.",
    url: "https://bs-aesthetic-nails.de",
    siteName: "BS Aesthetic Nails",
    locale: "de_DE",
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
        {children}
      </body>
    </html>
  );
}
