import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from "i18next-http-backend";

i18next
  .use(Backend)
  .use(LanguageDetector) // Detecta o idioma do navegador
  .use(initReactI18next)
  .init({
    resources: {
      en: require('@/locales/en.json'),
      pt: require('@/locales/pt.json'),
      es: require('@/locales/es.json'),
    },
    fallbackLng: 'en', // Se o idioma não for encontrado, usa inglês
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'], // Salva o idioma preferido do usuário
    },
    interpolation: {
      escapeValue: false, // Evita problemas com XSS
    },
  });

export default i18next;


/* import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTransations from "@/locales/en.json";
import esTransations from "@/locales/es.json";
import ptTransations from "@/locales/pt.json";

i18next
  .use(LanguageDetector) // Adiciona o detector de idioma
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        ...enTransations
      },
      pt: {  
        ...ptTransations
      },
      es: {  
        ...esTransations
      },
    },
    fallbackLng: 'en', // Idioma padrão caso a detecção falhe
    interpolation: {
      escapeValue: false, // Evita problemas de segurança
    },
    detection: {
      // Configuração do detector de idioma
      order: ['querystring', 'localStorage', 'navigator'], // Ordem de detecção
      caches: ['localStorage'], // Armazena o idioma no localStorage para acessos futuros
    },
  });

export default i18next; */

/* en: {
  ...enTransations
},
pt: {
  ...ptTransations
},
es: {
  ...esTransations
} */
