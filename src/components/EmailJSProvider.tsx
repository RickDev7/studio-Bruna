'use client';

import { useEmailJS } from '@/hooks/useEmailJS';
import { createContext, useContext } from 'react';

interface EmailJSContextType {
  isReady: boolean;
}

const EmailJSContext = createContext<EmailJSContextType>({ isReady: false });

export function useEmailJSContext() {
  return useContext(EmailJSContext);
}

export function EmailJSProvider({ children }: { children: React.ReactNode }) {
  const { isReady } = useEmailJS();

  return (
    <EmailJSContext.Provider value={{ isReady }}>
      {children}
    </EmailJSContext.Provider>
  );
} 