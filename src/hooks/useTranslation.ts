import { useTheme } from '../contexts/ThemeContext';
import { translations, TranslationKey } from '../locales/translations';

export const useTranslation = () => {
  const { language } = useTheme();
  
  const t = (key: TranslationKey): string => {
    try {
      return translations[language]?.[key] || String(key);
    } catch (error) {
      console.error('Translation error:', error);
      return String(key);
    }
  };
  
  return { t, language };
};
