'use client';

import { ToastProvider } from './ToastProvider';
import { EmailProvider } from './EmailProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SupabaseAuthHashHandler } from './SupabaseAuthHashHandler';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <EmailProvider>
          <div suppressHydrationWarning>
            <SupabaseAuthHashHandler />
            {children}
            <ToastProvider />
          </div>
        </EmailProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
} 