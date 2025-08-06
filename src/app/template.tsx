'use client';

import { Suspense } from 'react';
import { AppProviders } from '@/components/AppProviders';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  return children;
} 