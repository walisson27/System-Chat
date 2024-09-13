// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar os arquivos de tradução
import enTranslation from './src/public/locales/en/translation.json';
import esTranslation from './src/public/locales/pt/translation.json';

// Inicializar i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      }
    },
    lng: 'en', // Idioma padrão
    fallbackLng: 'en', // Idioma de fallback
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
