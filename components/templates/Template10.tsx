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
        const endpoints = [
          { key: 'hero', url: `/api/hero?userId=${userId}` },
          { key: 'about', url: `/api/about?userId=${userId}` },
        ];

        const results = await Promise.all(
          endpoints.map(async (end) => {
            const res = await fetch(end.url);
            if (!res.ok) {
              console.error(`Fetch failed for ${end.key} (${end.url}): ${res.status}`);
              return null;
            }
            try {
              return await res.json();
            } catch (e) {
              console.error(`JSON parse failed for ${end.key} (${end.url}):`, e);
              return null;
            }
          })
        );

        const [heroData, aboutData] = results;

        if (heroData && heroData._id) setHero(heroData);
        if (aboutData && aboutData._id) setAbout(aboutData);
      } catch (error) {
        console.error("Critical error fetching template data:", error);
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
      <h1>TEMPLATE 10</h1>
      teste
    </div>
  );
}
