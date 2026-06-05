"use client";

import React, { useEffect, useState } from "react";
import { Hero } from "@/types/hero";
import { About } from "@/types/about";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import DOMPurify from "isomorphic-dompurify";
import { ProjectsSection } from "@/components/projects-section";
import { FeatureDetailsModal } from "@/components/feature-details-modal";

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
}

export default function Template2({ userId, categories, projects }: TemplateProps) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<About["features"][0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [heroRes, aboutRes] = await Promise.all([
          fetch(`/api/hero?userId=${userId}`),
          fetch(`/api/about?userId=${userId}`),
        ]);
        const heroData = await heroRes.json();
        const aboutData = await aboutRes.json();

        if (heroData._id) setHero(heroData);
        if (aboutData && aboutData._id) setAbout(aboutData);
      } catch (error) {
        console.error("Failed to fetch template data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return { truncated: false, text };
    const plainText = text.replace(/<[^>]*>/g, "");
    if (plainText.length <= limit) return { truncated: false, text };

    return {
      truncated: true,
      text: plainText.substring(0, limit) + "...",
    };
  };

  const handleFeatureClick = (feature: About["features"][0]) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
        Loading Template...
      </div>
    );
  }

  return (
    <div className="template-2-wrapper">
      teste
    </div>
  );
}
