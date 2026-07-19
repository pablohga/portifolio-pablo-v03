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

/* Decorative scattered squares used on hero & about, like the bold reference art */
function SquareField({ variant = "hero" }: { variant?: "hero" | "about" }) {
  const squares =
    variant === "hero"
      ? [
          { t: "6%", l: "2%", s: 46, o: 0.9 },
          { t: "2%", l: "14%", s: 22, o: 0.5 },
          { t: "18%", l: "4%", s: 18, o: 0.35 },
          { t: "30%", l: "10%", s: 30, o: 0.7 },
          { t: "46%", l: "1%", s: 60, o: 1 },
          { t: "62%", l: "13%", s: 20, o: 0.4 },
          { t: "74%", l: "3%", s: 34, o: 0.6 },
          { t: "88%", l: "16%", s: 16, o: 0.3 },
          { t: "10%", l: "88%", s: 40, o: 0.85 },
          { t: "0%", l: "76%", s: 18, o: 0.4 },
          { t: "26%", l: "92%", s: 24, o: 0.5 },
          { t: "40%", l: "80%", s: 54, o: 1 },
          { t: "58%", l: "94%", s: 16, o: 0.3 },
          { t: "70%", l: "82%", s: 28, o: 0.6 },
          { t: "86%", l: "90%", s: 20, o: 0.4 },
        ]
      : [
          { t: "4%", l: "90%", s: 30, o: 0.6 },
          { t: "20%", l: "78%", s: 16, o: 0.35 },
          { t: "82%", l: "88%", s: 40, o: 0.8 },
          { t: "92%", l: "72%", s: 18, o: 0.4 },
        ];
  return (
    <div className="square-field" aria-hidden="true">
      {squares.map((sq, i) => (
        <span
          key={i}
          className="square-item"
          style={{
            top: sq.t,
            left: sq.l,
            width: sq.s,
            height: sq.s,
            opacity: sq.o,
          }}
        />
      ))}
    </div>
  );
}

