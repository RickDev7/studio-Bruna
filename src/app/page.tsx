'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const HomeClient = dynamic(() => import('@/components/HomeClient'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  ),
  ssr: false
});

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    }>
      <HomeClient />
    </Suspense>
  );
}