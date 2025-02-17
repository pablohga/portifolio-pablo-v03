"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, DollarSign, Users, FileText, PieChart, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import DOMPurify from "isomorphic-dompurify";

const iconComponents = {
  Bell,
  DollarSign,
  Users,
  FileText,
  PieChart,
  Calendar
} as const;

type IconName = keyof typeof iconComponents;
interface Feature {
  icon: string;
  title: string;
  description: string;
}




export function ComingSoonSection() {
  const { t, ready } = useTranslation();
  
  if (!ready) {
    return <p>Loading...</p>;
  }

  const features: Feature[] = [
    {
      icon: t("comingSoonSection.features.feature1.icon"),
      title: t("comingSoonSection.features.feature1.title"),
      description: t("comingSoonSection.features.feature1.description"),
    },
    {
      icon: t("comingSoonSection.features.feature2.icon"),
      title: t("comingSoonSection.features.feature2.title"),
      description: t("comingSoonSection.features.feature2.description"),
    },
    {
      icon: t("comingSoonSection.features.feature3.icon"),
      title: t("comingSoonSection.features.feature3.title"),
      description: t("comingSoonSection.features.feature3.description"),
    },
    {
      icon: t("comingSoonSection.features.feature4.icon"),
      title: t("comingSoonSection.features.feature4.title"),
      description: t("comingSoonSection.features.feature4.description"),
    },
    {
      icon: t("comingSoonSection.features.feature5.icon"),
      title: t("comingSoonSection.features.feature5.title"),
      description: t("comingSoonSection.features.feature5.description"),
    },
  ];
  
  return (
    <section className="py-20 bg-primary/5">
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Bell className="h-4 w-4" />
            Em Breve
          </span> */}
          <h2 className="text-4xl font-bold mb-4">
            {t("comingSoonSection.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("comingSoonSection.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => { 
            const IconComponent = iconComponents[feature.icon as IconName] ?? Bell;
            return (
            
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4 p-6 rounded-lg bg-card"
            >
              <div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
                {/* {feature.icon} */}
              </div>
              <div>
                <h3 className="font-semibold mb-1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(feature.title || ""),
                }}
                suppressHydrationWarning={true} />
                  {/* {feature.title}
                </h3> */}

                <p className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(feature.description || ""),
                }}
                suppressHydrationWarning={true} />
                  {/* {feature.description} */}
              </div>
            </motion.div>
          )
        }
        )}
        </div>

      </div>
    </section>
  );
}