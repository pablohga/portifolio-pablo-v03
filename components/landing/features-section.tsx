"use client";

import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Search, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Hook de tradução
import DOMPurify from "isomorphic-dompurify";

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

const iconComponents = {
  Code2,
  Search,
  Zap,
  Shield,
  Palette,
  Rocket,
};

export function FeaturesSection({ data }: FeaturesSectionProps) {
  const { t, ready } = useTranslation(); // Hook do i18next para traduções

  // **Verifica se as traduções estão prontas antes de renderizar**
  if (!ready) {
    return <p>Loading...</p>;
  }

  const defaultFeatures: Feature[] = [
    {
      icon: "Code2",
      title: t("featuresSection.features.feature1.title"),
      description: t("featuresSection.features.feature1.description"),
    },
    {
      icon: "Search",
      title: t("featuresSection.features.feature2.title"),
      description: t("featuresSection.features.feature2.description"),
    },
    {
      icon: "Zap",
      title: t("featuresSection.features.feature3.title"),
      description: t("featuresSection.features.feature3.description"),
    },
    {
      icon: "Shield",
      title: t("featuresSection.features.feature4.title"),
      description: t("featuresSection.features.feature4.description"),
    },
    {
      icon: "Palette",
      title: t("featuresSection.features.feature5.title"),
      description: t("featuresSection.features.feature5.description"),
    },
    {
      icon: "Rocket",
      title: t("featuresSection.features.feature6.title"),
      description: t("featuresSection.features.feature6.description"),
    },
  ];

  const features = defaultFeatures; // Garantir que há um fallback caso `data.features` não exista.

  return (
    <section
      id="features"
      className="pt-0 pb-10 bg-top bg-no-repeat sm:bg-contain md:bg-cover lg:bg-contain bg-[url('https://mundonews.pt/portify/hero_footer.png')]"
    >
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Título sanitizado */}
          <h2
            className="text-primary text-4xl font-bold mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t("featuresSection.title")),
            }}
            suppressHydrationWarning={true}/>
          {/* Subtítulo sanitizado */}
          <p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t("featuresSection.subtitle")),
            }} suppressHydrationWarning={true}/>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent =
              iconComponents[feature.icon as keyof typeof iconComponents] ||
              Rocket;

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
                  <h3
                    className="text-foreground text-xl font-semibold mb-2"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(feature.title || ""),
                    }} suppressHydrationWarning={true}/>
                </div>
                <div
                  className="text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(feature.description || ""),
                  }} suppressHydrationWarning={true}/>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
