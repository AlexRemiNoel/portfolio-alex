'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'fr';

interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language preference or detect from browser
    const savedLang = localStorage.getItem('language') as Language | null;
    const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en';
    const initialLang = savedLang || browserLang;
    
    setLanguageState(initialLang);
    loadTranslations(initialLang);
  }, []);

  const loadTranslations = async (lang: Language) => {
    try {
      // Check cache first
      const cached = localStorage.getItem(`translations_${lang}`);
      if (cached) {
        setTranslations(JSON.parse(cached));
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/locales/${lang}.json`);
      const data = await response.json();
      setTranslations(data);
      
      // Cache for future loads
      localStorage.setItem(`translations_${lang}`, JSON.stringify(data));
      setIsLoading(false);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      setIsLoading(false);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    loadTranslations(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
