'use client'

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { FreshaButton } from '../FreshaButton';

export function Gallery() {
  const { t } = useLanguage();
  
  const images = [
    '/images/foto1.jpg',
    '/images/foto2.jpg',
    '/images/foto3.jpg',
    '/images/foto4.jpg'
  ];

  return (
    <section id="galeria" className="py-24 bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FF69B4] font-medium text-sm uppercase tracking-wider">
            {t('gallery.subtitle')}
          </span>
          <h2 className="mt-2 text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
            {t('gallery.title')}
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {t('gallery.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {images.map((imageSrc, index) => (
            <div 
              key={index}
              className="group relative aspect-[3/2] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
            <Image
                src={imageSrc}
                alt="Studio Bruna Silva - Aesthetic & Nails"
                fill
                priority={index < 2}
                style={{ objectFit: 'cover' }}
            />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-8">
            {t('gallery.callToAction.description')}
          </p>
          <FreshaButton size="lg">
            {t('gallery.callToAction.button')}
          </FreshaButton>
        </div>
      </div>
    </section>
  );
}