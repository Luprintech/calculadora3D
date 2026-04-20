import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from './locales/es';
import en from './locales/en';
import pt from './locales/pt';
import fr from './locales/fr';
import de from './locales/de';
import it from './locales/it';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
      fr: { translation: fr },
      de: { translation: de },
      it: { translation: it },
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'pt', 'fr', 'de', 'it'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
