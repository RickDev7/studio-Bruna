'use client';

import { ToastProvider } from './ToastProvider';
import { EmailProvider } from './EmailProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <EmailProvider>
          <div suppressHydrationWarning>
            {children}
            <ToastProvider />
          </div>
        </EmailProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
} 