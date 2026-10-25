import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import en from '../locales/en.json';
import id from '../locales/id.json';

type Language = 'en' | 'id';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const translations = {
  en,
  id
};

const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path;
    }
  }
  
  return typeof value === 'string' ? value : path;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'id',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string, defaultValue?: string) => {
        const { language } = get();
        const value = getNestedValue(translations[language], key);
        return value !== key ? value : (defaultValue || key);
      }
    }),
    {
      name: 'language-storage'
    }
  )
);

export const useLanguage = () => {
  const { language, setLanguage, t } = useLanguageStore();
  return { language, setLanguage, t };
};
