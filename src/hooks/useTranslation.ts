import { Language } from '@/types/baby';
import { translations } from '@/lib/translations';

export function useTranslation(language: Language) {
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return { t };
}
