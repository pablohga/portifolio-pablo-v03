import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTransations from "locales/en.json";
import esTransations from "locales/es.json";
import ptTransations from "locales/pt.json";

i18n.use(initReactI18next).init({
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
  },
  lng: "en",
});
