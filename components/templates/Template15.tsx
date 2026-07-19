"use client";

import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Hero } from "@/types/hero";
import { About } from "@/types/about";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { Testimonial } from "@/types/testimonial";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/ui/user-avatar";
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
          className="text-[10px] font-bold uppercase mt-2 hover:underline cursor-pointer text-inherit opacity-60 hover:opacity-100 transition-opacity"
        >
          Mais...
        </button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div
            className="text-sm leading-relaxed"
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

export default function Template15({ userId, categories, projects, userImage, userName }: TemplateProps) {

  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [contact, setContact] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [visibleLimit, setVisibleLimit] = useState<number>(6);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

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
      return [featured, ...others].slice(0, 3);
    }
    return sorted.slice(0, 3);
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

  const processSteps = [
    { n: '01', title: 'Briefing & Descoberta', desc: 'Reunião inicial para entender objetivos, público-alvo e expectativas do projeto.' },
    { n: '02', title: 'Proposta & Estratégia', desc: 'Cronograma, entregáveis e investimento definidos com total transparência.' },
    { n: '03', title: 'Execução & Updates', desc: 'Comunicação constante e acompanhamento do progresso em tempo real.' },
    { n: '04', title: 'Revisão & Aprovação', desc: 'Rodadas de feedback para garantir um resultado acima das expectativas.' },
    { n: '05', title: 'Revisão & Entrega', desc: 'Entrega final com documentação e suporte pós-lançamento garantido.' },
  ];

  return (
    <div className="t15-wrapper" data-theme={theme}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800;900&display=swap');

        :root {
          --font-display: 'Archivo Black', 'Inter', sans-serif;
          --font-body: 'Inter', sans-serif;
          --r-sm: 6px;
          --r-md: 10px;
          --r-lg: 16px;
          --r-full: 999px;
        }

        [data-theme="dark"] {
          --bg: #0a0a0a;
          --bg2: #000000;
          --surface: #101010;
          --card: #121212;
          --card2: #161616;
          --ink: #ffffff;
          --ink-dim: rgba(255,255,255,0.62);
          --ink-faint: rgba(255,255,255,0.4);
          --border: rgba(255,255,255,0.14);
          --border-strong: rgba(255,255,255,0.5);
          --fill: #ffffff;
          --fill-ink: #0a0a0a;
          --track: rgba(255,255,255,0.12);
        }

        [data-theme="light"] {
          --bg: #ffffff;
          --bg2: #f4f4f4;
          --surface: #f6f6f6;
          --card: #ffffff;
          --card2: #f0f0f0;
          --ink: #0a0a0a;
          --ink-dim: rgba(10,10,10,0.65);
          --ink-faint: rgba(10,10,10,0.42);
          --border: rgba(10,10,10,0.14);
          --border-strong: rgba(10,10,10,0.55);
          --fill: #0a0a0a;
          --fill-ink: #ffffff;
          --track: rgba(10,10,10,0.1);
        }

        .t15-wrapper *, .t15-wrapper *::before, .t15-wrapper *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }

        .t15-wrapper {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--ink);
          line-height: 1.6;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .t15-wrapper ::-webkit-scrollbar { width: 6px; }
        .t15-wrapper ::-webkit-scrollbar-track { background: var(--bg); }
        .t15-wrapper ::-webkit-scrollbar-thumb { background: var(--ink); border-radius: 10px; }

        /* ── NAV ── */
        .t15-nav {
          position: sticky; top: 0; z-index: 100;
          background: var(--bg);
          border-bottom: 2px solid var(--border);
          padding: 0 2rem;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .t15-nav-links { display: flex; align-items: center; gap: 2.2rem; list-style: none; }

        .t15-nav-links a {
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: var(--ink);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .t15-nav-links a:hover { opacity: 0.6; }

        .t15-nav-actions { display: flex; align-items: center; gap: 1.4rem; }

        .t15-login-link {
          display: flex; align-items: center; gap: 6px;
          font-family: var(--font-display);
          font-size: 0.72rem;
          color: var(--ink);
          text-decoration: none;
        }

        .t15-btn-theme {
          background: transparent;
          border: 1.5px solid var(--border);
          color: var(--ink);
          width: 36px; height: 36px;
          border-radius: var(--r-full);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem;
        }

        .t15-btn-hire {
          font-family: var(--font-display);
          font-size: 0.72rem;
          background: var(--fill);
          color: var(--fill-ink);
          border: none;
          padding: 0.65rem 1.4rem;
          border-radius: var(--r-full);
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          transition: transform 0.2s;
        }
        .t15-btn-hire:hover { transform: translateY(-2px); }

        .t15-hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .t15-hamburger span { display: block; width: 22px; height: 2px; background: var(--ink); }

        /* ── HERO ── */
        .t15-hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3rem;
          padding: 4rem 2rem 3rem;
          align-items: center;
        }

        .t15-hero-headline {
          font-family: var(--font-display);
          font-size: clamp(2.6rem, 6vw, 5rem);
          line-height: 0.98;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-bottom: 1.3rem;
          word-break: break-word;
        }

        .t15-hero-bio {
          font-size: 0.95rem;
          color: var(--ink-dim);
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .t15-hero-stats {
          display: flex; gap: 2.4rem;
          margin-bottom: 2rem;
        }

        .t15-stat-number {
          font-family: var(--font-display);
          font-size: 2.2rem;
          line-height: 1;
        }

        .t15-stat-label {
          font-size: 0.66rem;
          color: var(--ink-dim);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 6px;
          font-weight: 600;
        }

        .t15-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }

        .t15-btn-primary {
          font-family: var(--font-display);
          font-size: 0.78rem;
          background: var(--fill);
          color: var(--fill-ink);
          border: 2px solid var(--fill);
          padding: 0.9rem 1.8rem;
          border-radius: var(--r-md);
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: transform 0.2s;
        }
        .t15-btn-primary:hover { transform: translateY(-2px); }

        .t15-btn-secondary {
          font-family: var(--font-display);
          font-size: 0.78rem;
          background: transparent;
          color: var(--ink);
          border: 2px solid var(--border-strong);
          padding: 0.9rem 1.8rem;
          border-radius: var(--r-md);
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .t15-btn-secondary:hover { border-color: var(--ink); transform: translateY(-2px); }

        .t15-hero-photo-wrap {
          border: 2px solid var(--border-strong);
          border-radius: var(--r-lg);
          overflow: hidden;
          background: var(--card);
        }

        .t15-hero-photo {
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          object-position: top center;
          display: block;
          filter: grayscale(1) contrast(1.05);
        }

        /* ── SECTIONS ── */
        .t15-section { padding: 3.5rem 2rem; }

        .t15-section-title {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 3vw, 2.3rem);
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .t15-section-desc {
          color: var(--ink-dim);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 640px;
        }

        /* ── SERVICES ── */
        .t15-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.2rem;
        }

        .t15-service-card {
          background: var(--card);
          border: 2px solid var(--border);
          border-radius: var(--r-lg);
          padding: 1.6rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .t15-service-card:hover { border-color: var(--border-strong); transform: translateY(-3px); }

        .t15-service-icon {
          width: 44px; height: 44px;
          border: 2px solid var(--border-strong);
          border-radius: var(--r-sm);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.1rem;
        }

        .t15-service-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }

        .t15-service-desc {
          font-size: 0.82rem;
          color: var(--ink-dim);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .t15-service-price {
          font-family: var(--font-display);
          font-size: 0.78rem;
          text-transform: uppercase;
          border-top: 1px solid var(--border);
          padding-top: 0.8rem;
        }

        /* ── MAIN TWO-COLUMN AREA ── */
        .t15-main-columns {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 2.5rem;
          padding: 0 2rem 3.5rem;
          align-items: start;
        }

        .t15-col-right { display: flex; flex-direction: column; gap: 3rem; }

        /* ── PORTFOLIO ── */
        .t15-portfolio-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .t15-portfolio-grid > *:first-child { grid-column: 1 / -1; }

        .t15-portfolio-card {
          background: var(--card);
          border: 2px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
        }
        .t15-portfolio-card:hover { border-color: var(--border-strong); transform: translateY(-3px); }

        .t15-portfolio-thumb {
          width: 100%;
          aspect-ratio: 16/10;
          object-fit: cover;
          display: block;
        }

        .t15-portfolio-thumb-placeholder {
          width: 100%;
          aspect-ratio: 16/10;
          background: var(--card2);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
        }

        .t15-portfolio-info { padding: 1rem 1.2rem; }

        .t15-portfolio-tag {
          font-family: var(--font-display);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink-dim);
          margin-bottom: 6px;
        }

        .t15-portfolio-title {
          font-family: var(--font-display);
          font-size: 0.92rem;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .t15-portfolio-desc {
          font-size: 0.78rem;
          color: var(--ink-dim);
          line-height: 1.55;
          margin-bottom: 6px;
        }

        .t15-portfolio-year { font-size: 0.72rem; color: var(--ink-faint); }

        .t15-portfolio-tabs {
          display: flex; gap: 10px; flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .t15-portfolio-tab {
          font-family: var(--font-display);
          font-size: 0.68rem;
          text-transform: uppercase;
          background: transparent;
          color: var(--ink-dim);
          border: 1.5px solid var(--border);
          padding: 0.5rem 1.1rem;
          border-radius: var(--r-full);
          cursor: pointer;
          transition: all 0.2s;
        }
        .t15-portfolio-tab.active {
          background: var(--fill);
          color: var(--fill-ink);
          border-color: var(--fill);
        }
        .t15-portfolio-tab:hover:not(.active) { border-color: var(--border-strong); color: var(--ink); }

        .t15-portfolio-grid-filtered {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .t15-portfolio-load-more {
          font-family: var(--font-display);
          font-size: 0.72rem;
          text-transform: uppercase;
          background: transparent;
          border: 1.5px solid var(--border-strong);
          color: var(--ink);
          padding: 0.65rem 1.4rem;
          border-radius: var(--r-full);
          cursor: pointer;
          margin-top: 1.5rem;
          transition: all 0.2s;
        }
        .t15-portfolio-load-more:hover { background: var(--fill); color: var(--fill-ink); }

        /* ── TOOLS / SKILLS ── */
        .t15-skill-bar-item { margin-bottom: 1rem; }

        .t15-skill-bar-header {
          display: flex; justify-content: space-between;
          font-size: 0.76rem;
          margin-bottom: 6px;
        }

        .t15-skill-bar-name { font-weight: 600; }
        .t15-skill-bar-pct { color: var(--ink-dim); }

        .t15-skill-bar-track {
          height: 6px;
          background: var(--track);
          border-radius: var(--r-full);
          overflow: hidden;
        }

        .t15-skill-bar-fill {
          height: 100%;
          background: var(--fill);
          border-radius: var(--r-full);
        }

        .t15-tools-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 1.2rem;
        }

        .t15-tool-chip {
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: var(--r-sm);
          padding: 0.6rem 0.3rem;
          text-align: center;
          font-size: 0.6rem;
          font-weight: 600;
          color: var(--ink-dim);
        }
        .t15-tool-chip .t15-tool-emoji { display: block; font-size: 1.1rem; margin-bottom: 3px; }

        /* ── PROCESS ── */
        .t15-process-steps {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.6rem;
        }

        .t15-process-step {
          border-left: 1.5px solid var(--border);
          padding-left: 0.6rem;
        }

        .t15-step-number {
          font-family: var(--font-display);
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }

        .t15-step-title {
          font-family: var(--font-display);
          font-size: 0.62rem;
          text-transform: uppercase;
          line-height: 1.25;
          margin-bottom: 0.4rem;
        }

        .t15-step-desc {
          font-size: 0.6rem;
          color: var(--ink-dim);
          line-height: 1.4;
        }

        /* ── ABOUT ── */
        .t15-about-grid {
          display: grid;
          grid-template-columns: 0.8fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .t15-about-image-wrap {
          border: 2px solid var(--border-strong);
          border-radius: var(--r-lg);
          overflow: hidden;
        }

        .t15-about-image {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          display: block;
          filter: grayscale(1) contrast(1.05);
        }

        .t15-about-text {
          font-size: 0.85rem;
          color: var(--ink-dim);
          line-height: 1.7;
          margin-bottom: 1.2rem;
        }

        .t15-about-highlights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1.3rem;
        }

        .t15-highlight-item {
          border: 1.5px solid var(--border);
          border-radius: var(--r-md);
          padding: 0.8rem;
        }

        .t15-highlight-title {
          font-family: var(--font-display);
          font-size: 0.7rem;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .t15-highlight-desc { font-size: 0.68rem; color: var(--ink-dim); }

        /* ── TESTIMONIALS ── */
        .t15-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.8rem;
        }

        .t15-testimonial-card {
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: var(--r-md);
          padding: 1rem;
          position: relative;
        }

        .t15-testimonial-quote { font-size: 1.4rem; margin-bottom: 0.4rem; opacity: 0.5; }

        .t15-testimonial-text {
          font-size: 0.7rem;
          color: var(--ink-dim);
          line-height: 1.5;
          margin-bottom: 0.8rem;
        }

        .t15-testimonial-author { display: flex; align-items: center; gap: 8px; }

        .t15-author-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 1.5px solid var(--border-strong);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          font-size: 0.8rem;
        }
        .t15-author-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .t15-author-name { font-family: var(--font-display); font-size: 0.68rem; }
        .t15-author-role { font-size: 0.6rem; color: var(--ink-faint); }

        /* ── CONTACT CTA ── */
        .t15-contact-cta {
          text-align: center;
          max-width: 620px;
          margin: 0 auto;
        }

        .t15-contact-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3.2vw, 2.4rem);
          text-transform: uppercase;
          line-height: 1.15;
          margin-bottom: 1.2rem;
        }

        .t15-contact-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 1.6rem; }

        .t15-contact-info {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; color: var(--ink-dim);
        }

        .t15-social-row { display: flex; gap: 12px; justify-content: center; margin-top: 1.2rem; }

        .t15-social-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--ink);
          text-decoration: none;
          font-size: 0.85rem;
        }
        .t15-social-btn:hover { border-color: var(--border-strong); }

        /* ── FOOTER ── */
        .t15-footer {
          border-top: 2px solid var(--border);
          padding: 2rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }

        .t15-footer-text { font-size: 0.74rem; color: var(--ink-dim); }
        .t15-footer-text a { color: var(--ink); }

        .t15-footer-links { display: flex; gap: 1.3rem; list-style: none; }
        .t15-footer-links a { font-size: 0.74rem; color: var(--ink-dim); text-decoration: none; }
        .t15-footer-links a:hover { color: var(--ink); }

        /* ── PROJECT MODAL ── */
        .t15-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 2rem;
        }

        .t15-modal-content {
          background: var(--card);
          border: 2px solid var(--border-strong);
          border-radius: var(--r-lg);
          max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto;
          position: relative;
        }

        .t15-modal-close {
          position: absolute; top: 16px; right: 16px;
          background: var(--fill); color: var(--fill-ink);
          border: none; width: 32px; height: 32px; border-radius: 50%;
          cursor: pointer; z-index: 10;
          display: flex; align-items: center; justify-content: center;
        }

        .t15-modal-image { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        .t15-modal-info { padding: 2rem; }
        .t15-modal-title { font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase; margin-bottom: 0.8rem; }
        .t15-modal-meta { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1.2rem; font-size: 0.75rem; color: var(--ink-dim); }
        .t15-modal-meta span { border: 1.5px solid var(--border); padding: 4px 10px; border-radius: var(--r-full); }
        .t15-modal-desc { font-size: 0.88rem; color: var(--ink-dim); line-height: 1.7; margin-bottom: 1.5rem; }
        .t15-modal-footer { display: flex; gap: 1rem; }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .t15-nav-links { display: none; }
          .t15-hamburger { display: flex; }
          .t15-hero { grid-template-columns: 1fr; }
          .t15-main-columns { grid-template-columns: 1fr; }
          .t15-about-grid { grid-template-columns: 1fr; }
          .t15-process-steps { grid-template-columns: repeat(2, 1fr); }
          .t15-testimonials-grid { grid-template-columns: 1fr; }
          .t15-portfolio-grid-filtered { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .t15-section { padding: 2.5rem 1.2rem; }
          .t15-hero { padding: 2.5rem 1.2rem 2rem; }
          .t15-main-columns { padding: 0 1.2rem 2.5rem; }
          .t15-footer { padding: 2rem 1.2rem; flex-direction: column; text-align: center; }
        }
        `
      }}
      />

      {/* NAV */}
      <nav className="t15-nav">
        <Link href={'/'} className="justify-center">
          <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={80} alterW={120} />
        </Link>
        <ul className="t15-nav-links">
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#portfolio">Portfólio</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        <div className="t15-nav-actions">
          <button className="t15-btn-theme" title="Alternar tema" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a href="#contato" className="t15-btn-hire">＋ Contratar</a>
        </div>
        <button className="t15-hamburger">
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="t15-hero" id="hero">
        <div>
          <h1 className="t15-hero-headline">{fullName}</h1>
          <p className="t15-hero-bio">
            {about?.description
              ? about.description.replace(/<[^>]*>/g, '').slice(0, 220)
              : "Transformo ideias em experiências digitais que geram resultado real, unindo design estratégico, código limpo e marketing orientado a dados."}
          </p>

          <div className="t15-hero-stats">
            <div>
              <div className="t15-stat-number">
                <ProjectsDelivered about={about || undefined} dark={theme === 'dark'} />
              </div>
              <div className="t15-stat-label">Projetos Entregues</div>
            </div>
            <div>
              <div className="t15-stat-number">
                <SatisfiedClients about={about || undefined} dark={theme === 'dark'} />
              </div>
              <div className="t15-stat-label">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="t15-stat-number">
                <ExperienceTime about={about || undefined} dark={theme === 'dark'} />
              </div>
              <div className="t15-stat-label">Tempo de Experiência</div>
            </div>
          </div>

          <div className="t15-hero-ctas">
            <a href="#portfolio" className="t15-btn-primary">Ver Projetos</a>
            <a href="#contato" className="t15-btn-secondary">Fale Comigo</a>
          </div>
        </div>

        <div className="t15-hero-photo-wrap">
          <img
            src={hero?.backgroundImage || userImage}
            alt={fullName}
            className="t15-hero-photo"
          />
        </div>
      </section>

      {/* SERVICES */}
      <section className="t15-section" id="servicos">
        <h2 className="t15-section-title">Serviços</h2>
        <div className="t15-services-grid">
          {about?.features?.map((service, idx) => {
            const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Layout;
            return (
              <div className="t15-service-card" key={idx}>
                <div className="t15-service-icon">
                  <Icon size={22} color="var(--ink)" />
                </div>
                <div className="t15-service-title">{service.title}</div>
                <div
                  className="t15-service-desc"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}
                />
                <div className="t15-service-price">Sob consulta</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MAIN TWO-COLUMN AREA */}
      <div className="t15-main-columns">

        {/* PORTFOLIO — LEFT COLUMN */}
        <section id="portfolio">
          <h2 className="t15-section-title">Portfólio Selecionado</h2>
          <p className="t15-section-desc">Uma seleção dos projetos que mais me orgulho, com foco em resultado e atenção aos detalhes.</p>

          <div className="t15-portfolio-grid">
            {featuredProjects.map((project, idx) => (
              <div className="t15-portfolio-card" key={project._id || idx} onClick={() => setSelectedProject(project)}>
                {project.image ? (
                  <Image src={project.image} alt={project.title} className="t15-portfolio-thumb" width={500} height={300} />
                ) : (
                  <div className="t15-portfolio-thumb-placeholder">{['🚀', '🎨', '📈'][idx % 3]}</div>
                )}
                <div className="t15-portfolio-info">
                  <div className="t15-portfolio-tag">{project.category || "Projeto"}</div>
                  <div className="t15-portfolio-title">{project.title}</div>
                  <div className="t15-portfolio-desc">
                    {project.description?.length > 120 ? `${project.description.slice(0, 120)}...` : project.description}
                  </div>
                  <div className="t15-portfolio-year">{project.year || ""} · {project.tech?.join(' · ') || "Tecnologias"}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="t15-portfolio-tabs">
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`t15-portfolio-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat); setVisibleLimit(6); }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="t15-portfolio-grid-filtered">
            {displayedCategoryProjects.map((project, idx) => (
              <div className="t15-portfolio-card" key={project._id || idx} onClick={() => setSelectedProject(project)}>
                {project.image ? (
                  <Image src={project.image} alt={project.title} className="t15-portfolio-thumb" width={500} height={300} />
                ) : (
                  <div className="t15-portfolio-thumb-placeholder">{['🚀', '🎨', '📈'][idx % 3]}</div>
                )}
                <div className="t15-portfolio-info">
                  <div className="t15-portfolio-tag">{project.category || "Projeto"}</div>
                  <div className="t15-portfolio-title">{project.title}</div>
                  <div className="t15-portfolio-year">{project.year || ""} · {project.tech?.join(' · ') || "Tecnologias"}</div>
                </div>
              </div>
            ))}
          </div>

          {hasMoreProjects && (
            <button className="t15-portfolio-load-more" onClick={() => setVisibleLimit(prev => prev + 6)}>
              Exibir mais projetos
            </button>
          )}
        </section>

        {/* RIGHT COLUMN */}
        <div className="t15-col-right">

          {/* TOOLS */}
          <section id="habilidades">
            <h2 className="t15-section-title">Ferramentas &amp; Tecnologias</h2>
            <div>
              {sortedTech.slice(0, 8).map((tech, idx) => (
                <div className="t15-skill-bar-item" key={idx}>
                  <div className="t15-skill-bar-header">
                    <span className="t15-skill-bar-name">{tech}</span>
                    <span className="t15-skill-bar-pct">{techPercentages[tech]}%</span>
                  </div>
                  <div className="t15-skill-bar-track">
                    <div className="t15-skill-bar-fill" style={{ width: `${techPercentages[tech]}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="t15-tools-grid">
              {sortedTech.map((tech, idx) => (
                <div className="t15-tool-chip" key={idx}>
                  <span className="t15-tool-emoji">{techEmojiMap[tech] || '🛠️'}</span>
                  {tech}
                </div>
              ))}
            </div>
          </section>

          {/* PROCESS */}
          <section id="processo">
            <h2 className="t15-section-title">Do Resultado Final</h2>
            <div className="t15-process-steps">
              {processSteps.map((step) => (
                <div className="t15-process-step" key={step.n}>
                  <div className="t15-step-number">{step.n}</div>
                  <div className="t15-step-title">{step.title}</div>
                  <div className="t15-step-desc">{step.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ABOUT */}
          <section id="sobre">
            <h2 className="t15-section-title">Sobre Mim</h2>
            <div className="t15-about-grid">
              <div className="t15-about-image-wrap">
                <Image
                  src={userImage || hero?.backgroundImage || ""}
                  alt={fullName}
                  className="t15-about-image"
                  width={400}
                  height={520}
                />
              </div>
              <div>
                <ExpandableText
                  text={about?.description || ""}
                  title="Sobre Mim"
                  className="t15-about-text"
                />
                <div className="t15-about-highlights">
                  {about?.features?.slice(0, 2).map((feature, idx) => (
                    <div className="t15-highlight-item" key={idx}>
                      <div className="t15-highlight-title">{feature.title}</div>
                      <ExpandableText
                        text={feature.description}
                        title={feature.title}
                        className="t15-highlight-desc"
                      />
                    </div>
                  ))}
                </div>
                <a href="#contato" className="t15-btn-secondary">＋ Vamos Conversar</a>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section id="depoimentos">
            <h2 className="t15-section-title">O que meus Clientes Dizem</h2>
            <div className="t15-testimonials-grid">
              {testimonials.map((testimonial, idx) => (
                <div className="t15-testimonial-card" key={testimonial._id || idx}>
                  <div className="t15-testimonial-quote">"</div>
                  <p className="t15-testimonial-text">{testimonial.text}</p>
                  <div className="t15-testimonial-author">
                    <div className="t15-author-avatar">
                      {testimonial.image ? (
                        <Image src={testimonial.image} alt={testimonial.name} width={30} height={30} />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div>
                      <div className="t15-author-name">{testimonial.name}</div>
                      <div className="t15-author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-dim)' }}>Nenhum depoimento disponível no momento.</p>
              )}
            </div>
          </section>

          {/* CONTACT CTA */}
          <section id="contato">
            <div className="t15-contact-cta">
              <h2 className="t15-contact-title">Pronto para Elevar seu Negócio Digital?</h2>
              <div className="t15-contact-btns">
                <button onClick={() => setIsContactModalOpen(true)} className="t15-btn-primary">Enviar Mensagem</button>
                {contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t15-btn-secondary"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
              <div className="t15-contact-info">
                {contact?.address && (contact.address.street || contact.address.city || contact.address.state) && (
                  <div>📍 {[contact.address.street, contact.address.city, contact.address.state].filter(Boolean).join(", ") || "Remoto"}</div>
                )}
                {contact?.availability && <div>⏰ Disponível {contact.availability}</div>}
              </div>
              <div className="t15-social-row">
                <a href="#" className="t15-social-btn" title="Instagram">✦</a>
                <a href="#" className="t15-social-btn" title="LinkedIn">in</a>
                <a href="#" className="t15-social-btn" title="WhatsApp">✉</a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="t15-footer">
        <Link href={'/'} className="justify-center">
          <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={80} alterW={120} />
        </Link>
        <p className="t15-footer-text">
          Portfólio criado com <a href="https://portify.art" target="_blank">Portify</a>
        </p>
        <ul className="t15-footer-links">
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#portfolio">Portfólio</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </footer>

      {selectedProject && (
        <div className="t15-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="t15-modal-content" onClick={e => e.stopPropagation()}>
            <button className="t15-modal-close" onClick={() => setSelectedProject(null)}>✕</button>
            {selectedProject.image ? (
              <Image src={selectedProject.image} alt={selectedProject.title} className="t15-modal-image" width={900} height={500} />
            ) : (
              <div className="t15-modal-image" style={{ background: 'var(--card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🚀</div>
            )}
            <div className="t15-modal-info">
              <h3 className="t15-modal-title">{selectedProject.title}</h3>
              <div className="t15-modal-meta">
                <span>📅 {selectedProject.year || ""}</span>
                <span>📁 {selectedProject.category || "Projeto"}</span>
                <span>🛠️ {selectedProject.tech?.join(', ') || "Tecnologias"}</span>
              </div>
              <div className="t15-modal-desc">{selectedProject.description}</div>
              <div className="t15-modal-footer">
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" className="t15-btn-primary" style={{ textDecoration: 'none' }}>Visualizar Site →</a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" className="t15-btn-secondary" style={{ textDecoration: 'none' }}>GitHub ↗</a>
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