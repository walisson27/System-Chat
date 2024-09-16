// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar os arquivos de tradução
import enTranslation from './src/public/locales/en/translation.json';
import ptTranslation from './src/public/locales/pt/translation.json';

// Inicializar i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      pt: {
        translation: ptTranslation
      }
    },
    lng: 'en', // Idioma padrão
    fallbackLng: 'en', // Idioma de fallback
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
