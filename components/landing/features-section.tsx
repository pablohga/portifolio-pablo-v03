"use client";

import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Search, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Use o hook do react-i18next
import i18next from "@/lib/i18next-config"; // Certifique-se de importar o i18n configurado
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
  const { t } = useTranslation(); // Use the hook to get translations

  const defaultFeatures: Feature[] = [
    {
      icon: t('featuresSection.features.feature1.icon'),
      title: t('featuresSection.features.feature1.title'),
      description: t('featuresSection.features.feature1.description'),
    },
    {
      icon: t('featuresSection.features.feature2.icon'),
      title: t('featuresSection.features.feature2.title'),
      description: t('featuresSection.features.feature2.description'),
    },
    {
      icon: t('featuresSection.features.feature3.icon'),
      title: t('featuresSection.features.feature3.title'),
      description: t('featuresSection.features.feature3.description'),
    },
    {
      icon: t('featuresSection.features.feature4.icon'),
      title: t('featuresSection.features.feature4.title'),
      description: t('featuresSection.features.feature4.description'),
    },
    {
      icon: t('featuresSection.features.feature5.icon'),
      title: t('featuresSection.features.feature5.title'),
      description: t('featuresSection.features.feature5.description'),
    },
    {
      icon: t('featuresSection.features.feature6.icon'),
      title: t('featuresSection.features.feature6.title'),
      description: t('featuresSection.features.feature6.description'),
    },
  ];

  // TODO: para corrigir quando configurar as traduções do banco de dados
  const features = /* data?.features || */ defaultFeatures;
  const title = data?.title || "Everything You Need, Free";
  const subtitle =
    data?.subtitle ||
    "We believe every freelancer deserves a professional online presence. That's why we made our portfolio builder completely free.";


  return (
    <section
      id="features"
      className="pt-0 pb-10 bg-top bg-no-repeat sm:bg-contain md:bg-cover lg:bg-contain  bg-[url('https://mundonews.pt/portify/hero_footer.png')]"
    >
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
            {/* TODO: para corrigir quando configurar as traduções do banco de dados */}
          <h2 className="text-primary text-4xl font-bold mb-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(t("featuresSection.title")),
          }}>
            {/* {title}<br/> */}
            {/* {t("featuresSection.title")} */}
          </h2>
          {/* <p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(subtitle || "Start Free"),
            }}
          /> */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(t("featuresSection.subtitle")),
          }}>
            {/* {t("featuresSection.subtitle")} */}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent =
              iconComponents[feature.icon as keyof typeof iconComponents] ||
              Rocket;
              // Sanitize feature.title and feature.description
            const sanitizedTitle = DOMPurify.sanitize(feature.title || "");
            const sanitizedDescription = DOMPurify.sanitize(feature.description || "");

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
                    dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
                  />
                </div>
                <div
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
