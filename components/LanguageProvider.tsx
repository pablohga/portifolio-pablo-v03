"use client";

import { createContext, useEffect, useState } from "react";
import i18next from "i18next";

export const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang: string) => {}
});

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(i18next.language || "en");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supportedLocales = ["en", "pt", "es"];
  const searchParams = new URLSearchParams(window.location.search);
  const lngParam = searchParams.get("lng");

  useEffect(() => {
    if (lngParam && !supportedLocales.includes(lngParam)) {
      window.location.href = "/404";
    } else if (lngParam) {
      i18next.changeLanguage(lngParam);
      setLanguage(lngParam);
    }
  }, [lngParam, supportedLocales]);

  const handleLanguageChange = (lang: string) => {
    i18next.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleLanguageChange 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}
