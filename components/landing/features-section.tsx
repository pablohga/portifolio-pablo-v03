"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Search, Shield, Zap, Users, DollarSign, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../LanguageProvider";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "next-themes";

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
  Users,
  DollarSign,
  Calendar,
};

export function FeaturesSection({ data }: FeaturesSectionProps) {
  const { t, ready } = useTranslation();
  const { theme } = useTheme();
  const { language } = useContext(LanguageContext);

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
    {
      icon: "Users",
      title: t("featuresSection.features.feature7.title"),
      description: t("featuresSection.features.feature7.description"),
    },
    {
      icon: "DollarSign",
      title: t("featuresSection.features.feature8.title"),
      description: t("featuresSection.features.feature8.description"),
    },
    {
      icon: "Calendar",
      title: t("featuresSection.features.feature9.title"),
      description: t("featuresSection.features.feature9.description"),
    },
  ];

  const features = defaultFeatures;

  const bgImage = theme === 'light'
    ? 'https://agenciaaimagic.com.br/portify/hero_footer-light.png'
    : 'https://agenciaaimagic.com.br/portify/hero_footer.png';

  return (
    <section
      id="features"
      style={{ backgroundImage: `url(${bgImage})` }}
      className="pt-0 pb-10 bg-top bg-no-repeat sm:bg-contain md:bg-cover lg:bg-contain w-full"
    >
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* text-primary text-[#A2D9F7] text-4xl font-bold mb-4 bg-clip-text to-primary/70 drop-shadow-lg */}
          <h2
            className="text-primary text-[#A2D9F7] text-4xl font-bold mb-4 bg-clip-text"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t("featuresSection.title")),
            }}
            suppressHydrationWarning={true}
          />
          <p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t("featuresSection.subtitle")),
            }}
            suppressHydrationWarning={true}
          />
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
                    }}
                    suppressHydrationWarning={true}
                  />
                </div>
                <div
                  className="text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(feature.description || ""),
                  }}
                  suppressHydrationWarning={true}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
