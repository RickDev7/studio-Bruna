'use client'

import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NossoEspaco() {
  const { t } = useLanguage()

  const services = [
    {
      key: 'manicure',
      image: '/images/manicure-pedicure.jpg',
      title: t('gallery.images.manicure.title'),
      description: t('gallery.images.manicure.description'),
    },
    {
      key: 'facial',
      image: '/images/limpeza-pele.jpg',
      title: t('gallery.images.facial.title'),
      description: t('gallery.images.facial.description'),
    },
    {
      key: 'depilation',
      image: '/images/depilacao.jpg',
      title: t('gallery.images.depilation.title'),
      description: t('gallery.images.depilation.description'),
    },
    {
      key: 'nailDesign',
      image: '/images/manicure-rosa.jpg',
      title: t('gallery.images.nailDesign.title'),
      description: t('gallery.images.nailDesign.description'),
    },
    {
      key: 'frenchManicure',
      image: '/images/manicure-francesa.jpg',
      title: t('gallery.images.frenchManicure.title'),
      description: t('gallery.images.frenchManicure.description'),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1EC]">
      <Navbar />
      <main className="flex-1 pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-[#C8A27A]">
              {t('gallery.subtitle')}
            </p>
            <h1 className="font-display text-4xl italic text-[#8A5C4A]">
              {t('gallery.title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#8A5C4A]/65">
              {t('gallery.description')}
            </p>
          </div>

          {/* Banner */}
          <div className="relative mb-16 h-[420px] overflow-hidden rounded-2xl border border-[#D6C1B1] sm:h-[500px]">
            <Image
              src="/images/banner-bruna-silva-original.png"
              alt={t('gallery.studioName')}
              fill
              className="object-cover"
              sizes="100vw"
              quality={100}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A14]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="font-display text-3xl italic">{t('gallery.studioName')}</h2>
              <p className="mt-1 text-white/75">{t('gallery.studioTagline')}</p>
            </div>
          </div>

          {/* Service grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.key}
                className="overflow-hidden rounded-2xl border border-[#D6C1B1] bg-white transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-56">
                  <Image src={s.image} alt={s.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg italic text-[#8A5C4A]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-[1.65] text-[#8A5C4A]/65">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Safety section */}
          <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-[#D6C1B1] bg-[#E7DBD1] px-8 py-8 text-center">
            <h2 className="font-display text-2xl italic text-[#8A5C4A]">
              {t('gallery.safetyTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-[1.75] text-[#8A5C4A]/70">
              {t('gallery.safetyText')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
