'use client';

import React from 'react';
import { createContext, useContext, ReactNode } from 'react';

const EmailContext = createContext({});

export function EmailProvider({ children }: { children: ReactNode }) {
  return (
    <EmailContext.Provider value={{}}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  const context = useContext(EmailContext);
  return context;
} 