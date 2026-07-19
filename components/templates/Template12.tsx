"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
  userImage?: string;
  userName?: string;
}

export default function Template12({ userId, categories, projects, userImage, userName }: TemplateProps) {

  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [contact, setContact] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme12') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [visibleLimit, setVisibleLimit] = useState<number>(6);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedText, setSelectedText] = useState<{ title: string; content: string } | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);

  const truncateWords = (text: string, limit: number) => {
    if (!text) return { truncated: "", isLong: false };
    const plainText = text.replace(/<[^>]*>/g, ' ').trim();
    const words = plainText.split(/\s+/);
    if (words.length <= limit) return { truncated: text, isLong: false };
    return {
      truncated: words.slice(0, limit).join(' ') + '...',
      isLong: true
    };
  };

  useEffect(() => {
    localStorage.setItem('theme12', theme);
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

  // Scroll reveal, mirrors the reveal / reveal-stagger behavior from the reference design
  useEffect(() => {
    const targets = revealRefs.current.filter(Boolean);
    if (!('IntersectionObserver' in window) || targets.length === 0) {
      targets.forEach((el) => el?.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loading, about, testimonials]);

  const addReveal = useCallback((el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }, []);

  const fullName = userName || hero?.title || "Freelancer Profissional";

  const userProjects = projects.filter(p => p.userId === userId);

  const sortedByDate = [...userProjects].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const allCategories = ['Todos', ...Array.from(new Set(userProjects.map(p => p.category).filter(Boolean)))];

  const filteredProjects = activeCategory === 'Todos'
    ? sortedByDate
    : sortedByDate.filter(p => p.category === activeCategory);

  const displayedProjects = filteredProjects.slice(0, visibleLimit);
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
    <div className="template12-wrapper" data-theme={theme}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        .template12-wrapper[data-theme="dark"] {
          --bg: #0a0a0a;
          --panel: #161616;
          --panel2: #1d1d1d;
          --ink: #f6f6f1;
          --ink-soft: #b0b0b0;
          --ink-faint: #828282;
          --line: rgba(246,246,241,0.14);
          --btn-bg: #f6f6f1;
          --btn-text: #111111;
        }
        .template12-wrapper[data-theme="light"] {
          --bg: #f6f6f1;
          --panel: #e6e6e1;
          --panel2: #dfdfda;
          --ink: #111111;
          --ink-soft: #444444;
          --ink-faint: #777777;
          --line: rgba(0,0,0,0.1);
          --btn-bg: #111111;
          --btn-text: #f6f6f1;
        }
        .template12-wrapper {
          --radius-lg: 40px;
          background: var(--bg);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          line-height: 1.5;
          min-height: 100vh;
          overflow-x: hidden;
          transition: background 0.4s, color 0.4s;
        }

        .template12-wrapper *, .template12-wrapper *::before, .template12-wrapper *::after {
          box-sizing: border-box;
        }

        .template12-wrapper .t12-display {
          font-family: 'Anton', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          line-height: 0.96;
        }

        .template12-wrapper .t12-serif {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          text-transform: none;
          letter-spacing: 0;
        }

        .template12-wrapper .t12-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .template12-wrapper a { color: inherit; text-decoration: none; }
        .template12-wrapper img { display: block; max-width: 100%; }
        .template12-wrapper button { font-family: inherit; }

        /* ---------- HEADER ---------- */
        .template12-wrapper .t12-header {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 22px 0;
          background: var(--bg);
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s, background 0.4s;
        }

        .template12-wrapper .t12-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .template12-wrapper .t12-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .template12-wrapper .t12-brand .t12-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--ink);
          display: inline-block;
        }

        .template12-wrapper .t12-nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }

        .template12-wrapper .t12-nav-links a {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-soft);
          transition: color 0.2s;
        }

        .template12-wrapper .t12-nav-links a:hover { color: var(--ink); }

        .template12-wrapper .t12-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .template12-wrapper .t12-theme-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: transparent;
          color: var(--ink-soft);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 0.95rem;
          transition: border-color 0.2s, color 0.2s;
        }
        .template12-wrapper .t12-theme-btn:hover { border-color: var(--ink); color: var(--ink); }

        .template12-wrapper .t12-menu-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--btn-bg);
          color: var(--btn-text);
          border: none;
          padding: 11px 20px 11px 22px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .template12-wrapper .t12-menu-btn svg { width: 14px; height: 14px; }

        .template12-wrapper .t12-mobile-panel {
          position: fixed; inset: 0; z-index: 200;
          background: var(--bg);
          padding: 100px 40px 40px;
          display: flex; flex-direction: column; gap: 24px;
        }
        .template12-wrapper .t12-mobile-panel a {
          font-family: 'Anton', sans-serif;
          text-transform: uppercase;
          font-size: 2rem;
        }
        .template12-wrapper .t12-mobile-close {
          position: absolute; top: 26px; right: 30px;
          background: none; border: none; color: var(--ink);
          font-size: 1.6rem; cursor: pointer;
        }

        /* ---------- HERO ---------- */
        .template12-wrapper .t12-hero { padding: 36px 0 10px; }
        .template12-wrapper .t12-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 40px;
          align-items: start;
        }
        .template12-wrapper .t12-eyebrow-plain {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          margin-bottom: 10px;
          color: var(--ink);
        }
        .template12-wrapper .t12-eyebrow-plain strong { font-weight: 700; }

        .template12-wrapper .t12-hero-title {
          margin-bottom: 22px;
        }
        .template12-wrapper .t12-hero-title span {
          display: block;
        }
        .template12-wrapper .t12-title-a,
        .template12-wrapper .t12-title-c {
          font-size: clamp(2.1rem, 4.4vw, 3.4rem);
        }
        .template12-wrapper .t12-title-b.t12-serif {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 500;
          margin: -0.05em 0;
        }
        .template12-wrapper .t12-title-c { font-weight: 400; }

        .template12-wrapper .t12-lede {
          max-width: 420px;
          font-size: 16px;
          line-height: 1.65;
          color: var(--ink-soft);
          margin-bottom: 30px;
        }
        .template12-wrapper .t12-cta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: var(--btn-bg);
          color: var(--btn-text);
          padding: 9px 9px 9px 24px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: transform 0.25s, opacity 0.25s;
        }
        .template12-wrapper .t12-cta:hover { transform: translateY(-2px); opacity: 0.92; }
        .template12-wrapper .t12-cta .t12-circle {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--bg);
          color: var(--ink);
          display: flex; align-items: center; justify-content: center;
        }
        .template12-wrapper .t12-cta .t12-circle svg { width: 15px; height: 15px; }

        .template12-wrapper .t12-hero-visual {
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }
        .template12-wrapper .t12-photo-col {
          position: relative;
          flex: 1 1 auto;
          min-width: 0;
        }
        .template12-wrapper .t12-photo-backdrop {
          position: absolute;
          top: -22px; left: -24px; right: 20px; bottom: -22px;
          background: var(--panel2);
          border-radius: 24px 24px 220px 220px;
          z-index: 0;
        }
        .template12-wrapper .t12-photo-frame {
          border-radius: 20px 20px 200px 200px;
          overflow: hidden;
          aspect-ratio: 3/3.6;
          background: var(--panel2);
          position: relative;
          z-index: 1;
        }
        .template12-wrapper .t12-photo-frame img { width: 100%; height: 100%; object-fit: cover; }
        .template12-wrapper .t12-photo-tag {
          position: absolute;
          bottom: 18px; left: -18px;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 0.7rem 1.1rem;
          display: flex; align-items: center; gap: 10px;
          font-size: 0.78rem;
          z-index: 10;
          box-shadow: 0 12px 30px rgba(0,0,0,0.18);
        }
        .template12-wrapper .t12-photo-tag strong { display: block; font-size: 0.85rem; }
        .template12-wrapper .t12-photo-tag span { color: var(--ink-soft); font-size: 0.7rem; }

        .template12-wrapper .t12-stats-vertical {
          flex: 0 0 auto;
          width: 100px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          padding-top: 8px;
          text-align: right;
        }
        .template12-wrapper .t12-stat-num {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          line-height: 1;
        }
        .template12-wrapper .t12-stat-label {
          font-size: 10.5px;
          color: var(--ink-faint);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* ---------- FEATURES / SERVICES ---------- */
        .template12-wrapper .t12-features { padding: 68px 0 54px; }
        .template12-wrapper .t12-section-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 30px;
        }
        .template12-wrapper .t12-section-top h2 {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .template12-wrapper .t12-section-top p {
          font-size: 13.5px;
          color: var(--ink-soft);
          max-width: 420px;
          text-align: right;
        }
        .template12-wrapper .t12-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
          justify-content: center;
          gap: 0 26px;
        }
        .template12-wrapper .t12-feature {
          padding: 0 26px;
          border-left: none;
        }
        .template12-wrapper .t12-feature:first-child { padding-left: 0; border-left: none; }
        .template12-wrapper .t12-feature h3 {
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .template12-wrapper .t12-feature p {
          font-size: 13px;
          line-height: 1.6;
          color: var(--ink-faint);
        }

        /* ---------- TOOLS / SKILLS ---------- */
        .template12-wrapper .t12-tools { padding: 54px 0 70px; }
        .template12-wrapper .t12-tools-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--line);
          border-radius: 4px;
          overflow: hidden;
        }
        .template12-wrapper .t12-tool-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px 24px;
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--ink-soft);
        }
        .template12-wrapper .t12-tool-cell .t12-tool-pct {
          margin-left: auto;
          font-family: 'Anton', sans-serif;
          font-size: 12px;
          color: var(--ink-faint);
        }
        .template12-wrapper .t12-tools-grid .t12-tool-cell:nth-child(4n) { border-right: none; }
        .template12-wrapper .t12-tools-grid .t12-tool-cell:nth-last-child(-n+4) { border-bottom: none; }

        /* ---------- ABOUT ---------- */
        .template12-wrapper .t12-about { padding: 26px 0 78px; }
        .template12-wrapper .t12-about-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: start;
        }
        .template12-wrapper .t12-about-image-wrap {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .template12-wrapper .t12-about-image {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          display: block;
        }
        .template12-wrapper .t12-about h2 { font-size: clamp(1.9rem, 3.4vw, 2.4rem); line-height: 1.08; margin-bottom: 24px; }
        .template12-wrapper .t12-about-copy p { font-size: 16px; line-height: 1.7; color: var(--ink); }
        .template12-wrapper .t12-about-copy p.t12-lead { font-weight: 600; margin-bottom: 18px; }
        .template12-wrapper .t12-about-copy .t12-body-text {
          color: var(--ink-soft);
          font-size: 14.5px;
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }
        .template12-wrapper .t12-about-copy .t12-body-text * { margin: 0 0 0.8em; }
        .template12-wrapper .t12-highlights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 1.5rem;
        }
        .template12-wrapper .t12-highlight {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 1rem 1.1rem;
          display: flex; align-items: flex-start; gap: 10px;
        }
        .template12-wrapper .t12-highlight strong { display: block; font-size: 0.85rem; margin-bottom: 2px; }
        .template12-wrapper .t12-highlight span { font-size: 0.76rem; color: var(--ink-soft); }

        /* ---------- PORTFOLIO ---------- */
        .template12-wrapper .t12-portfolio { padding: 10px 0 90px; }
        .template12-wrapper .t12-portfolio-top h2 { font-size: clamp(2rem, 4vw, 2.7rem); }
        .template12-wrapper .t12-portfolio-tabs {
          display: flex; gap: 10px; flex-wrap: wrap; margin: 26px 0 34px;
        }
        .template12-wrapper .t12-tab {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--ink-soft);
          padding: 9px 20px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .template12-wrapper .t12-tab.active {
          background: var(--btn-bg);
          color: var(--btn-text);
          border-color: var(--btn-bg);
        }
        .template12-wrapper .t12-project-list {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 24px;
        }
        .template12-wrapper .t12-project-card {
          flex: 0 0 calc((100% - 48px) / 3);
          border-radius: 28px;
          overflow: hidden;
          background: var(--panel);
          cursor: pointer;
        }

        .read-more-btn {
          background: none;
          border: none;
          color: var(--ink);
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: underline;
          margin-left: 4px;
          padding: 0;
        }
        .template12-wrapper .t12-project-card img,
        .template12-wrapper .t12-project-placeholder {
          width: 100%;
          height: 460px;
          object-fit: cover;
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem;
          background: linear-gradient(135deg, var(--panel2), var(--panel));
          transition: transform 0.6s cubic-bezier(.22,.61,.36,1);
        }
        .template12-wrapper .t12-project-card:hover img { transform: scale(1.03); }
        .template12-wrapper .t12-project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 6px 0;
          flex-wrap: wrap;
          gap: 12px;
        }
        .template12-wrapper .t12-project-meta h3 {
          font-family: 'Anton', sans-serif;
          text-transform: uppercase;
          font-size: 20px;
        }
        .template12-wrapper .t12-meta-right {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 13px;
          color: var(--ink-soft);
          flex-wrap: wrap;
        }
        .template12-wrapper .t12-tag-pill {
          background: var(--btn-bg);
          color: var(--btn-text);
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .template12-wrapper .t12-load-more {
          display: block;
          margin: 40px auto 0;
          background: transparent;
          border: 1px solid var(--line);
          color: var(--ink);
          padding: 12px 30px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .template12-wrapper .t12-load-more:hover { border-color: var(--ink); }

        /* ---------- TESTIMONIALS ---------- */
        .template12-wrapper .t12-testimonials { padding: 10px 0 90px; }
        .template12-wrapper .t12-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .template12-wrapper .t12-testimonial-card {
          background: var(--panel);
          border-radius: 24px;
          padding: 1.8rem;
          position: relative;
        }
        .template12-wrapper .t12-testimonial-stars { color: var(--ink); font-size: 0.85rem; margin-bottom: 1rem; letter-spacing: 2px; }
        .template12-wrapper .t12-testimonial-text {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 1.02rem;
          line-height: 1.6;
          color: var(--ink);
          margin-bottom: 1.4rem;
        }
        .template12-wrapper .t12-testimonial-author { display: flex; align-items: center; gap: 12px; }
        .template12-wrapper .t12-author-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--panel2);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          font-size: 1rem;
        }
        .template12-wrapper .t12-author-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .template12-wrapper .t12-author-name { font-weight: 700; font-size: 0.85rem; }
        .template12-wrapper .t12-author-role { font-size: 0.72rem; color: var(--ink-faint); }

        /* ---------- CONTACT CTA ---------- */
        .template12-wrapper .t12-contact { padding: 30px 0 90px; }
        .template12-wrapper .t12-contact-panel {
          background: var(--panel);
          border-radius: var(--radius-lg);
          padding: 70px 60px;
          text-align: center;
        }
        .template12-wrapper .t12-contact-panel h2 {
          font-size: clamp(2rem, 4.4vw, 3.2rem);
          margin-bottom: 18px;
        }
        .template12-wrapper .t12-contact-panel p {
          max-width: 520px;
          margin: 0 auto 30px;
          color: var(--ink-soft);
          font-size: 1rem;
          line-height: 1.7;
        }
        .template12-wrapper .t12-contact-btns {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px;
        }
        .template12-wrapper .t12-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid var(--line);
          color: var(--ink);
          padding: 12px 26px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          background: transparent;
          transition: border-color 0.2s;
        }
        .template12-wrapper .t12-btn-outline:hover { border-color: var(--ink); }
        .template12-wrapper .t12-contact-info {
          display: flex; gap: 26px; justify-content: center; flex-wrap: wrap;
          font-size: 0.82rem; color: var(--ink-soft);
        }
        .template12-wrapper .t12-contact-info-item { display: flex; align-items: center; gap: 6px; }

        /* ---------- FOOTER ---------- */
        .template12-wrapper .t12-footer {
          border-top: 1px solid var(--line);
          padding: 30px 0 40px;
        }
        .template12-wrapper .t12-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 12.5px;
          color: var(--ink-faint);
        }
        .template12-wrapper .t12-footer-row a { color: var(--ink-soft); }
        .template12-wrapper .t12-footer-links { display: flex; gap: 22px; }
        .template12-wrapper .t12-footer-logo img { height: 26px; width: auto; opacity: 0.8; }

        /* ---------- PROJECT MODAL ---------- */
        .template12-wrapper .t12-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 2rem;
        }
        .template12-wrapper .t12-modal-content {
          background: var(--panel);
          border-radius: 28px;
          max-width: 880px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .template12-wrapper .t12-modal-close {
          position: absolute; top: 18px; right: 18px;
          background: rgba(0,0,0,0.5);
          color: #fff;
          border: none; width: 34px; height: 34px;
          border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 10;
        }
        .template12-wrapper .t12-modal-image {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
        }
        .template12-wrapper .t12-modal-info { padding: 2.2rem; }
        .template12-wrapper .t12-modal-title {
          font-family: 'Anton', sans-serif;
          text-transform: uppercase;
          font-size: 1.7rem;
          margin-bottom: 0.9rem;
        }
        .template12-wrapper .t12-modal-meta {
          display: flex; gap: 0.8rem; flex-wrap: wrap;
          margin-bottom: 1.2rem; font-size: 0.8rem; color: var(--ink-soft);
        }
        .template12-wrapper .t12-modal-meta span {
          background: var(--panel2); padding: 4px 12px; border-radius: 999px;
        }
        .template12-wrapper .t12-modal-desc {
          font-size: 0.95rem; line-height: 1.7; color: var(--ink-soft); margin-bottom: 1.6rem;
        }
        .template12-wrapper .t12-modal-footer { display: flex; gap: 0.8rem; }

        /* ---------- REVEAL ---------- */
        @media (prefers-reduced-motion: no-preference) {
          .template12-wrapper .t12-reveal {
            opacity: 0;
            transform: translateY(26px);
            transition: opacity 0.8s cubic-bezier(.22,.61,.36,1), transform 0.8s cubic-bezier(.22,.61,.36,1);
          }
          .template12-wrapper .t12-reveal.is-visible { opacity: 1; transform: translateY(0); }
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 880px) {
          .template12-wrapper .t12-wrap { padding: 0 22px; }
          .template12-wrapper .t12-hero-grid { grid-template-columns: 1fr; gap: 30px; }
          .template12-wrapper .t12-hero-visual { order: -1; max-width: 340px; margin: 0 auto; }
          .template12-wrapper .t12-stats-vertical { width: 84px; gap: 20px; }
          .template12-wrapper .t12-stat-num { font-size: 22px; }
          .template12-wrapper .t12-features-grid { grid-template-columns: repeat(2, 1fr); gap: 26px 20px; }
          .template12-wrapper .t12-feature { border-left: none; padding-left: 0; }
          .template12-wrapper .t12-tools-grid { grid-template-columns: repeat(2, 1fr); }
          .template12-wrapper .t12-tools-grid .t12-tool-cell:nth-child(4n) { border-right: 1px solid var(--line); }
          .template12-wrapper .t12-tools-grid .t12-tool-cell:nth-child(2n) { border-right: none; }
          .template12-wrapper .t12-about-grid { grid-template-columns: 1fr; gap: 26px; }
          .template12-wrapper .t12-section-top { flex-direction: column; align-items: flex-start; }
          .template12-wrapper .t12-section-top p { text-align: left; }
          .template12-wrapper .t12-project-card img, .template12-wrapper .t12-project-placeholder { height: 280px; }
          .template12-wrapper .t12-contact-panel { padding: 50px 26px; }
        }
      ` }} />

      <div className="t12-wrap">
        {/* HEADER */}
        <header className="t12-header">
          <div className="t12-header-row">
            <div className="t12-brand"><span className="t12-dot"></span><span>{fullName}</span></div>
            <div className="t12-header-actions">
              <button
                className="t12-theme-btn"
                title="Alternar tema"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button className="t12-menu-btn" onClick={() => setIsMenuOpen(true)}>
                MENU
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {isMenuOpen && (
          <div className="t12-mobile-panel">
            <button className="t12-mobile-close" onClick={() => setIsMenuOpen(false)}>✕</button>
            <a href="#servicos" onClick={() => setIsMenuOpen(false)}>Serviços</a>
            <a href="#portfolio" onClick={() => setIsMenuOpen(false)}>Portfólio</a>
            <a href="#sobre" onClick={() => setIsMenuOpen(false)}>Sobre</a>
            <a href="#depoimentos" onClick={() => setIsMenuOpen(false)}>Depoimentos</a>
            <a href="#contato" onClick={() => setIsMenuOpen(false)}>Contato</a>
          </div>
        )}

        {/* HERO */}
        <section className="t12-hero" id="hero">
          <div className="t12-hero-grid">
            <div className="t12-hero-copy t12-reveal" ref={addReveal}>
              <p className="t12-eyebrow-plain">Olá, eu sou <strong>{fullName.split(' ')[0]}</strong>,</p>
              <h1 className="t12-display t12-hero-title">
                <span className="t12-title-a">Freelancer</span>
                <span className="t12-title-b t12-serif">Design &amp; Código</span>
                <span className="t12-title-c">Sob Medida</span>
              </h1>
              <p className="t12-lede">
                {(() => {
                  const text = (hero as any)?.description || "Transformo ideias em produtos digitais completos, unindo interfaces bem pensadas, código sólido e estratégia para gerar resultado real para o seu negócio.";
                  const { truncated, isLong } = truncateWords(text, 80);
                  return (
                    <>
                      {truncated}
                      {isLong && (
                        <button className="read-more-btn" onClick={() => setSelectedText({ title: "Hero Description", content: text })}>... mais</button>
                      )}
                    </>
                  );
                })()}
              </p>
              <button className="t12-cta" onClick={() => setIsContactModalOpen(true)}>
                <span>Fale Comigo</span>
                <span className="t12-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
            </div>

            <div className="t12-hero-visual t12-reveal" ref={addReveal}>
              <div className="t12-photo-col">
                <div className="t12-photo-backdrop" aria-hidden="true"></div>
                <div className="t12-photo-frame">
                  <img src={hero?.backgroundImage || userImage} alt={fullName} />
                  
                </div>
                <div className="t12-photo-tag">
                    <span>⚡</span>
                    <div>
                      <strong>Disponível</strong>
                      <span>Para novos projetos</span>
                    </div>
                  </div>
              </div>

              <div className="t12-stats-vertical">
                <div className="t12-stat-v">
                  <div className="t12-stat-num"><ExperienceTime about={about || undefined} dark={theme === 'dark'} /></div>
                  <div className="t12-stat-label">Anos de Experiência</div>
                </div>
                <div className="t12-stat-v">
                  <div className="t12-stat-num"><ProjectsDelivered about={about || undefined} dark={theme === 'dark'} /></div>
                  <div className="t12-stat-label">Projetos Entregues</div>
                </div>
                <div className="t12-stat-v">
                  <div className="t12-stat-num"><SatisfiedClients about={about || undefined} dark={theme === 'dark'} /></div>
                  <div className="t12-stat-label">Satisfação dos Clientes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES / SERVICES */}
        <section className="t12-features" id="servicos">
          <div className="t12-section-top t12-reveal" ref={addReveal}>
            <h2>O Que Eu Faço</h2>
            <p>Cada projeto é tratado com atenção aos detalhes e foco em resultado real para o seu negócio.</p>
          </div>
          <div className="t12-features-grid">
            {about?.features?.map((service, idx) => {
              return (
                <div className="t12-feature t12-reveal" key={idx} ref={addReveal}>
                  <h3>{service.title}</h3>
                  <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--ink-faint)' }}>
                    {(() => {
                      const text = service.description;
                      const { truncated, isLong } = truncateWords(text, 80);
                      return (
                        <>
                          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncated) }} />
                          {isLong && (
                            <button className="read-more-btn" onClick={() => setSelectedText({ title: service.title, content: text })}>... mais</button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
            {(!about?.features || about.features.length === 0) && (
              <p style={{ color: 'var(--ink-faint)' }}>Nenhum serviço cadastrado no momento.</p>
            )}
          </div>
        </section>

        {/* TOOLS / TECH */}
        {sortedTech.length > 0 && (
          <section className="t12-tools" id="habilidades">
            <div className="t12-section-top t12-reveal" ref={addReveal}>
              <h2>Ferramentas &amp; Tecnologias</h2>
              <p>As tecnologias mais presentes nos projetos entregues até aqui.</p>
            </div>
            <div className="t12-tools-grid t12-reveal" ref={addReveal}>
              {sortedTech.slice(0, 12).map((tech, idx) => (
                <div className="t12-tool-cell" key={idx}>
                  <span>{techEmojiMap[tech] || '🛠️'}</span>
                  {tech}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ABOUT */}
        <section className="t12-about" id="sobre">
          <div className="t12-about-grid t12-reveal" ref={addReveal}>
            <div className="t12-about-image-wrap">
              <Image
                src={userImage || hero?.backgroundImage || ""}
                alt={fullName}
                className="t12-about-image"
                width={600}
                height={800}
              />
            </div>
            <div className="t12-about-copy">
              <h2
                className="t12-display"
                dangerouslySetInnerHTML={{ __html: about?.title || "Criando<br>Soluções Que<br>Geram Resultado" }}
              />
              <p className="t12-lead">
                Olá, sou {fullName.split(' ')[0]}, freelancer digital apaixonado por transformar ideias em produtos que funcionam de verdade.
              </p>
              <div
                className="t12-body-text"
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const text = about?.description || "";
                    const { truncated, isLong } = truncateWords(text, 80);
                    return truncated;
                  })()
                }}
              />
              {truncateWords(about?.description || "", 80).isLong && (
                <button
                  className="read-more-btn"
                  style={{ display: 'block', marginBottom: '1.5rem' }}
                  onClick={() => setSelectedText({ title: about?.title || "Sobre Mim", content: about?.description || "" })}
                >
                  ... mais
                </button>
              )}
              {about?.features && about.features.length > 0 && (
                <div className="t12-highlights">
                  {about.features.slice(0, 4).map((feature, idx) => (
                    <div className="t12-highlight" key={idx}>
                      <div>
                        <strong>{feature.title}</strong>
                        {(() => {
                          const text = feature.description;
                          const { truncated, isLong } = truncateWords(text, 80);
                          return (
                            <span style={{ fontSize: '0.76rem', color: 'var(--ink-soft)' }}>
                              <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncated) }} />
                              {isLong && (
                                <button className="read-more-btn" onClick={() => setSelectedText({ title: feature.title, content: text })}>... mais</button>
                              )}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '1.8rem' }}>
                <button className="t12-cta" onClick={() => setIsContactModalOpen(true)}>
                  <span>Vamos Conversar</span>
                  <span className="t12-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section className="t12-portfolio" id="portfolio">
          <div className="t12-portfolio-top t12-reveal" ref={addReveal}>
            <h2 className="t12-display">Portfólio</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
              Conheça alguns projetos recentes e veja como posso ajudar a transformar a sua ideia em realidade.
            </p>
          </div>

          <div className="t12-portfolio-tabs">
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`t12-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat); setVisibleLimit(6); }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="t12-project-list">
            {displayedProjects.map((project, idx) => (
              <div
                className="t12-project-card t12-reveal"
                key={project._id || idx}
                ref={addReveal}
                onClick={() => setSelectedProject(project)}
              >
                {project.image ? (
                  <Image src={project.image} alt={project.title} width={900} height={520} style={{ width: '100%', height: 460, objectFit: 'cover' }} />
                ) : (
                  <div className="t12-project-placeholder">{['🚀', '🎨', '📈', '🖋', '⚡'][idx % 5]}</div>
                )}
                <div className="t12-project-meta">
                  <h3>{project.title}</h3>
                  <div className="t12-meta-right">
                    <span>{project.description?.length > 90 ? `${project.description.slice(0, 90)}...` : project.description}</span>
                    <span>{project.year || ""}</span>
                    <span className="t12-tag-pill">{project.category || "Projeto"}</span>
                  </div>
                </div>
              </div>
            ))}
            {displayedProjects.length === 0 && (
              <p style={{ color: 'var(--ink-faint)' }}>Nenhum projeto disponível nesta categoria.</p>
            )}
          </div>

          {hasMoreProjects && (
            <button className="t12-load-more" onClick={() => setVisibleLimit(prev => prev + 6)}>
              Exibir mais projetos
            </button>
          )}
        </section>

        {/* TESTIMONIALS */}
        <section className="t12-testimonials" id="depoimentos">
          <div className="t12-section-top t12-reveal" ref={addReveal}>
            <h2>Depoimentos</h2>
            <p>O que dizem os clientes que já trabalharam comigo.</p>
          </div>
          <div className="t12-testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div className="t12-testimonial-card t12-reveal" key={testimonial._id || idx} ref={addReveal}>
                <div className="t12-testimonial-stars">{"★".repeat(testimonial.stars).padStart(5, "☆")}</div>
                <p className="t12-testimonial-text">&quot;{testimonial.text}&quot;</p>
                <div className="t12-testimonial-author">
                  <div className="t12-author-avatar">
                    {testimonial.image ? (
                      <Image src={testimonial.image} alt={testimonial.name} width={40} height={40} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div>
                    <div className="t12-author-name">{testimonial.name}</div>
                    <div className="t12-author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <p style={{ color: 'var(--ink-faint)' }}>Nenhum depoimento disponível no momento.</p>
            )}
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="t12-contact" id="contato">
          <div className="t12-contact-panel t12-reveal" ref={addReveal}>
            <h2 className="t12-display">Vamos Criar Algo Juntos?</h2>
            <p>
              Seja um site novo, uma campanha de marketing ou uma identidade visual que vai fazer sua marca ser lembrada — estou aqui para transformar sua visão em realidade.
            </p>
            <div className="t12-contact-btns">
              <button className="t12-cta" onClick={() => setIsContactModalOpen(true)}>
                <span>Enviar Mensagem</span>
                <span className="t12-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
              {contact?.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t12-btn-outline"
                >
                  Falar no WhatsApp
                </a>
              )}
            </div>
            <div className="t12-contact-info">
              {contact?.address && (contact.address.street || contact.address.city || contact.address.state) && (
                <div className="t12-contact-info-item">
                  <span>📍</span>
                  <span>{[contact.address.street, contact.address.city, contact.address.state].filter(Boolean).join(", ") || "Remoto"}</span>
                </div>
              )}
              {contact?.availability && (
                <div className="t12-contact-info-item">
                  <span>⏰</span>
                  <span>Disponível {contact.availability}</span>
                </div>
              )}
              {contact?.languages && contact.languages.length > 0 && (
                <div className="t12-contact-info-item">
                  <span>🌐</span>
                  <span>Atendo em {contact.languages.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="t12-footer">
          <div className="t12-footer-row">
            <span>© {new Date().getFullYear()} {fullName}. Todos os direitos reservados.</span>
            <div className="t12-footer-logo">
              <Link href={'/'}>
                <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={60} alterW={90} />
              </Link>
            </div>
            <div className="t12-footer-links">
              <a href="#servicos">Serviços</a>
              <a href="#portfolio">Portfólio</a>
              <a href="#sobre">Sobre</a>
              <a href="#contato">Contato</a>
            </div>
          </div>
        </footer>
      </div>

      {selectedProject && (
        <div className="t12-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="t12-modal-content" onClick={e => e.stopPropagation()}>
            <button className="t12-modal-close" onClick={() => setSelectedProject(null)}>✕</button>
            {selectedProject.image ? (
              <Image src={selectedProject.image} alt={selectedProject.title} className="t12-modal-image" width={900} height={500} />
            ) : (
              <div className="t12-modal-image" style={{ background: 'var(--panel2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                🚀
              </div>
            )}
            <div className="t12-modal-info">
              <h3 className="t12-modal-title">{selectedProject.title}</h3>
              <div className="t12-modal-meta">
                <span>📅 {selectedProject.year || ""}</span>
                <span>📁 {selectedProject.category || "Projeto"}</span>
                <span>🛠️ {selectedProject.tech?.join(', ') || "Tecnologias"}</span>
              </div>
              <div className="t12-modal-desc">{selectedProject.description}</div>
              <div className="t12-modal-footer">
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" className="t12-cta" style={{ textDecoration: 'none' }}>
                    <span>Visualizar Site</span>
                    <span className="t12-circle">→</span>
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" className="t12-btn-outline" style={{ textDecoration: 'none' }}>
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedText && (
        <div className="t12-modal-overlay" onClick={() => setSelectedText(null)}>
          <div className="t12-modal-content" onClick={e => e.stopPropagation()}>
            <button className="t12-modal-close" onClick={() => setSelectedText(null)}>✕</button>
            <div className="t12-modal-info">
              <h3 className="t12-modal-title">{selectedText.title}</h3>
              <div className="t12-modal-desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedText.content) }} />
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