export default function Template16({ userId, categories, projects, userImage, userName }: TemplateProps) {

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
  const [visibleLimit, setVisibleLimit] = useState<number>(8);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      document.documentElement.style.setProperty('--bg', '#0a0e13');
      document.documentElement.style.setProperty('--surface', '#0d1218');
      document.documentElement.style.setProperty('--card', '#161c24');
      document.documentElement.style.setProperty('--card2', '#1c232c');
      document.documentElement.style.setProperty('--border', 'rgba(0,230,195,0.16)');
      document.documentElement.style.setProperty('--text-primary', '#f4f9fa');
      document.documentElement.style.setProperty('--text-secondary', 'rgba(200,215,220,0.6)');
      document.documentElement.style.setProperty('--nav-bg', 'rgba(10,14,19,0.9)');
    } else {
      document.documentElement.style.setProperty('--bg', '#f2f6f6');
      document.documentElement.style.setProperty('--surface', '#ffffff');
      document.documentElement.style.setProperty('--card', '#ffffff');
      document.documentElement.style.setProperty('--card2', '#eef3f3');
      document.documentElement.style.setProperty('--border', 'rgba(0,150,135,0.18)');
      document.documentElement.style.setProperty('--text-primary', '#0b1414');
      document.documentElement.style.setProperty('--text-secondary', 'rgba(30,45,45,0.65)');
      document.documentElement.style.setProperty('--nav-bg', 'rgba(242,246,246,0.9)');
    }
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

  const fullName = userName || hero?.title || "Profissional Freelancer";

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
    <div className="template16-wrapper" data-theme={theme}>
      <style dangerouslySetInnerHTML={{
        __html: `

        :root {
          --cyan: #00e6c3;
          --cyan2: #00b39e;
          --cyan-soft: rgba(0,230,195,0.12);
          --cyan-mid: rgba(0,230,195,0.28);
          --dark-bg: #0a0e13;
          --dark-surface: #0d1218;
          --dark-card: #161c24;
          --dark-border: rgba(0,230,195,0.16);
          --light-bg: #f2f6f6;
          --light-surface: #ffffff;
          --light-card: #eef3f3;
          --light-border: rgba(0,150,135,0.18);
          --accent: var(--cyan);
          --amber: #f5c842;
          --font-display: 'Archivo Black', 'Anton', 'Arial Black', sans-serif;
          --font-body: 'Inter', 'DM Sans', sans-serif;
          --radius-sm: 8px;
          --radius-md: 14px;
          --radius-lg: 20px;
          --radius-xl: 26px;
          --shadow-glow: 0 0 40px rgba(0,230,195,0.18);
          --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        [data-theme="dark"] {
          --bg: var(--dark-bg);
          --surface: var(--dark-surface);
          --card: var(--dark-card);
          --border: var(--dark-border);
          --text-primary: #f4f9fa;
          --text-secondary: rgba(200,215,220,0.6);
          --nav-bg: rgba(10,14,19,0.9);
        }

        [data-theme="light"] {
          --bg: var(--light-bg);
          --surface: var(--light-surface);
          --card: var(--light-card);
          --border: var(--light-border);
          --text-primary: #0b1414;
          --text-secondary: rgba(30,45,45,0.65);
          --nav-bg: rgba(242,246,246,0.9);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .template16-wrapper {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--text-primary);
          line-height: 1.6;
          overflow-x: hidden;
          min-height: 100vh;
          transition: background 0.3s, color 0.3s;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--cyan); border-radius: 10px; }

        /* ─── NAV ─── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--nav-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .nav-logo img { height: 34px; width: auto; }

        .nav-links { display: flex; align-items: center; gap: 2.2rem; list-style: none; }

        .nav-links a {
          font-family: var(--font-display);
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-primary);
          text-decoration: none;
          transition: var(--transition);
        }

        .nav-links a:hover { color: var(--cyan); }

        .nav-actions { display: flex; align-items: center; gap: 12px; }

        .btn-theme {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          width: 38px; height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
          font-size: 1rem;
        }

        .btn-theme:hover { border-color: var(--cyan); color: var(--cyan); }

        .btn-hire {
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: var(--cyan);
          color: #06110f;
          border: none;
          padding: 0.65rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: var(--transition);
        }

        .btn-hire:hover { background: #fff; transform: translateY(-1px); }

        .hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .hamburger span { display: block; width: 22px; height: 2px; background: var(--text-primary); border-radius: 2px; }

        /* ─── HERO ─── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          position: relative;
          overflow: hidden;
          padding-top: 68px;
          background: var(--dark-bg);
        }

        .square-field { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .square-item { position: absolute; background: var(--cyan); border-radius: 4px; }

        .hero-content {
          display: flex; flex-direction: column; justify-content: center;
          padding: 3rem 3rem 4rem 5vw;
          position: relative; z-index: 2;
        }

        .hero-name {
          font-family: var(--font-display);
          text-transform: uppercase;
          font-size: clamp(2.6rem, 6.2vw, 5.6rem);
          line-height: 0.98;
          letter-spacing: -0.01em;
          margin-bottom: 1.2rem;
          color: #fff;
        }

        .hero-tagline {
          font-family: var(--font-display);
          text-transform: uppercase;
          font-size: clamp(1rem, 1.7vw, 1.5rem);
          line-height: 1.3;
          margin-bottom: 1.4rem;
          color: #fff;
        }

        .hero-badge-strip {
          display: inline-block;
          background: var(--cyan);
          color: #06110f;
          font-family: var(--font-display);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          padding: 0.6rem 1rem;
          border-radius: 4px;
          margin-bottom: 2rem;
          width: fit-content;
          line-height: 1.4;
        }

        .hero-stats {
          display: flex; gap: 2.5rem;
          margin-bottom: 2rem;
        }

        .stat-item { text-align: left; }

        .stat-number {
          font-family: var(--font-display);
          font-size: 2.2rem;
          color: #fff;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.72rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 6px;
          font-family: var(--font-display);
        }

        .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }

        .btn-primary {
          font-family: var(--font-display);
          font-size: 0.8rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          background: var(--cyan);
          color: #06110f;
          border: none;
          padding: 0.9rem 1.8rem;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: var(--transition);
        }

        .btn-primary:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,230,195,0.3); }

        .btn-secondary {
          font-family: var(--font-display);
          font-size: 0.8rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          background: transparent;
          color: var(--cyan);
          border: 1.5px solid var(--cyan);
          padding: 0.9rem 1.8rem;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: var(--transition);
        }

        .btn-secondary:hover { background: var(--cyan-soft); transform: translateY(-2px); }

        .hero-visual {
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
          padding: 3rem 5vw 4rem 2rem;
        }

        .hero-photo-wrap { position: relative; width: 380px; max-width: 90%; }

        .hero-photo {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          border-radius: var(--radius-lg);
          display: block;
          position: relative; z-index: 2;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), var(--shadow-glow);
          filter: grayscale(0.15);
        }

        .hero-photo-tag2 {
          position: absolute;
          bottom: 18px; left: 50%;
          transform: translateX(-50%);
          background: var(--cyan);
          border-radius: 50px;
          padding: 0.6rem 1.4rem;
          z-index: 3;
        }

        .hero-photo-tag2 span { font-size: 0.78rem; font-weight: 700; color: #06110f; font-family: var(--font-display); }

        /* ─── SECTIONS ─── */
        section { padding: 5rem 5vw; background: var(--bg); position: relative; }

        .section-label {
          font-family: var(--font-display);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 0.75rem;
          text-align: center;
        }

        .section-title {
          font-family: var(--font-display);
          text-transform: uppercase;
          font-size: clamp(1.8rem, 3.6vw, 3rem);
          line-height: 1.08;
          margin-bottom: 1rem;
          text-align: center;
        }

        .section-title em { font-style: normal; color: var(--cyan); }

        .section-desc {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.75;
          margin-bottom: 3rem;
          text-align: center;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ─── SERVICES ─── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .service-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: var(--transition);
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: var(--cyan);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .service-card:hover { border-color: var(--cyan-mid); transform: translateY(-4px); }
        .service-card:hover::before { transform: scaleX(1); }

        .service-icon {
          width: 52px; height: 52px;
          background: var(--cyan);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.2rem;
        }

        .service-title {
          font-family: var(--font-display);
          text-transform: uppercase;
          font-size: 1.05rem;
          margin-bottom: 0.3rem;
        }

        .service-subtitle {
          font-size: 0.78rem;
          color: var(--cyan);
          margin-bottom: 0.8rem;
          font-style: italic;
        }

        .service-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 1.2rem;
        }

        .service-link {
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--cyan);
          text-decoration: none;
        }

        /* ─── SKILLS ─── */
        .skills-section { background: var(--surface); }

        .skills-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: start;
        }

        .skills-stack { display: flex; flex-direction: column; gap: 1.2rem; }

        .skill-bar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }

        .skill-bar-name { font-family: var(--font-display); font-size: 0.85rem; text-transform: uppercase; }

        .skill-bar-pct { font-size: 0.78rem; color: var(--cyan); font-weight: 700; }

        .skill-bar-track { height: 6px; background: var(--border); border-radius: 10px; overflow: hidden; }

        .skill-bar-fill {
          height: 100%;
          background: var(--cyan);
          border-radius: 10px;
          transform-origin: left;
          animation: barGrow 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }

        @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 12px;
        }

        .tool-chip {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0.7rem 0.5rem;
          text-align: center;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition);
        }

        .tool-chip:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-soft); }

        .tool-chip .tool-emoji { display: block; font-size: 1.5rem; margin-bottom: 4px; }

        /* ─── PORTFOLIO ─── */
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.2rem;
          margin-bottom: 4rem;
        }

        .portfolio-grid-filtered { display: flex; flex-wrap: wrap; gap: 1.2rem; margin-bottom: 2rem; }

        .portfolio-grid-filtered .portfolio-card {
          width: calc((100% - 3 * 1.2rem) / 4);
          flex: 0 0 auto;
        }

        .portfolio-card {
          display: flex;
          flex-direction: column;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          transition: var(--transition);
          cursor: pointer;
        }

        .portfolio-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.35); }

        .portfolio-card:nth-child(1) { grid-column: span 8; }
        .portfolio-card:nth-child(2) { grid-column: span 4; }
        .portfolio-card:nth-child(3) { grid-column: span 4; }
        .portfolio-card:nth-child(4) { grid-column: span 4; }
        .portfolio-card:nth-child(5) { grid-column: span 4; }

        .portfolio-thumb { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .portfolio-card:hover .portfolio-thumb { transform: scale(1.04); }

        .portfolio-thumb-placeholder {
          width: 100%; aspect-ratio: 16/9;
          background: linear-gradient(135deg, var(--cyan-soft) 0%, rgba(0,179,158,0.15) 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem;
        }

        .portfolio-info { padding: 1.2rem 1.4rem; display: flex; flex-direction: column; height: 100%; }

        .portfolio-tag {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 6px;
          font-family: var(--font-display);
        }

        .portfolio-title { font-family: var(--font-display); text-transform: uppercase; font-size: 0.95rem; margin-bottom: 4px; }

        .portfolio-year { font-size: 0.75rem; color: var(--text-secondary); margin-top: auto; }

        .portfolio-overlay {
          position: absolute; inset: 0;
          background: rgba(0,230,195,0.1);
          opacity: 0;
          transition: opacity 0.3s;
          display: flex; align-items: center; justify-content: center;
        }

        .portfolio-card:hover .portfolio-overlay { opacity: 1; }

        .overlay-btn {
          background: var(--cyan);
          color: #06110f;
          border: none;
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          font-family: var(--font-display);
          font-size: 0.75rem;
          text-transform: uppercase;
          cursor: pointer;
          transform: translateY(8px);
          transition: transform 0.3s;
        }

        .portfolio-card:hover .overlay-btn { transform: translateY(0); }

        .portfolio-tabs { display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center; flex-wrap: wrap; }

        .portfolio-tab {
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 0.5rem 1.2rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .portfolio-tab.active { background: var(--cyan); color: #06110f; border-color: var(--cyan); }

        .portfolio-load-more {
          display: block;
          margin: 2rem auto 0;
          font-family: var(--font-display);
          font-size: 0.78rem;
          text-transform: uppercase;
          background: var(--cyan);
          color: #06110f;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          cursor: pointer;
          transition: var(--transition);
        }

        .portfolio-load-more:hover { background: #fff; }

        /* ─── PROCESS ─── */
        .process-section { background: var(--surface); }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0;
          position: relative;
        }

        .process-steps::before {
          content: '';
          position: absolute;
          top: 30px; left: 5%; right: 5%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
        }

        .process-step { padding: 2rem 1.5rem; text-align: center; position: relative; }

        .step-number {
          width: 60px; height: 60px;
          border-radius: 12px;
          background: var(--card);
          border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.2rem;
          font-family: var(--font-display);
          font-size: 1.2rem;
          color: var(--cyan);
          transition: var(--transition);
          position: relative; z-index: 1;
        }

        .process-step:hover .step-number { background: var(--cyan); color: #06110f; border-color: var(--cyan); transform: scale(1.08); }

        .step-title { font-family: var(--font-display); text-transform: uppercase; font-size: 0.95rem; margin-bottom: 0.6rem; }

        .step-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

        /* ─── ABOUT ─── */
        .about-section { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; }

        .about-image-wrap { position: relative; border-radius: var(--radius-xl); overflow: hidden; }

        .about-image {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          border-radius: var(--radius-xl);
          display: block;
          position: relative; z-index: 2;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), var(--shadow-glow);
        }

        .about-image-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,230,195,0.15) 0%, transparent 60%);
          border-radius: var(--radius-xl);
        }

        .about-text { font-size: 1rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 1.5rem; }

        .about-highlights { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }

        .highlight-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex; align-items: flex-start; gap: 10px;
        }

        .highlight-icon { font-size: 1.3rem; }
        .highlight-text { font-size: 0.85rem; }
        .highlight-text strong { display: block; font-family: var(--font-display); text-transform: uppercase; font-size: 0.85rem; }
        .highlight-text span { color: var(--text-secondary); font-size: 0.78rem; }

        /* ─── TESTIMONIALS ─── */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .testimonial-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: var(--transition);
        }

        .testimonial-card::after {
          content: '"';
          position: absolute;
          top: -10px; right: 20px;
          font-size: 8rem;
          line-height: 1;
          color: var(--border);
          font-family: Georgia, serif;
        }

        .testimonial-card:hover { border-color: var(--cyan-mid); transform: translateY(-3px); }

        .testimonial-stars { color: var(--cyan); font-size: 0.9rem; margin-bottom: 1rem; }

        .testimonial-text { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.75; margin-bottom: 1.5rem; font-style: italic; }

        .testimonial-author { display: flex; align-items: center; gap: 12px; }

        .author-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: var(--cyan-soft);
          border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          overflow: hidden;
        }

        .author-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .author-name { font-family: var(--font-display); font-size: 0.9rem; text-transform: uppercase; }
        .author-role { font-size: 0.75rem; color: var(--text-secondary); }

        /* ─── CONTACT CTA ─── */
        .contact-section {
          background: var(--dark-surface);
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        [data-theme="light"] .contact-section { background: linear-gradient(135deg, #e6faf6, #f2f6f6); }

        .contact-content { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }

        .contact-title {
          font-family: var(--font-display);
          text-transform: uppercase;
          font-size: clamp(2rem, 4.4vw, 3.4rem);
          line-height: 1.05;
          margin-bottom: 1rem;
        }

        .contact-title em { font-style: normal; color: var(--cyan); }

        .contact-desc { color: var(--text-secondary); margin-bottom: 2.5rem; font-size: 1.05rem; line-height: 1.7; }

        .contact-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        .contact-info { display: flex; gap: 2rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }

        .contact-info-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary); }
        .contact-info-item span:first-child { color: var(--cyan); font-size: 1rem; }

        /* ─── FOOTER ─── */
        footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 2.5rem 5vw;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
        }

        .footer-logo img { height: 32px; width: auto; }
        .footer-text { font-size: 0.78rem; color: var(--text-secondary); text-align: center; }
        .footer-text a { color: var(--cyan); text-decoration: none; }
        .footer-links { display: flex; gap: 1.5rem; list-style: none; }
        .footer-links a { font-size: 0.78rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--cyan); }

        /* ─── PROJECT MODAL ─── */
        .project-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        .project-modal-content {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          max-width: 900px; width: 100%; max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 50px rgba(0,230,195,0.2);
        }

        .project-modal-close {
          position: absolute; top: 20px; right: 20px;
          background: rgba(0,0,0,0.5);
          color: white; border: none;
          width: 36px; height: 36px; border-radius: 50%;
          cursor: pointer; z-index: 10;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }

        .project-modal-close:hover { background: var(--cyan); color: #06110f; }

        .project-modal-image { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        .project-modal-info { padding: 2.5rem; }
        .project-modal-title { font-family: var(--font-display); text-transform: uppercase; font-size: 2rem; margin-bottom: 1rem; }

        .project-modal-meta { display: flex; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); flex-wrap: wrap; }
        .project-modal-meta span { background: var(--card2); padding: 4px 12px; border-radius: 50px; border: 1px solid var(--border); }

        .project-modal-desc { font-size: 1rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 2rem; }
        .project-modal-footer { display: flex; gap: 1rem; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* ─── MOBILE ─── */
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .hero { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .hero-content { padding: 3rem 5vw 3rem; }
          .about-section { grid-template-columns: 1fr; }
          .skills-layout { grid-template-columns: 1fr; gap: 2rem; }
          .portfolio-card:nth-child(n) { grid-column: span 12; }
          .portfolio-grid { grid-template-columns: 1fr; }
          .portfolio-grid-filtered .portfolio-card { width: 100%; }
          .process-steps::before { display: none; }
        }

        @media (max-width: 600px) {
          section { padding: 3.5rem 5vw; }
          .hero-stats { gap: 1.5rem; flex-wrap: wrap; }
          .contact-info { flex-direction: column; align-items: center; gap: 0.8rem; }
          footer { flex-direction: column; text-align: center; }
        }

      ` }}
      />

      {/*  NAV  */}
      <nav>
        <Link href={'/'} className="justify-center">
          <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={80} alterW={120} />
        </Link>
        <ul className="nav-links">
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#portfolio">Portfólio</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        <div className="nav-actions">
          <button className="btn-theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Alternar tema">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a href="#contato" className="btn-hire">Contatar</a>
        </div>
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/*  HERO  */}
      <section className="hero" id="hero">
        <SquareField variant="hero" />
        <div className="hero-content">
          <h1 className="hero-name">{fullName}</h1>
          <p className="hero-tagline" dangerouslySetInnerHTML={{ __html: hero?.title || "Design que impacta.<br/>Desenvolvimento que transforma." }} />
          <div className="hero-badge-strip">
            {hero?.subtitle || "Soluções digitais de alto desempenho. Foco em resultados e crescimento."}
          </div>

          <div className="hero-stats">
            <div className="stat-item"><div className="stat-label"><ProjectsDelivered about={about || undefined} dark={true} /></div></div>
            <div className="stat-item"><div className="stat-label"><SatisfiedClients about={about || undefined} dark={true} /></div></div>
            <div className="stat-item"><div className="stat-label"><ExperienceTime about={about || undefined} dark={true} /></div></div>
          </div>

          <div className="hero-ctas">
            <a href="#portfolio" className="btn-primary">Meus Projetos</a>
            <a href="#contato" className="btn-secondary">Contato Direto</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo-wrap">
            <Image
              src={hero?.backgroundImage || userImage || ''}
              alt={fullName}
              className="hero-photo"
              width={380}
              height={507}
            />
            <div className="hero-photo-tag2">
              <span>⭐ 5.0 · 120+ Avaliações</span>
            </div>
          </div>
        </div>
      </section>

      {/*  SERVICES  */}
      <section id="servicos">
        <div className="section-label">O que eu faço</div>
        <h2 className="section-title">Serviços que <em>Geram Resultados</em></h2>

        <div className="services-grid">
          {about?.features?.map((service, idx) => {
            const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Layout;
            return (
              <div className="service-card" key={idx}>
                <div className="service-icon"><Icon size={28} color="#06110f" /></div>
                <div className="service-title">{service.title}</div>
                <div
                  className="service-desc"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}
                />
                <a href="#contato" className="service-link">Saber Mais →</a>
              </div>
            );
          })}
        </div>
      </section>

      {/*  SKILLS  */}
      <section id="habilidades" className="skills-section">
        <div className="section-label">Habilidades Técnicas</div>
        <h2 className="section-title">Tecnologias & <em>Ferramentas</em></h2>

        <div className="skills-layout">
          <div className="skills-stack">
            {sortedTech.slice(0, 10).map((tech, idx) => (
              <div key={idx}>
                <div className="skill-bar-header">
                  <span className="skill-bar-name">{tech}</span>
                  <span className="skill-bar-pct">{techPercentages[tech]}%</span>
                </div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: `${techPercentages[tech]}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.7" }}>
              Ferramentas que uso no dia a dia para criar soluções digitais de alto impacto:
            </p>
            <div className="tools-grid">
              {sortedTech.map((tech, idx) => (
                <div className="tool-chip" key={idx}>
                  <span className="tool-emoji">{techEmojiMap[tech] || '🛠️'}</span>
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  PROCESS  */}
      <section id="processo" className="process-section">
        <div className="section-label">Como Trabalho</div>
        <h2 className="section-title">Do Briefing ao <em>Resultado Final</em></h2>

        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">01</div>
            <div className="step-title">Descoberta</div>
            <div className="step-desc">Reunião inicial para entender objetivos, público-alvo e expectativas.</div>
          </div>
          <div className="process-step">
            <div className="step-number">02</div>
            <div className="step-title">Estratégia</div>
            <div className="step-desc">Proposta detalhada com cronograma, entregáveis e investimento.</div>
          </div>
          <div className="process-step">
            <div className="step-number">03</div>
            <div className="step-title">Execução</div>
            <div className="step-desc">Comunicação constante com acompanhamento em tempo real.</div>
          </div>
          <div className="process-step">
            <div className="step-number">04</div>
            <div className="step-title">Revisão</div>
            <div className="step-desc">Rodadas de feedback até o resultado superar as expectativas.</div>
          </div>
          <div className="process-step">
            <div className="step-number">05</div>
            <div className="step-title">Entrega</div>
            <div className="step-desc">Entrega completa com documentação e suporte pós-lançamento.</div>
          </div>
        </div>
      </section>

      {/*  PORTFOLIO  */}
      <section id="portfolio">
        <div className="section-label">Trabalhos Recentes</div>
        <h2 className="section-title">Portfólio <em>Selecionado</em></h2>

        <div className="portfolio-grid">
          {featuredProjects.map((project, idx) => (
            <div className="portfolio-card" key={project._id || idx}>
              {project.image ? (
                <Image src={project.image} alt={project.title} className="portfolio-thumb" width={500} height={300} />
              ) : (
                <div className="portfolio-thumb-placeholder">{['🚀', '🎨', '📈', '🖋', '⚡'][idx % 5]}</div>
              )}
              <div className="portfolio-info">
                <div className="portfolio-tag">{project.category || "Projeto"}</div>
                <div className="portfolio-title">{project.title}</div>
                <div className="portfolio-year">{project.year || ""} · {project.tech?.join(' · ') || "Tecnologias"}</div>
              </div>
              <div className="portfolio-overlay">
                <button className="overlay-btn" onClick={() => setSelectedProject(project)}>Ver Projeto →</button>
              </div>
            </div>
          ))}
        </div>

        <div className="portfolio-tabs">
          {allCategories.map(cat => (
            <button
              key={cat}
              className={`portfolio-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => { setActiveCategory(cat); setVisibleLimit(8); }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="portfolio-grid-filtered">
          {displayedCategoryProjects.map((project, idx) => (
            <div className="portfolio-card" key={project._id || idx}>
              {project.image ? (
                <Image src={project.image} alt={project.title} className="portfolio-thumb" width={500} height={300} />
              ) : (
                <div className="portfolio-thumb-placeholder">{['🚀', '🎨', '📈', '🖋', '⚡'][idx % 5]}</div>
              )}
              <div className="portfolio-info">
                <div className="portfolio-tag">{project.category || "Projeto"}</div>
                <div className="portfolio-title">{project.title}</div>
                <div className="portfolio-year">{project.year || ""} · {project.tech?.join(' · ') || "Tecnologias"}</div>
              </div>
              <div className="portfolio-overlay">
                <button className="overlay-btn" onClick={() => setSelectedProject(project)}>Ver Projeto →</button>
              </div>
            </div>
          ))}
        </div>

        {hasMoreProjects && (
          <button className="portfolio-load-more" onClick={() => setVisibleLimit(prev => prev + 8)}>
            Exibir mais projetos
          </button>
        )}
      </section>

      {/*  ABOUT  */}
      <section id="sobre">
        <SquareField variant="about" />
        <div className="about-section">
          <div className="about-image-wrap">
            <Image
              src={userImage || hero?.backgroundImage || ""}
              alt={fullName}
              className="about-image"
              width={600}
              height={800}
            />
            <div className="about-image-overlay"></div>
          </div>
          <div className="about-content">
            <div className="section-label" style={{ textAlign: "left" }}>Sobre Mim</div>
            <h2 className="section-title" style={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: about?.title || "Sobre Mim" }} />
            <ExpandableText
              text={about?.description || ""}
              title="Sobre Mim"
              className="about-text"
            />
            <div className="about-highlights">
              {about?.features?.map((feature, idx) => {
                const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.Info;
                return (
                  <div className="highlight-item" key={idx}>
                    <div className="highlight-icon"><Icon size={22} color="var(--cyan)" /></div>
                    <div className="highlight-text">
                      <strong>{feature.title}</strong>
                      <ExpandableText
                        text={feature.description}
                        title={feature.title}
                        className="text-secondary-small"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <a href="#contato" className="btn-primary">Vamos Conversar</a>
          </div>
        </div>
      </section>

      {/*  TESTIMONIALS  */}
      <section id="depoimentos" style={{ background: "var(--surface)" }}>
        <div className="section-label">Depoimentos</div>
        <h2 className="section-title">O que Meus <em>Clientes Dizem</em></h2>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div className="testimonial-card" key={testimonial._id || idx}>
              <div className="testimonial-stars">{"★".repeat(testimonial.stars).padStart(5, "☆")}</div>
              <p className="testimonial-text">&quot;{testimonial.text}&quot;</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.image ? (
                    <Image src={testimonial.image} alt={testimonial.name} width={42} height={42} />
                  ) : (
                    <span style={{ fontSize: '1.1rem' }}>👤</span>
                  )}
                </div>
                <div>
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full py-8">
              Nenhum depoimento disponível no momento.
            </p>
          )}
        </div>
      </section>

      {/*  CONTACT CTA  */}
      <section id="contato" className="contact-section">
        <div className="contact-content">
          <div className="section-label">Vamos Trabalhar Juntos</div>
          <h2 className="contact-title">Pronto para <em>Elevar</em> seu Negócio?</h2>
          <p className="contact-desc">
            Design é atitude. Nossas escolhas são fortes, nossos resultados são reais. Vamos construir algo que dure.
          </p>
          <div className="contact-btns">
            <button onClick={() => setIsContactModalOpen(true)} className="btn-primary">✉ Enviar Mensagem</button>
            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                📱 WhatsApp
              </a>
            )}
          </div>
          <div className="contact-info">
            {contact?.address && (contact.address.street || contact.address.city || contact.address.state) && (
              <div className="contact-info-item">
                <span>📍</span>
                <span>{[contact.address.street, contact.address.city, contact.address.state].filter(Boolean).join(", ") || "Remoto"}</span>
              </div>
            )}
            {contact?.availability && (
              <div className="contact-info-item">
                <span>⏰ Disponível </span>
                <span>{contact.availability}</span>
              </div>
            )}
            {contact?.languages && contact.languages.length > 0 && (
              <div className="contact-info-item">
                <span>🌐</span>
                <span>Atendo em {contact.languages.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/*  FOOTER  */}
      <footer>
        <div className="footer-logo">
          <Link href={'/'} className="justify-center">
            <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={80} alterW={120} />
          </Link>
        </div>
        <p className="footer-text">
          Portfólio criado com <a href="https://portify.art" target="_blank">Portify</a> · O portfólio profissional para freelancers
        </p>
        <ul className="footer-links">
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#portfolio">Portfólio</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </footer>

      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal-content" onClick={e => e.stopPropagation()}>
            <button className="project-modal-close" onClick={() => setSelectedProject(null)}>✕</button>
            {selectedProject.image ? (
              <Image src={selectedProject.image} alt={selectedProject.title} className="project-modal-image" width={900} height={500} />
            ) : (
              <div className="project-modal-image" style={{ background: 'var(--card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                🚀
              </div>
            )}
            <div className="project-modal-info">
              <h3 className="project-modal-title">{selectedProject.title}</h3>
              <div className="project-modal-meta">
                <span>📅 {selectedProject.year || ""}</span>
                <span>📁 {selectedProject.category || "Projeto"}</span>
                <span>🛠️ {selectedProject.tech?.join(', ') || "Tecnologias"}</span>
              </div>
              <div className="project-modal-desc">{selectedProject.description}</div>
              <div className="project-modal-footer">
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" className="btn-primary" style={{ textDecoration: 'none' }}>Visualizar Site →</a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" className="btn-secondary" style={{ textDecoration: 'none' }}>GitHub ↗</a>
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
