"use client";

import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Search, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "@/lib/i18next-config";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  data?: {
    title: string;
    subtitle: string;
    features: Feature[];
  };
}

const defaultFeatures: Feature[] = [
  {
    icon: "Code2",
    title: "100% Grátis Para Sempre",
    description: "Crie e mantenha seu portfólio profissional totalmente grátis.",
  },
  {
    icon: "Search",
    title: "Otimizado para SEO",
    description: "Seja descoberto por clientes com nossas ferramentas de SEO integradas.",
  },
  {
    icon: "Zap",
    title: "Extremamente Rápido",
    description: "Construído com Next.js para um desempenho impressionante.",
  },
  {
    icon: "Shield",
    title: "Seguro & Confiável",
    description: "Seu portfólio é protegido com segurança de nível empresarial.",
  },
  {
    icon: "Palette",
    title: "Templates Bonitos",
    description: "Escolha entre nossa coleção de templates profissionalmente projetados.",
  },
  {
    icon: "Rocket",
    title: "Configuração Rápida",
    description: "Coloque seu portfólio online em minutos com nosso processo intuitivo.",
  },
];

const iconComponents = {
  Code2,
  Search,
  Zap,
  Shield,
  Palette,
  Rocket,
};

export function FeaturesSection({ data }: FeaturesSectionProps) {
  const features = data?.features || defaultFeatures;
  const title = data?.title || "Tudo Que Você Precisa, Grátis";
  const subtitle =
    data?.subtitle ||
    "Acreditamos que todo freelancer merece uma presença online profissional.";

  const { t, i18n } = useTranslation();
  
  // ✅ Pega o idioma inicial do i18next
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const detectedLanguage = i18n.language;
    if (currentLanguage !== detectedLanguage) {
      setCurrentLanguage(detectedLanguage);
    }
  }, [i18n.language, currentLanguage]);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    i18next.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <section
      id="features"
      className="pt-0 pb-10 bg-top bg-no-repeat sm:bg-contain md:bg-cover lg:bg-contain bg-[url('https://mundonews.pt/portify/hero_footer.png')]"
    >
      <h1 suppressHydrationWarning>{t("header")}</h1> {/* <- Evita erro de hidratação */}
      <button type="button" onClick={handleChangeLanguage}>
        Change Language
      </button>
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-primary text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent =
              iconComponents[feature.icon as keyof typeof iconComponents] || Rocket;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-5 rounded-lg bg-card border border-primary"
              >
                <div className="flex gap-5 items-center mb-1 px-4 py-0 rounded-lg md:bg-cover">
                  <IconComponent className="h-8 w-8" />
                  <h3 className="text-foreground text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                </div>
                <div className="text-foreground">{feature.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
