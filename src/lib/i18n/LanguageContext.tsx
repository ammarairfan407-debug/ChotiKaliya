'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, ur: string) => string;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  showBoth: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('both');

  useEffect(() => {
    const saved = localStorage.getItem('nanhi-kaliyan-lang') as Language;
    if (saved && ['en', 'ur', 'both'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nanhi-kaliyan-lang', lang);
  }, []);

  const t = useCallback((en: string, ur: string): string => {
    if (language === 'en') return en;
    if (language === 'ur') return ur;
    return en; // 'both' mode: components handle showing both
  }, [language]);

  const isRTL = language === 'ur';
  const dir = isRTL ? 'rtl' : 'ltr';
  const showBoth = language === 'both';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, dir, showBoth }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
