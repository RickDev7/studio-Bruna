'use client';

import { ToastProvider } from './ToastProvider';
import { EmailProvider } from './EmailProvider';
import { ErrorBoundary } from './ErrorBoundary';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <EmailProvider>
        <div suppressHydrationWarning>
          {children}
          <ToastProvider />
        </div>
      </EmailProvider>
    </ErrorBoundary>
  );
} 