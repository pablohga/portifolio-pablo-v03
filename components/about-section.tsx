"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Star } from "lucide-react";
import { About } from "@/types/about";
import DOMPurify from "isomorphic-dompurify";
import { FeatureDetailsModal } from "@/components/feature-details-modal";

interface AboutSectionProps {
  userId?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  Code2: Code2,
  Palette: Palette,
  Rocket: Rocket,
  Star: Star,
};

export function AboutSection({ userId }: AboutSectionProps) {
  const [about, setAbout] = useState<About | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<About["features"][0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const url = userId ? `/api/about?userId=${userId}` : "/api/about";
        const response = await fetch(url);
        const data = await response.json();
        if (data && data._id) {
          setAbout(data);
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      }
    }

    fetchAbout();
  }, [userId]);

  if (!about) {
    return null;
  }

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return { truncated: false, text };
    // Remove HTML tags for accurate length check
    const plainText = text.replace(/<[^>]*>/g, "");
    if (plainText.length <= limit) return { truncated: false, text };

    return {
      truncated: true,
      text: plainText.substring(0, limit) + "..."
    };
  };

  const handleFeatureClick = (feature: About["features"][0]) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="about" className="py-24 bg-background">
        <div className="container px-4 mx-auto max-w-[1100px]">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-6"
            >
              <h2 className="text-4xl md:text-sxl font-bold tracking-tight leading-tight">
                {about.title}
              </h2>
              <div
                className="text-muted-foreground text-lg leading-relaxed prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(about.description),
                }}
              />
            </motion.div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              {about.features.map((feature, index) => {
                const isLarge = index === 0;
                const IconComponent = iconMap[feature.icon] || Star;
                const { truncated, text: truncatedText } = truncateText(feature.description, 250);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative overflow-hidden p-8 rounded-3xl bg-card border border-border/50 hover:border-[#5221e6]/50 transition-all duration-300 group ${
                      isLarge ? "md:col-span-2 lg:col-span-1" : ""
                    }`}
                  >
                    <div className="mb-4 inline-flex p-3 rounded-2xl bg-[#5221e6]/10 text-[#5221e6] transition-transform group-hover:scale-110 duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <div
                      className={`text-muted-foreground prose prose-sm dark:prose-invert transition-colors duration-200 ${
                        truncated ? "cursor-pointer hover:text-foreground" : ""
                      }`}
                      onClick={() => truncated && handleFeatureClick(feature)}
                      dangerouslySetInnerHTML={{
                        __html: truncated ? truncatedText : DOMPurify.sanitize(feature.description)
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <FeatureDetailsModal
        feature={selectedFeature}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
