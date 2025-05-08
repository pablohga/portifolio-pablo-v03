"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection as HeroSectionType } from "@/types/home";
import DOMPurify from "isomorphic-dompurify";

import i18next from "@/lib/i18next-config";
import { useTranslation } from "react-i18next";
  

interface HeroSectionProps {
  data?: HeroSectionType;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const { t, ready } = useTranslation(); // Hook do i18next para traduções
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language || 'en');

  ///////

  useEffect(() => {
    const detectedLanguage = i18next.language; 
    setCurrentLanguage(detectedLanguage);
  }, []);

  //////
  // **Verifica se as traduções estão prontas antes de renderizar**
  if (!ready) {
    return <p>Loading...</p>;
  }
  const defaultHeroContent = [
    {
      title: t("HeroSection.title"),
      subtitle: t("HeroSection.subtitle"),
      description: t("HeroSection.description"),
      text: t("HeroSection.button"),
      button: t("HeroSection.button")
    },
  ];
  
  // guardado para quando atuaizar e for utiizar o conteudo do banco de dados
  /* const [currentLanguage, setCurrentLanguage] = useState(i18next.language || 'en'); */

  // guardado para quando atuaizar e for utiizar o conteudo do banco de dados
  const dataSubtitle = DOMPurify.sanitize(data?.subtitle  || "");
  const dataTitle = DOMPurify.sanitize(data?.title || "Create your professional portfolio without spending anything");
  const dataDescription = DOMPurify.sanitize(data?.description || "Throw your amazing portfolio site totally free.No hidden rates, no credit card - only pure value for freelancers.");
  const dataButtonText = DOMPurify.sanitize(data?.buttonText || "Start Free");
  
// **Verifica se as traduções estão prontas antes de renderizar**



const heroContent = defaultHeroContent; // Garantir que há um fallback caso `data.features` não exista.

/* console.log('setCurrentLanguage HERO!!!!', currentLanguage) */

  return (
    <section className="relative min-h-screen flex items-center justify-left overflow-hidden sm:bg-contain md:bg-cover lg:bg-center bg-[url('https://mundonews.pt/portify/hero_img_clean-transformed_new1.png')] bg-cover h-64 w-full">
    <div className="absolute inset-0 bg-grid-white/10" />
      <div className="flex flex-row justify-items-start container px-4 mx-auto max-w-[960px] relative z-10">
        <div className="text-primary max-w-[400px] text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              {/* <span className="text-primary font-semibold">
                <span dangerouslySetInnerHTML={{ __html: dataSubtitle }} />
              </span> */}
              <p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(t("HeroSection.subtitle")),
              }} suppressHydrationWarning={true}/>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text to-primary/70"
            dangerouslySetInnerHTML={{ __html: t("HeroSection.title") }} />
              {/* <span dangerouslySetInnerHTML={{ __html: dataTitle }} /> */}
              {/* {t("HeroSection.title")} */}
            {/* </h1> */}
            {/* remover */}
            <p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t("HeroSection.subtitle")),
            }} suppressHydrationWarning={true}/>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {/* <span dangerouslySetInnerHTML={{ __html: dataDescription }} /> */}
            {t("HeroSection.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href={data?.buttonLink || "/auth/register"}>
                  {/* <div dangerouslySetInnerHTML={{ __html: dataButtonText }} /> */}
                  {t("HeroSection.button")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {/*  Throw your amazing portfolio site totally free.No hidden rates, no credit card - only pure value for freelancers. */}
              {t("HeroSection.text")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}