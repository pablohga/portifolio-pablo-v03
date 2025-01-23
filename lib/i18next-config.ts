import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTransations from "@/locales/en.json";
import esTransations from "@/locales/es.json";
import ptTransations from "@/locales/pt.json";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      ...enTransations
    },
    pt: {
      ...ptTransations
    },
    es: {
      ...esTransations
    }
    /* en: {
      translation: {
        header: 'All You Need, Free',
        description: 'This is a sample description in English.',
      },
    },
    pt: {
      translation: {
        header: 'Tudo Que Você Precisa, Grátis',
        description: 'Esta é uma descrição de exemplo em português.',
      },
    }, */
  },
  lng: 'en', // Idioma padrão
  fallbackLng: 'en', // Idioma alternativo caso a tradução não exista
  interpolation: {
    escapeValue: false, // Evita problemas de segurança XSS
  },
});

export default i18next;
