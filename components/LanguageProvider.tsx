"use client"; // Marca este componente como um Client Component

import { useEffect } from "react";
import i18next  from "@/lib/i18next-config";

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supportedLocales = ["en", "pt", "es"];
  const searchParams = new URLSearchParams(window.location.search); // Acessa a query string
  const lngParam = searchParams.get("lng"); // Obtém o idioma da query string

  useEffect(() => {
    if (lngParam && !supportedLocales.includes(lngParam)) {
      // Redireciona para a página 404 se o idioma não for suportado
      window.location.href = "/404"; // Substitua pelo redirecionamento correto
    } else if (lngParam) {
      // Define o idioma no i18next
      i18next.changeLanguage(lngParam);
    }
  }, [lngParam, supportedLocales]);

  return <>{children}</>;
}