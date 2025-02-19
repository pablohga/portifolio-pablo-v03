"use client";

import { createContext, useEffect, useState } from "react";
import i18next from "i18next";

export const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang: string) => {}
});

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supportedLocales = ["en", "pt", "es"];
  const [lngParam, setLngParam] = useState<string | null>(null);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const param = searchParams.get("lng");
      const storedLang = localStorage.getItem("i18nextLng") || "en";
      
      if (param && supportedLocales.includes(param)) {
        i18next.changeLanguage(param);
        setLanguage(param);
      } else if (supportedLocales.includes(storedLang)) {
        i18next.changeLanguage(storedLang);
        setLanguage(storedLang);
      }
      
      setLngParam(param);
      setIsLoading(false);
    }
  //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleLanguageChange 
    }}>
      {children}
    </LanguageContext.Provider>
  );

}
