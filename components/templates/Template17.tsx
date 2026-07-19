"use client";

import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Hero } from "@/types/hero";
import { About } from "@/types/about";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { Testimonial } from "@/types/testimonial";
import { ContactSection } from "@/components/contact-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectsDelivered, SatisfiedClients, ExperienceTime } from "@/components/about-metrics";
import { Logo } from "@/components/brand/logo";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

const ExpandableText = ({ text, title, className }: { text: string, title: string, className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const plainText = text.replace(/<[^>]*>/g, ' ');
  const words = plainText.trim().split(/\s+/);

  if (words.length <= 80) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />;
  }

  const truncated = words.slice(0, 80).join(' ') + '...';

  return (
    <>
      <div className={className}>
        <div className="opacity-80">{truncated}</div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[var(--t17-pink)] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-2 hover:bg-[var(--t17-pink2)] transition-colors cursor-pointer inline-block"
        >
          Mais...
        </button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[var(--t17-card)] text-[var(--t17-text)] border-[var(--t17-border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--t17-text)] font-display uppercase">{title}</DialogTitle>
          </DialogHeader>
          <div
            className="text-sm leading-relaxed text-[var(--t17-muted)]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

interface TemplateProps {

  userId: string;
  categories: Category[];
  projects: Project[];
  userImage?: string;
  userName?: string;
}

export default function Template17({ userId, categories, projects, userImage, userName }: TemplateProps) {

  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [contact, setContact] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [visibleLimit, setVisibleLimit] = useState<number>(8);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const endpoints = [
          { key: 'hero', url: `/api/hero?userId=${userId}` },
          { key: 'about', url: `/api/about?userId=${userId}` },
          { key: 'testimonials', url: `/api/testimonials?userId=${userId}` },
          { key: 'contact', url: `/api/contact/settings?userId=${userId}` },
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

        const [heroData, aboutData, testimonialsData, contactData] = results;

        if (heroData && heroData._id) setHero(heroData);
        if (aboutData && aboutData._id) setAbout(aboutData);
        if (contactData && contactData._id) setContact(contactData);
        if (testimonialsData) setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
      } catch (error) {
        console.error("Critical error fetching template data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const fullName = userName || hero?.title || "Freelancer Profissional";

  const userProjects = projects.filter(p => p.userId === userId);

  const featuredProjects = (() => {
    const sorted = [...userProjects].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const featured = sorted.find(p => p.isFeatured);
    if (featured) {
      const others = sorted.filter(p => p._id !== featured._id);
      return [featured, ...others].slice(0, 5);
    }
    return sorted.slice(0, 5);
  })();

  const allCategories = ['Todos', ...Array.from(new Set(userProjects.map(p => p.category).filter(Boolean)))];

  const filteredProjects = activeCategory === 'Todos'
    ? userProjects
    : userProjects.filter(p => p.category === activeCategory);

  const displayedCategoryProjects = filteredProjects.slice(0, visibleLimit);
  const hasMoreProjects = filteredProjects.length > visibleLimit;

  const totalProjectsCount = userProjects.length;
  const techCounts = userProjects.reduce((acc, p) => {
    (p.tech || []).forEach(tech => {
      acc[tech] = (acc[tech] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const techWithPercentages = Object.entries(techCounts)
    .map(([tech, count]) => ({
      tech,
      percentage: totalProjectsCount > 0 ? parseFloat(((count / totalProjectsCount) * 100).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const sortedTech = techWithPercentages.map(tp => tp.tech);
  const techPercentages = techWithPercentages.reduce((acc, tp) => {
    acc[tp.tech] = tp.percentage;
    return acc;
  }, {} as Record<string, number>);

  const techEmojiMap: Record<string, string> = {
    'React': '⚛️',
    'Next.js': '▲',
    'TypeScript': '🔷',
    'Node.js': '🟢',
    'MongoDB': '🍃',
    'Tailwind': '💨',
    'Figma': '🎨',
    'GitHub': '🐈',
    'Google Ads': '🎯',
    'Meta Ads': '🎯',
    'SASS': '🎨',
    'CSS': '🎨',
    'HTML': '🌐',
    'JavaScript': '📜',
  };

  return (
    <div className="t17-wrapper">
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --t17-pink: #ec1961;
          --t17-pink2: #ff3d7f;
          --t17-pink-dim: rgba(236,25,97,0.12);
          --t17-bg: #0a0a0a;
          --t17-surface: #111111;
          --t17-card: #161616;
          --t17-border: rgba(255,255,255,0.1);
          --t17-text: #ffffff;
          --t17-muted: #9a9a9a;
          --t17-font-display: 'Archivo Black', 'Arial Black', sans-serif;
          --t17-font-body: 'Inter', sans-serif;
          --t17-transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        .t17-wrapper *, .t17-wrapper *::before, .t17-wrapper *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .t17-wrapper {
          font-family: var(--t17-font-body);
          background: var(--t17-bg);
          color: var(--t17-text);
          line-height: 1.6;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .t17-wrapper ::-webkit-scrollbar { width: 5px; }
        .t17-wrapper ::-webkit-scrollbar-track { background: var(--t17-bg); }
        .t17-wrapper ::-webkit-scrollbar-thumb { background: var(--t17-pink); border-radius: 10px; }

        html { scroll-behavior: smooth; }

        /* NAV */
        .t17-nav {
          position: sticky; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--t17-bg);
          border-bottom: 1px solid var(--t17-border);
          padding: 0 2rem;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .t17-nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }

        .t17-nav-links a {
          font-family: var(--t17-font-display);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--t17-text);
          text-decoration: none;
          transition: var(--t17-transition);
        }

        .t17-nav-links a:hover { color: var(--t17-pink); }

        .t17-btn-hire {
          font-family: var(--t17-font-display);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: var(--t17-pink);
          color: #fff;
          border: none;
          padding: 0.7rem 1.6rem;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          transition: var(--t17-transition);
          display: inline-flex; align-items: center; gap: 6px;
        }

        .t17-btn-hire:hover { background: var(--t17-pink2); transform: translateY(-1px); }

        .t17-hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .t17-hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--t17-text);
        }

        /* HERO */
        .t17-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          border-bottom: 1px solid var(--t17-border);
        }

        .t17-hero-content {
          display: flex; flex-direction: column; justify-content: center;
          padding: 4rem 3rem 4rem 3rem;
          border-right: 1px solid var(--t17-border);
        }

        .t17-hero-name {
          font-family: var(--t17-font-display);
          font-size: clamp(2.6rem, 6.5vw, 5.6rem);
          line-height: 0.95;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin-bottom: 1.2rem;
          word-break: break-word;
        }

        .t17-hero-desc {
          font-size: 0.95rem;
          color: var(--t17-muted);
          max-width: 460px;
          line-height: 1.7;
          margin-bottom: 2.2rem;
        }

        .t17-hero-stats {
          display: flex; gap: 2.5rem;
          margin-bottom: 2.2rem;
          flex-wrap: wrap;
        }

        .t17-stat-number {
          font-family: var(--t17-font-display);
          font-size: 1.8rem;
          color: var(--t17-text);
          line-height: 1;
        }

        .t17-stat-label {
          font-size: 0.68rem;
          color: var(--t17-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 6px;
        }

        .t17-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }

        .t17-btn-primary {
          font-family: var(--t17-font-display);
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: var(--t17-pink);
          color: #fff;
          border: none;
          padding: 0.9rem 1.8rem;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: var(--t17-transition);
        }

        .t17-btn-primary:hover { background: var(--t17-pink2); transform: translateY(-2px); }

        .t17-btn-outline {
          font-family: var(--t17-font-display);
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: transparent;
          color: var(--t17-text);
          border: 1.5px solid var(--t17-text);
          padding: 0.9rem 1.8rem;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: var(--t17-transition);
        }

        .t17-btn-outline:hover { border-color: var(--t17-pink); color: var(--t17-pink); }

        .t17-hero-visual {
          position: relative;
          display: flex; flex-direction: column; justify-content: center;
          padding: 3rem 3rem 3rem 2rem;
        }

        .t17-photo-block { position: relative; }

        .t17-photo-pink-bg {
          position: absolute;
          top: -1.5rem; right: -1.5rem;
          width: 70%; height: 65%;
          background: var(--t17-pink);
          border-radius: 4px;
          z-index: 0;
        }

        .t17-hero-photo {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          object-position: top center;
          display: block;
          filter: grayscale(15%);
        }

        .t17-photo-info-row {
          display: flex; gap: 1rem; margin-top: 1.2rem; flex-wrap: wrap;
        }

        .t17-photo-info-card {
          flex: 1; min-width: 160px;
          background: var(--t17-surface);
          border: 1px solid var(--t17-border);
          border-radius: 8px;
          padding: 0.9rem 1.1rem;
        }

        .t17-photo-info-card.pink { background: var(--t17-pink); }

        .t17-photo-info-title {
          font-family: var(--t17-font-display);
          font-size: 0.78rem;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .t17-photo-info-sub { font-size: 0.72rem; color: var(--t17-muted); }
        .t17-photo-info-card.pink .t17-photo-info-sub { color: rgba(255,255,255,0.85); }

        .t17-stars { color: #fff; font-size: 0.85rem; }

        /* SPLIT LAYOUT */
        .t17-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .t17-col-left { border-right: 1px solid var(--t17-border); }

        .t17-section {
          padding: 3.5rem 2.5rem;
          border-bottom: 1px solid var(--t17-border);
        }

        .t17-section-title {
          font-family: var(--t17-font-display);
          font-size: clamp(1.7rem, 3vw, 2.6rem);
          text-transform: uppercase;
          line-height: 1.05;
          margin-bottom: 0.6rem;
        }

        .t17-section-title .pink { color: var(--t17-pink); }

        .t17-section-desc {
          color: var(--t17-muted);
          font-size: 0.88rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 480px;
        }

        /* SERVICES */
        .t17-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .t17-service-card {
          background: var(--t17-card);
          border: 1px solid var(--t17-border);
          border-radius: 8px;
          padding: 1.4rem;
          transition: var(--t17-transition);
        }

        .t17-service-card:hover { border-color: var(--t17-pink); transform: translateY(-3px); }

        .t17-service-icon {
          width: 34px; height: 34px;
          background: var(--t17-pink-dim);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
        }

        .t17-service-title {
          font-family: var(--t17-font-display);
          font-size: 0.85rem;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .t17-service-desc {
          font-size: 0.78rem;
          color: var(--t17-muted);
          line-height: 1.55;
          margin-bottom: 1rem;
        }

        .t17-service-btn {
          font-family: var(--t17-font-display);
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: var(--t17-pink);
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.5rem 0.9rem;
          cursor: default;
          display: inline-block;
        }

        /* TOOLS / SKILLS */
        .t17-skill-bar-item { margin-bottom: 1rem; }

        .t17-skill-bar-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 6px;
          font-size: 0.78rem;
        }

        .t17-skill-bar-name { font-weight: 600; }
        .t17-skill-bar-pct { color: var(--t17-pink); font-weight: 700; }

        .t17-skill-bar-track {
          height: 6px;
          background: var(--t17-border);
          border-radius: 10px;
          overflow: hidden;
        }

        .t17-skill-bar-fill {
          height: 100%;
          background: var(--t17-pink);
          border-radius: 10px;
        }

        .t17-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: 10px;
          margin-top: 1.5rem;
        }

        .t17-tool-chip {
          background: var(--t17-card);
          border: 1px solid var(--t17-border);
          border-radius: 8px;
          padding: 0.7rem 0.4rem;
          text-align: center;
          font-size: 0.62rem;
          font-weight: 600;
          color: var(--t17-muted);
          transition: var(--t17-transition);
        }

        .t17-tool-chip:hover { border-color: var(--t17-pink); color: var(--t17-pink); }
        .t17-tool-chip .t17-tool-emoji { display: block; font-size: 1.2rem; margin-bottom: 4px; }

        /* PROCESS */
        .t17-process-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
        }

        .t17-process-step {
          background: var(--t17-card);
          border: 1px solid var(--t17-border);
          border-radius: 8px;
          padding: 1.4rem;
        }

        .t17-step-number {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--t17-pink);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--t17-font-display);
          font-size: 0.75rem;
          margin-bottom: 1rem;
        }

        .t17-step-title {
          font-family: var(--t17-font-display);
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .t17-step-desc { font-size: 0.76rem; color: var(--t17-muted); line-height: 1.55; }

        /* TESTIMONIALS */
        .t17-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .t17-testimonial-card {
          background: var(--t17-card);
          border: 1px solid var(--t17-border);
          border-radius: 8px;
          padding: 1.4rem;
          position: relative;
        }

        .t17-testimonial-quote {
          font-family: var(--t17-font-display);
          font-size: 2.5rem;
          color: var(--t17-pink);
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .t17-testimonial-text {
          font-size: 0.82rem;
          color: var(--t17-muted);
          line-height: 1.6;
          margin-bottom: 1.2rem;
        }

        .t17-testimonial-author { display: flex; align-items: center; gap: 10px; }

        .t17-author-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: var(--t17-pink-dim);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          font-size: 1rem;
        }

        .t17-author-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .t17-author-name { font-family: var(--t17-font-display); font-size: 0.78rem; }
        .t17-author-role { font-size: 0.7rem; color: var(--t17-muted); }

        .t17-testimonials-cta {
          display: flex; justify-content: center; margin-top: 2rem;
        }

        /* PORTFOLIO */
        .t17-portfolio-featured {
          margin-bottom: 1rem;
        }

        .t17-portfolio-card {
          background: var(--t17-card);
          border: 1px solid var(--t17-border);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: var(--t17-transition);
          position: relative;
        }

        .t17-portfolio-card:hover { border-color: var(--t17-pink); transform: translateY(-3px); }

        .t17-portfolio-thumb {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          background: var(--t17-surface);
        }

        .t17-portfolio-thumb-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          background: var(--t17-pink-dim);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
        }

        .t17-portfolio-info { padding: 0.9rem 1rem; }

        .t17-portfolio-tag {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--t17-pink);
          margin-bottom: 4px;
        }

        .t17-portfolio-title {
          font-family: var(--t17-font-display);
          font-size: 0.8rem;
          margin-bottom: 3px;
        }

        .t17-portfolio-year { font-size: 0.68rem; color: var(--t17-muted); }

        .t17-portfolio-grid-small {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.8rem;
        }

        .t17-portfolio-tabs {
          display: flex; gap: 0.6rem; margin: 1.5rem 0; flex-wrap: wrap;
        }

        .t17-portfolio-tab {
          background: var(--t17-card);
          border: 1px solid var(--t17-border);
          color: var(--t17-muted);
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--t17-transition);
        }

        .t17-portfolio-tab.active {
          background: var(--t17-pink);
          color: #fff;
          border-color: var(--t17-pink);
        }

        .t17-portfolio-grid-filtered {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
        }

        .t17-portfolio-load-more {
          display: block;
          margin: 1.5rem auto 0;
          font-family: var(--t17-font-display);
          font-size: 0.68rem;
          text-transform: uppercase;
          background: var(--t17-pink);
          color: #fff;
          border: none;
          padding: 0.6rem 1.3rem;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--t17-transition);
        }

        .t17-portfolio-load-more:hover { background: var(--t17-pink2); }

        /* ABOUT */
        .t17-about-image-wrap { position: relative; margin-bottom: 1.5rem; }

        .t17-about-pink-bg {
          position: absolute;
          bottom: -1rem; left: -1rem;
          width: 55%; height: 60%;
          background: var(--t17-pink);
          border-radius: 4px;
          z-index: 0;
        }

        .t17-about-image {
          position: relative; z-index: 1;
          width: 45%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          border-radius: 4px;
          display: block;
        }

        .t17-about-text {
          font-size: 0.88rem;
          color: var(--t17-muted);
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        .t17-about-highlights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1.8rem;
        }

        .t17-highlight-item {
          background: var(--t17-card);
          border: 1px solid var(--t17-border);
          border-radius: 8px;
          padding: 0.9rem;
        }

        .t17-highlight-item strong {
          display: block;
          font-family: var(--t17-font-display);
          font-size: 0.72rem;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .t17-highlight-item span { color: var(--t17-muted); font-size: 0.7rem; }

        /* CTA */
        .t17-cta-section { text-align: center; border-bottom: none; }

        .t17-cta-title {
          font-family: var(--t17-font-display);
          font-size: clamp(1.6rem, 3.4vw, 2.6rem);
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .t17-cta-title .pink { color: var(--t17-pink); }

        .t17-cta-desc {
          color: var(--t17-muted);
          font-size: 0.88rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 480px;
          margin-left: auto; margin-right: auto;
        }

        .t17-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem; }

        .t17-cta-info {
          display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;
          font-size: 0.75rem; color: var(--t17-muted);
        }

        /* FOOTER */
        .t17-footer {
          padding: 2rem 2.5rem;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
        }

        .t17-footer-text { font-size: 0.72rem; color: var(--t17-muted); text-align: center; }
        .t17-footer-text a { color: var(--t17-pink); text-decoration: none; }

        .t17-footer-links { display: flex; gap: 1.2rem; list-style: none; }
        .t17-footer-links a { font-size: 0.72rem; color: var(--t17-muted); text-decoration: none; }
        .t17-footer-links a:hover { color: var(--t17-pink); }

        /* PROJECT MODAL */
        .t17-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.88);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 2rem;
        }

        .t17-modal-content {
          background: var(--t17-card);
          border: 1px solid var(--t17-border);
          border-radius: 10px;
          max-width: 900px; width: 100%; max-height: 90vh;
          overflow-y: auto; position: relative;
        }

        .t17-modal-close {
          position: absolute; top: 16px; right: 16px;
          background: var(--t17-pink); color: #fff;
          border: none; width: 34px; height: 34px; border-radius: 50%;
          cursor: pointer; z-index: 10;
          display: flex; align-items: center; justify-content: center;
        }

        .t17-modal-image { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }

        .t17-modal-info { padding: 2rem; }

        .t17-modal-title {
          font-family: var(--t17-font-display);
          font-size: 1.6rem;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .t17-modal-meta {
          display: flex; gap: 0.8rem; margin-bottom: 1.2rem;
          font-size: 0.78rem; color: var(--t17-muted); flex-wrap: wrap;
        }

        .t17-modal-meta span {
          background: var(--t17-surface);
          padding: 4px 10px; border-radius: 50px; border: 1px solid var(--t17-border);
        }

        .t17-modal-desc { font-size: 0.9rem; line-height: 1.65; color: var(--t17-muted); margin-bottom: 1.5rem; }
        .t17-modal-footer { display: flex; gap: 1rem; }

        /* MOBILE */
        @media (max-width: 900px) {
          .t17-nav-links { display: none; }
          .t17-hamburger { display: flex; }
          .t17-hero { grid-template-columns: 1fr; }
          .t17-hero-content { border-right: none; border-bottom: 1px solid var(--t17-border); }
          .t17-split { grid-template-columns: 1fr; }
          .t17-col-left { border-right: none; }
          .t17-portfolio-grid-small { grid-template-columns: repeat(2, 1fr); }
          .t17-portfolio-grid-filtered { grid-template-columns: 1fr; }
          .t17-about-highlights { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .t17-section { padding: 2.5rem 1.5rem; }
          .t17-hero-content, .t17-hero-visual { padding: 2.5rem 1.5rem; }
          .t17-footer { flex-direction: column; text-align: center; }
        }
      `}} />

      {/* NAV */}
      <nav className="t17-nav">
        <Link href={'/'} className="justify-center">
          <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={70} alterW={110} />
        </Link>
        <ul className="t17-nav-links">
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#portfolio">Portfólio</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        <a href="#contato" className="t17-btn-hire">Contato</a>
        <button className="t17-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="t17-hero" id="hero">
        <div className="t17-hero-content">
          <h1 className="t17-hero-name">{fullName}</h1>
          <p className="t17-hero-desc">
            {about?.description
              ? about.description.replace(/<[^>]+>/g, '').slice(0, 220)
              : "Transformo ideias em experiências digitais que geram resultados reais para o seu negócio, unindo design, tecnologia e estratégia."}
          </p>

          <div className="t17-hero-stats">
            <div>
              <div className="t17-stat-number"><ProjectsDelivered about={about || undefined} dark={true} /></div>
            </div>
            <div>
              <div className="t17-stat-number"><SatisfiedClients about={about || undefined} dark={true} /></div>
            </div>
            <div>
              <div className="t17-stat-number"><ExperienceTime about={about || undefined} dark={true} /></div>
            </div>
          </div>

          <div className="t17-hero-ctas">
            <a href="#portfolio" className="t17-btn-primary">Ver Projetos</a>
            <a href="#contato" className="t17-btn-outline">Fale Comigo</a>
          </div>
        </div>

        <div className="t17-hero-visual">
          <div className="t17-photo-block">
            <div className="t17-photo-pink-bg"></div>
            <img
              src={hero?.backgroundImage || userImage}
              alt={fullName}
              className="t17-hero-photo"
            />
          </div>
          <div className="t17-photo-info-row">
            <div className="t17-photo-info-card pink">
              <div className="t17-photo-info-title">Disponível</div>
              <div className="t17-photo-info-sub">Para novos projetos</div>
            </div>
            <div className="t17-photo-info-card">
              <div className="t17-stars">★★★★★</div>
              <div className="t17-photo-info-sub">5.0/5.0 star rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* SPLIT LAYOUT */}
      <div className="t17-split">
        {/* LEFT COLUMN */}
        <div className="t17-col-left">

          {/* SERVICES */}
          <section className="t17-section" id="servicos">
            <h2 className="t17-section-title">Serviços</h2>
            <p className="t17-section-desc">O que eu ofereço para transformar sua presença digital.</p>
            <div className="t17-services-grid">
              {about?.features?.map((service, idx) => {
                const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Layout;
                return (
                  <div className="t17-service-card" key={idx}>
                    <div className="t17-service-icon">
                      <Icon size={18} color="var(--t17-pink)" />
                    </div>
                    <div className="t17-service-title">{service.title}</div>
                    <div className="t17-service-desc">
                      <ExpandableText
                        text={service.description}
                        title={service.title}
                        className="opacity-80"
                      />
                    </div>
                    <div className="t17-service-btn">Sob consulta</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TOOLS */}
          <section className="t17-section" id="ferramentas">
            <h2 className="t17-section-title">Ferramentas</h2>
            <p className="t17-section-desc">Ferramentas que uso no dia a dia para criar soluções digitais de alto impacto.</p>
            <div className="t17-skills-stack">
              {sortedTech.slice(0, 6).map((tech, idx) => (
                <div className="t17-skill-bar-item" key={idx}>
                  <div className="t17-skill-bar-header">
                    <span className="t17-skill-bar-name">{tech}</span>
                    <span className="t17-skill-bar-pct">{techPercentages[tech]}%</span>
                  </div>
                  <div className="t17-skill-bar-track">
                    <div className="t17-skill-bar-fill" style={{ width: `${techPercentages[tech]}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="t17-tools-grid">
              {sortedTech.map((tech, idx) => (
                <div className="t17-tool-chip" key={idx}>
                  <span className="t17-tool-emoji">{techEmojiMap[tech] || '🛠️'}</span>
                  {tech}
                </div>
              ))}
            </div>
          </section>

          {/* PROCESS */}
          <section className="t17-section" id="processo">
            <h2 className="t17-section-title">Como Trabalhamos</h2>
            <p className="t17-section-desc">Um processo claro e transparente do briefing até a entrega final.</p>
            <div className="t17-process-grid">
              <div className="t17-process-step">
                <div className="t17-step-number">01</div>
                <div className="t17-step-title">Briefing & Descoberta</div>
                <div className="t17-step-desc">Entendo seus objetivos, público-alvo e expectativas para alinhar o escopo.</div>
              </div>
              <div className="t17-process-step">
                <div className="t17-step-number">02</div>
                <div className="t17-step-title">Proposta & Estratégia</div>
                <div className="t17-step-desc">Elaboro uma proposta com cronograma, entregáveis e investimento.</div>
              </div>
              <div className="t17-process-step">
                <div className="t17-step-number">03</div>
                <div className="t17-step-title">Execução & Evolução</div>
                <div className="t17-step-desc">Comunicação constante com acompanhamento em tempo real do progresso.</div>
              </div>
              <div className="t17-process-step">
                <div className="t17-step-number">04</div>
                <div className="t17-step-title">Revisão & Entrega</div>
                <div className="t17-step-desc">Rodadas de ajuste para garantir um resultado final acima das expectativas.</div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="t17-section" id="depoimentos" style={{ borderBottom: 'none' }}>
            <h2 className="t17-section-title">O que meus <span className="pink">Clientes Dizem</span></h2>
            <div className="t17-testimonials-grid">
              {testimonials.slice(0, 2).map((testimonial, idx) => (
                <div className="t17-testimonial-card" key={testimonial._id || idx}>
                  <div className="t17-testimonial-quote">&rdquo;</div>
                  <p className="t17-testimonial-text">{testimonial.text}</p>
                  <div className="t17-testimonial-author">
                    <div className="t17-author-avatar">
                      {testimonial.image ? (
                        <Image src={testimonial.image} alt={testimonial.name} width={38} height={38} />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div>
                      <div className="t17-author-name">{testimonial.name}</div>
                      <div className="t17-author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <p style={{ color: 'var(--t17-muted)', fontSize: '0.85rem' }}>Nenhum depoimento disponível no momento.</p>
              )}
            </div>
            <div className="t17-testimonials-cta">
              <button onClick={() => setIsContactModalOpen(true)} className="t17-btn-primary">Vamos conversar</button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="t17-col-right">

          {/* PORTFOLIO */}
          <section className="t17-section" id="portfolio">
            <h2 className="t17-section-title">Portfólio <span className="pink">Selecionado</span></h2>
            <p className="t17-section-desc">Uma seleção dos projetos que mais me orgulho.</p>

            {featuredProjects[0] && (
              <div
                className="t17-portfolio-card t17-portfolio-featured"
                onClick={() => setSelectedProject(featuredProjects[0])}
              >
                {featuredProjects[0].image ? (
                  <Image src={featuredProjects[0].image} alt={featuredProjects[0].title} className="t17-portfolio-thumb" width={600} height={340} />
                ) : (
                  <div className="t17-portfolio-thumb-placeholder">🚀</div>
                )}
                <div className="t17-portfolio-info">
                  <div className="t17-portfolio-tag">{featuredProjects[0].category || "Projeto"}</div>
                  <div className="t17-portfolio-title">{featuredProjects[0].title}</div>
                  <div className="t17-portfolio-year">{featuredProjects[0].tech?.join(' · ') || "Tecnologias"}</div>
                </div>
              </div>
            )}

            <div className="t17-portfolio-grid-small">
              {featuredProjects.slice(1, 5).map((project, idx) => (
                <div className="t17-portfolio-card" key={project._id || idx} onClick={() => setSelectedProject(project)}>
                  {project.image ? (
                    <Image src={project.image} alt={project.title} className="t17-portfolio-thumb" width={300} height={170} />
                  ) : (
                    <div className="t17-portfolio-thumb-placeholder">{['🎨', '📈', '🖋', '⚡'][idx % 4]}</div>
                  )}
                  <div className="t17-portfolio-info">
                    <div className="t17-portfolio-tag">{project.category || "Projeto"}</div>
                    <div className="t17-portfolio-title">{project.title}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="t17-portfolio-tabs">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  className={`t17-portfolio-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(cat); setVisibleLimit(8); }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="t17-portfolio-grid-filtered">
              {displayedCategoryProjects.map((project, idx) => (
                <div className="t17-portfolio-card" key={project._id || idx} onClick={() => setSelectedProject(project)}>
                  {project.image ? (
                    <Image src={project.image} alt={project.title} className="t17-portfolio-thumb" width={300} height={170} />
                  ) : (
                    <div className="t17-portfolio-thumb-placeholder">{['🚀', '🎨', '📈', '🖋', '⚡'][idx % 5]}</div>
                  )}
                  <div className="t17-portfolio-info">
                    <div className="t17-portfolio-tag">{project.category || "Projeto"}</div>
                    <div className="t17-portfolio-title">{project.title}</div>
                    <div className="t17-portfolio-year">{project.year || ""}</div>
                  </div>
                </div>
              ))}
            </div>

            {hasMoreProjects && (
              <button className="t17-portfolio-load-more" onClick={() => setVisibleLimit(prev => prev + 8)}>
                Exibir mais projetos
              </button>
            )}
          </section>

          {/* ABOUT */}
          <section className="t17-section" id="sobre">
            <h2 className="t17-section-title">Sobre <span className="pink">Mim</span></h2>
            <div className="t17-about-image-wrap">
              <div className="t17-about-pink-bg"></div>
              <Image
                src={userImage || hero?.backgroundImage || ""}
                alt={fullName}
                className="t17-about-image"
                width={400}
                height={530}
              />
            </div>
            <ExpandableText
              text={about?.description || ""}
              title="Sobre Mim"
              className="t17-about-text"
            />
            <div className="t17-about-highlights">
              {about?.features?.slice(0, 4).map((feature, idx) => (
                <div className="t17-highlight-item" key={idx}>
                  <strong>{feature.title}</strong>
                  <ExpandableText
                    text={feature.description}
                    title={feature.title}
                    className="text-[var(--t17-muted)] text-[0.7rem]"
                  />
                </div>
              ))}
            </div>
            <button onClick={() => setIsContactModalOpen(true)} className="t17-btn-primary">Vamos conversar</button>
          </section>

          {/* CTA */}
          <section className="t17-section t17-cta-section" id="contato">
            <h2 className="t17-cta-title">Pronto para <span className="pink">Elevar</span> seu Negócio Digital?</h2>
            <p className="t17-cta-desc">
              Seja um site novo, uma campanha de marketing ou uma identidade visual marcante — estou aqui para transformar sua visão em realidade.
            </p>
            <div className="t17-cta-btns">
              <button onClick={() => setIsContactModalOpen(true)} className="t17-btn-primary">Ver Projetos</button>
              {contact?.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t17-btn-outline"
                >
                  Fale Comigo
                </a>
              )}
            </div>
            <div className="t17-cta-info">
              {contact?.address && (contact.address.street || contact.address.city || contact.address.state) && (
                <span>📍 {[contact.address.street, contact.address.city, contact.address.state].filter(Boolean).join(", ") || "Remoto"}</span>
              )}
              {contact?.availability && <span>⏰ {contact.availability}</span>}
              {contact?.languages && contact.languages.length > 0 && <span>🌐 {contact.languages.join(", ")}</span>}
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="t17-footer">
        <Link href={'/'} className="justify-center">
          <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={60} alterW={100} />
        </Link>
        <p className="t17-footer-text">
          Portfólio criado com <a href="https://portify.art" target="_blank">Portify</a> · O portfólio profissional para freelancers
        </p>
        <ul className="t17-footer-links">
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#portfolio">Portfólio</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </footer>

      {selectedProject && (
        <div className="t17-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="t17-modal-content" onClick={e => e.stopPropagation()}>
            <button className="t17-modal-close" onClick={() => setSelectedProject(null)}>✕</button>
            {selectedProject.image ? (
              <Image src={selectedProject.image} alt={selectedProject.title} className="t17-modal-image" width={900} height={500} />
            ) : (
              <div className="t17-modal-image" style={{ background: 'var(--t17-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                🚀
              </div>
            )}
            <div className="t17-modal-info">
              <h3 className="t17-modal-title">{selectedProject.title}</h3>
              <div className="t17-modal-meta">
                <span>📅 {selectedProject.year || ""}</span>
                <span>📁 {selectedProject.category || "Projeto"}</span>
                <span>🛠️ {selectedProject.tech?.join(', ') || "Tecnologias"}</span>
              </div>
              <div className="t17-modal-desc">{selectedProject.description}</div>
              <div className="t17-modal-footer">
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" className="t17-btn-primary" style={{ textDecoration: 'none' }}>Visualizar Site →</a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" className="t17-btn-outline" style={{ textDecoration: 'none' }}>GitHub ↗</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Entre em Contato</DialogTitle>
          </DialogHeader>
          <ContactSection userId={userId} compact />
        </DialogContent>
      </Dialog>
    </div>
  );
}
