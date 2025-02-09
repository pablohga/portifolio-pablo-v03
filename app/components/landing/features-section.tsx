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



const defaultFeatures: Feature[] = [
  {
    icon: "Code2",
    title: "100% Free Forever",
    description: "Create and maintain your professional portfolio completely free. No hidden costs or premium features.",
  },
  {
    icon: "Search",
    title: "SEO Optimized",
    description: "Be discovered by clients with our integrated SEO tools. Rank better in search results naturally.",
  },
  {
    icon: "Zap",
    title: "Extremely Fast",
    description: "Built with Next.js for impressive performance that delights visitors and search engines.",
  },
  {
    icon: "Shield",
    title: "Safe & Reliable",
    description: "Your portfolio is protected with enterprise-level security and hosted on reliable infrastructure.",
  },
  {
    icon: "Palette",
    title: "Beautiful Templates",
    description: "Choose from our collection of professionally designed templates that make your work shine.",
  },
  {
    icon: "Rocket",
    title: "Quick Setup",
    description: "Get your portfolio online in minutes with our intuitive process. No technical knowledge required.",
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
  const title = data?.title || "Everything You Need, Free";
  const subtitle =
    data?.subtitle ||
    "We believe every freelancer deserves a professional online presence. That's why we made our portfolio builder completely free.";
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language || 'en');
  const { t } = useTranslation(); // Use the hook to get translations

  useEffect(() => {
    const detectedLanguage = i18next.language; // Detected language by i18next
    setCurrentLanguage(detectedLanguage);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'pt' : 'en';
    i18next.changeLanguage(newLanguage); // Change the language
    setCurrentLanguage(newLanguage); // Update the state
  }

  return (
    <section
      id="features"
      className="pt-0 pb-10 bg-top bg-no-repeat sm:bg-contain md:bg-cover lg:bg-contain  bg-[url('https://mundonews.pt/portify/hero_footer.png')]"
    >
      <h1>{t("header")}</h1>
      <span></span>
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
          <p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(subtitle || "Start Free"),
            }}
          />
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
