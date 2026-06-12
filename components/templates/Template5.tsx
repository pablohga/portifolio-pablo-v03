"use client";

import React, { useEffect, useState, useCallback } from "react";
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

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
  userImage?: string;
  userName?: string;
}

export default function Template5({ userId, categories, projects, userImage, userName }: TemplateProps) {

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
      document.documentElement.style.setProperty('--bg', '#050c0f');
      document.documentElement.style.setProperty('--bg2', '#081318');
      document.documentElement.style.setProperty('--bg3', '#0c1c24');
      document.documentElement.style.setProperty('--card', '#0f2028');
      document.documentElement.style.setProperty('--card2', '#122530');
      document.documentElement.style.setProperty('--teal', '#00d4c0');
      document.documentElement.style.setProperty('--teal2', '#00b8a6');
      document.documentElement.style.setProperty('--teal-dim', 'rgba(0,212,192,.12)');
      document.documentElement.style.setProperty('--teal-glow', 'rgba(0,212,192,.25)');
      document.documentElement.style.setProperty('--green', '#1de080');
      document.documentElement.style.setProperty('--amber', '#f5c842');
      document.documentElement.style.setProperty('--text', '#e8f0f0');
      document.documentElement.style.setProperty('--muted', '#7a9fa8');
      document.documentElement.style.setProperty('--border', 'rgba(0,212,192,.18)');
      document.documentElement.style.setProperty('--r', '12px');
      document.documentElement.style.setProperty('--r2', '20px');
    } else {
      document.documentElement.style.setProperty('--bg', '#ffffff');
      document.documentElement.style.setProperty('--bg2', '#f8f9fa');
      document.documentElement.style.setProperty('--bg3', '#e9ecef');
      document.documentElement.style.setProperty('--card', '#ffffff');
      document.documentElement.style.setProperty('--card2', '#f8f9fa');
      document.documentElement.style.setProperty('--teal', '#00d4c0');
      document.documentElement.style.setProperty('--teal2', '#00b8a6');
      document.documentElement.style.setProperty('--teal-dim', 'rgba(0,212,192,.12)');
      document.documentElement.style.setProperty('--teal-glow', 'rgba(0,212,192,.25)');
      document.documentElement.style.setProperty('--green', '#1de080');
      document.documentElement.style.setProperty('--amber', '#f5c842');
      document.documentElement.style.setProperty('--text', '#212529');
      document.documentElement.style.setProperty('--muted', '#6c757d');
      document.documentElement.style.setProperty('--border', 'rgba(0,212,192,.18)');
      document.documentElement.style.setProperty('--r', '12px');
      document.documentElement.style.setProperty('--r2', '20px');
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

  console.log("Current About State:", about);
  return (
    <div className="template-converted-wrapper" data-theme={theme}>
      <style dangerouslySetInnerHTML={{
          __html:`

        :root {
          --cyan: #00d4e8;
          --cyan-soft: rgba(0,212,232,0.12);
          --cyan-mid: rgba(0,212,232,0.25);
          --dark-bg: #090e1a;
          --dark-surface: #0f1726;
          --dark-card: #141e30;
          --dark-border: rgba(255,255,255,0.07);
          --light-bg: #f5f2ec;
          --light-surface: #ffffff;
          --light-card: #f0ede6;
          --light-border: rgba(0,0,0,0.08);
          --text-primary-dark: #f0f4ff;
          --text-secondary-dark: rgba(200,210,240,0.65);
          --text-primary-light: #111827;
          --text-secondary-light: rgba(60,70,90,0.7);
          --accent: #00d4e8;
          --accent2: #7c6ef2;
          --success: #22d3a0;
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --radius-sm: 8px;
          --radius-md: 14px;
          --radius-lg: 22px;
          --radius-xl: 32px;
          --shadow-glow: 0 0 40px rgba(0,212,232,0.15);
          --transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        [data-theme="dark"] {
          --bg: var(--dark-bg);
          --surface: var(--dark-surface);
          --card: var(--dark-card);
          --border: var(--dark-border);
          --text-primary: var(--text-primary-dark);
          --text-secondary: var(--text-secondary-dark);
          --nav-bg: rgba(9,14,26,0.92);
          --logo-src: url("https://agenciaaimagic.com.br/portify/logo_nova_txt_m_dark.png");
          --hero-img: url("https://agenciaaimagic.com.br/portify/hero_img_dark.png");
        }

        [data-theme="light"] {
          --bg: var(--light-bg);
          --surface: var(--light-surface);
          --card: var(--light-card);
          --border: var(--light-border);
          --text-primary: var(--text-primary-light);
          --text-secondary: var(--text-secondary-light);
          --nav-bg: rgba(245,242,236,0.92);
          --logo-src: url("https://agenciaaimagic.com.br/portify/logo_nova_txt_g_light.png");
          --hero-img: url("https://agenciaaimagic.com.br/portify/hero_img_light.png");
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        /* ─── GLOBAL ─── */
        .template-converted-wrapper {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--text-primary);
          line-height: 1.6;
          transition: background 0.4s, color 0.4s;
          overflow-x: hidden;
          min-height: 100vh;
        }


        /* ─── SCROLLBAR ─── */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }

        /* ─── NAV ─── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          transition: var(--transition);
        }

        .nav-logo img { height: 36px; width: auto; }

        .nav-links {
          display: flex; align-items: center; gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition);
        }

        .nav-links a:hover { color: var(--accent); }

        .nav-actions { display: flex; align-items: center; gap: 12px; }

        .btn-theme {
          background: var(--border);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          width: 38px; height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
          font-size: 1rem;
        }

        .btn-theme:hover { border-color: var(--accent); color: var(--accent); }

        .btn-hire {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--accent);
          color: #050a14;
          border: none;
          padding: 0.55rem 1.4rem;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: var(--transition);
          display: inline-flex; align-items: center; gap: 6px;
        }

        .btn-hire:hover {
          background: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,212,232,0.3);
        }

        /* ─── HAMBURGER ─── */
        .hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: var(--transition);
        }

        /* ─── HERO ─── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
          padding-top: 64px;
          background: var(--bg);
        }


        .hero-bg {
          position: absolute; inset: 0;
          background-image: var(--hero-img);
          background-size: cover;
          background-position: right center;
          opacity: 0.18;
          pointer-events: none;
        }

        [data-theme="light"] .hero-bg { opacity: 0.28; }

        .hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,232,0.12) 0%, transparent 70%);
          top: -100px; left: -100px;
          pointer-events: none;
          animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        .hero-content {
          display: flex; flex-direction: column; justify-content: center;
          padding: 6rem 3rem 4rem 5vw;
          position: relative; z-index: 2;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--cyan-soft);
          border: 1px solid rgba(0,212,232,0.3);
          color: var(--accent);
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          width: fit-content;
          margin-bottom: 1.8rem;
          animation: fadeSlideUp 0.6s ease both;
        }

        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent);
          animation: blink 1.4s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .hero-name {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 5vw, 5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
          animation: fadeSlideUp 0.7s 0.1s ease both;
        }

        .hero-name span { color: var(--accent); }

        .hero-role {
          font-size: 1.05rem;
          color: var(--text-secondary);
          margin-bottom: 1.8rem;
          font-weight: 300;
          animation: fadeSlideUp 0.7s 0.2s ease both;
        }

        .hero-role strong {
          color: var(--text-primary);
          font-weight: 500;
        }

        .hero-bio {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 480px;
          line-height: 1.75;
          margin-bottom: 2.5rem;
          animation: fadeSlideUp 0.7s 0.3s ease both;
        }

        .hero-stats {
          display: flex; gap: 2.5rem;
          margin-bottom: 2.5rem;
          animation: fadeSlideUp 0.7s 0.4s ease both;
        }

        .stat-item { text-align: left; }

        .stat-number {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }

        .hero-ctas {
          display: flex; gap: 12px; flex-wrap: wrap;
          animation: fadeSlideUp 0.7s 0.5s ease both;
        }

        .btn-primary {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--accent);
          color: #050a14;
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: var(--transition);
        }

        .btn-primary:hover {
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,212,232,0.35);
        }

        .btn-secondary {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: transparent;
          color: var(--text-primary);
          border: 1.5px solid var(--border);
          padding: 0.85rem 2rem;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: var(--transition);
        }

        .btn-secondary:hover {
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-2px);
        }

        .hero-visual {
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
          padding: 6rem 5vw 4rem 2rem;
        }

        .hero-photo-wrap {
          position: relative;
          width: 380px;
          max-width: 90%;
        }

        .hero-photo-ring {
          position: absolute;
          inset: -12px;
          border-radius: var(--radius-xl);
          border: 1.5px solid rgba(0,212,232,0.25);
          animation: ringRotate 8s linear infinite;
        }

        .hero-photo-ring::before {
          content: '';
          position: absolute;
          top: -4px; left: 30%;
          width: 40px; height: 8px;
          background: var(--accent);
          border-radius: 4px;
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-photo {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          border-radius: var(--radius-xl);
          display: block;
          position: relative; z-index: 2;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), var(--shadow-glow);
        }

        .hero-photo-tag {
          position: absolute;
          bottom: -18px; left: -24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0.8rem 1.2rem;
          display: flex; align-items: center; gap: 10px;
          backdrop-filter: blur(12px);
          z-index: 3;
          animation: float 3s ease-in-out infinite;
        }

        .tag-icon {
          width: 36px; height: 36px;
          background: var(--cyan-soft);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
        }

        .tag-text { font-size: 0.8rem; }
        .tag-text strong { display: block; font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; }
        .tag-text span { color: var(--text-secondary); font-size: 0.72rem; }

        .hero-photo-tag2 {
          position: absolute;
          top: 20px; right: -28px;
          background: var(--accent);
          border-radius: var(--radius-md);
          padding: 0.7rem 1rem;
          display: flex; align-items: center; gap: 8px;
          z-index: 3;
          animation: float 3.5s ease-in-out infinite reverse;
        }

        .hero-photo-tag2 span { font-size: 0.78rem; font-weight: 700; color: #050a14; font-family: var(--font-display); }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── SOCIAL STRIP ─── */
        .social-strip {
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 1rem 5vw;
          display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
          flex-wrap: wrap;
        }

        .social-links { display: flex; gap: 12px; }

        .social-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 1rem;
          transition: var(--transition);
          cursor: pointer;
        }

        .social-btn:hover { border-color: var(--accent); color: var(--accent); }

        .availability-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(34,211,160,0.1);
          border: 1px solid rgba(34,211,160,0.3);
          border-radius: 50px;
          padding: 0.4rem 1rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--success);
          font-family: var(--font-display);
          letter-spacing: 0.04em;
        }

        .avail-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--success);
          animation: blink 1.2s infinite;
        }

        /* ─── SECTIONS ─── */
        section { padding: 5rem 5vw; background: var(--bg); }

        .section-label {
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.75rem;
          text-align: center;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1rem;
          text-align: center;
        }

        .section-title em { font-style: normal; color: var(--accent); }

        .section-desc {
          color: var(--text-secondary);
          /* max-width: 560px; */
          font-size: 1rem;
          line-height: 1.75;
          margin-bottom: 3rem;
          text-align: center;
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
          cursor: default;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .service-card:hover {
          border-color: rgba(0,212,232,0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.2);
        }

        .service-card:hover::before { transform: scaleX(1); }

        .service-icon {
          width: 52px; height: 52px;
          background: var(--cyan-soft);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem;
          margin-bottom: 1.2rem;
        }

        .service-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.6rem;
        }

        .service-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 1.2rem;
        }

        .service-price {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--accent);
        }

        .service-price span {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--text-secondary);
        }

        /* ─── SKILLS ─── */
        .skills-section {
          background: var(--surface);
        }

        .skills-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: start;
        }

        .skills-stack { display: flex; flex-direction: column; gap: 1.2rem; }

        .skill-bar-item {}

        .skill-bar-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }

        .skill-bar-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.88rem;
        }

        .skill-bar-pct {
          font-size: 0.78rem;
          color: var(--accent);
          font-weight: 700;
        }

        .skill-bar-track {
          height: 5px;
          background: var(--border);
          border-radius: 10px;
          overflow: hidden;
        }

        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          border-radius: 10px;
          transform-origin: left;
          animation: barGrow 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }

        @keyframes barGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

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
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition);
          cursor: default;
        }

        .tool-chip:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--cyan-soft);
        }

        .tool-chip .tool-emoji { display: block; font-size: 1.5rem; margin-bottom: 4px; }

        /* ─── PORTFOLIO ─── */
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.2rem;
          margin-bottom: 4rem;
        }

        .portfolio-grid-filtered {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          margin-bottom: 2rem;
        }

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

        .portfolio-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.25); }

        .portfolio-card:nth-child(1) { grid-column: span 8; }
        .portfolio-card:nth-child(2) { grid-column: span 4; }
        .portfolio-card:nth-child(3) { grid-column: span 4; }
        .portfolio-card:nth-child(4) { grid-column: span 4; }
        .portfolio-card:nth-child(5) { grid-column: span 4; }

        .portfolio-thumb {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .portfolio-card:hover .portfolio-thumb { transform: scale(1.04); }

        .portfolio-thumb-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, var(--cyan-soft) 0%, rgba(124,110,242,0.15) 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem;
        }

        .portfolio-info {
          padding: 1.2rem 1.4rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .portfolio-tag {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 6px;
          font-family: var(--font-display);
        }

        .portfolio-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .portfolio-year {
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-top: auto;
        }

        .portfolio-overlay {
          position: absolute; inset: 0;
          background: rgba(0,212,232,0.08);
          opacity: 0;
          transition: opacity 0.3s;
          display: flex; align-items: center; justify-content: center;
        }

        .portfolio-card:hover .portfolio-overlay { opacity: 1; }

        .overlay-btn {
          background: var(--accent);
          color: #050a14;
          border: none;
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transform: translateY(8px);
          transition: transform 0.3s;
        }

        .portfolio-card:hover .overlay-btn { transform: translateY(0); }

        .portfolio-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

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

        .portfolio-tab.active {
          background: var(--accent);
          color: #050a14;
          border-color: var(--accent);
        }

        .portfolio-load-more {
          display: block;
          margin: 2rem auto 0;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--accent);
          color: #050a14;
          border: none;
          padding: 0.55rem 1.4rem;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: var(--transition);
          display: inline-flex; align-items: center; gap: 6px;
        }

        .portfolio-load-more:hover {
          background: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,212,232,0.3);
        }


        /* ─── PROCESS ─── */
        .process-section { background: var(--surface); }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0;
          position: relative;
        }

        .process-steps::before {
          content: '';
          position: absolute;
          top: 30px; left: 5%; right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          pointer-events: none;
        }

        .process-step {
          padding: 2rem 1.5rem;
          text-align: center;
          position: relative;
        }

        .step-number {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: var(--card);
          border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.2rem;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--accent);
          transition: var(--transition);
          position: relative; z-index: 1;
        }

        .process-step:hover .step-number {
          background: var(--accent);
          color: #050a14;
          border-color: var(--accent);
          transform: scale(1.1);
        }

        .step-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.6rem;
        }

        .step-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

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
          pointer-events: none;
        }

        .testimonial-card:hover { border-color: rgba(0,212,232,0.25); transform: translateY(-3px); }

        .testimonial-stars { color: #fbbf24; font-size: 0.9rem; margin-bottom: 1rem; }

        .testimonial-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.75;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

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

        .author-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .author-role { font-size: 0.75rem; color: var(--text-secondary); }

        /* ─── BANNER ─── */
        .about-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

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
          background: linear-gradient(135deg, rgba(0,212,232,0.15) 0%, transparent 60%);
          border-radius: var(--radius-xl);
        }

        .about-content {}

        .about-text {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .about-highlights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .highlight-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex; align-items: flex-start; gap: 10px;
        }

        .highlight-icon { font-size: 1.3rem; }

        .highlight-text { font-size: 0.85rem; }
        .highlight-text strong { display: block; font-weight: 700; font-family: var(--font-display); font-size: 0.88rem; }
        .highlight-text span { color: var(--text-secondary); font-size: 0.78rem; }

        /* ─── CONTACT CTA ─── */
        .contact-section {
          background: linear-gradient(135deg, var(--dark-surface), var(--dark-bg));
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        [data-theme="light"] .contact-section {
          background: linear-gradient(135deg, #e8f4f7, #f5f2ec);
        }

        .contact-section::before {
          content: '';
          position: absolute;
          width: 800px; height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,232,0.08) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .contact-content { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }

        .contact-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .contact-title em { font-style: normal; color: var(--accent); }

        .contact-desc {
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .contact-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        .contact-info {
          display: flex; gap: 2rem; justify-content: center;
          margin-top: 2rem; flex-wrap: wrap;
        }

        .contact-info-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .contact-info-item span:first-child { color: var(--accent); font-size: 1rem; }

        /* ─── FOOTER ─── */
        footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 2.5rem 5vw;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
        }

        .footer-logo img { height: 32px; width: auto; }

        .footer-text {
          font-size: 0.78rem;
          color: var(--text-secondary);
          text-align: center;
        }

        .footer-text a { color: var(--accent); text-decoration: none; }

        .footer-links {
          display: flex; gap: 1.5rem; list-style: none;
        }

        .footer-links a {
          font-size: 0.78rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover { color: var(--accent); }

        /* ─── PROJECT MODAL ─── */
        .project-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        .project-modal-content {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 50px rgba(0,212,232,0.2);
        }

        .project-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .project-modal-close:hover { background: var(--accent); color: #050a14; }

        .project-modal-image {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
        }

        .project-modal-info {
          padding: 2.5rem;
        }

        .project-modal-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text);
        }

        .project-modal-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .project-modal-meta span {
          background: var(--bg3);
          padding: 4px 12px;
          border-radius: 50px;
          border: 1px solid var(--border);
        }

        .project-modal-desc {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .project-modal-footer {
          display: flex;
          gap: 1rem;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* ─── MOBILE ─── */
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }


          .hero { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .hero-content { padding: 5rem 5vw 4rem; }

          .about-section { grid-template-columns: 1fr; }
          .skills-layout { grid-template-columns: 1fr; gap: 2rem; }

          .portfolio-card:nth-child(n) { grid-column: span 12; }
          .portfolio-grid { grid-template-columns: 1fr; }

          .process-steps::before { display: none; }
        }

        @media (max-width: 600px) {
          section { padding: 3.5rem 5vw; }
          .hero-stats { gap: 1.5rem; }
          .contact-info { flex-direction: column; align-items: center; gap: 0.8rem; }
          footer { flex-direction: column; text-align: center; }
        }

      ` }}
      />



    {/*  NAV  */}
    <nav>
      <Link href={'/'} className="justify-center">
        <Logo
        alterIcon="https://agenciaaimagic.com.br/portify/logo_nova_txt_g_dark.png"
        alterH={80}
        alterW={120}/>
      </Link>
      <ul className="nav-links">
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#portfolio">Portfólio</a></li>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
      <div className="nav-actions">
        <button className="btn-theme" id="themeToggle" title="Alternar tema" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <a href="#contato" className="btn-hire">✦ Contratar</a>
      </div>
      <button className="hamburger" id="hamburger">
        <span></span><span></span><span></span>
      </button>
    </nav>

    {/*  HERO  */}
    <section className="hero" id="hero">
      <div className="hero-bg"></div>
      <div className="hero-glow"></div>

      <div className="hero-content">
        <h1 className="hero-name">
          <span>{fullName}</span>
        </h1>
        <p className="hero-role">Freelancer Criativo & <strong>Especialista Digital</strong></p>
        <p className="hero-bio">
          Transformo ideias em experiências digitais que geram resultados.
          Com mais de 7 anos de experiência, ajudo empresas a crescer online
          através de design estratégico, código limpo e marketing orientado a dados.
        </p>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-label">
              <ProjectsDelivered about={about || undefined} dark={true} />
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">
              <SatisfiedClients about={about || undefined} dark={true} />
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">
              <ExperienceTime about={about || undefined} dark={true} />
            </div>
            {/* <div className="stat-label">De Experiência</div> */}
          </div>
        </div>

        <div className="hero-ctas">
          <a href="#portfolio" className="btn-primary">▶ Ver Projetos</a>
          <a href="#contato" className="btn-secondary">↗ Fale Comigo</a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-photo-wrap">
          <div className="hero-photo-ring"></div>
          <img
            src={ hero?.backgroundImage ||userImage }
            alt={fullName}
            className="hero-photo"
          />
          <div className="hero-photo-tag">
            <div className="tag-icon">⚡</div>
            <div className="tag-text">
              <strong>Disponível</strong>
              <span>Para novos projetos</span>
            </div>
          </div>
          <div className="hero-photo-tag2">
            <span>⭐ 5.0 · 120+ Reviews</span>
          </div>
        </div>
      </div>
    </section>

    {/*  SOCIAL STRIP  */}
    <div className="social-strip">
      <div className="social-links">
        <a href="#" className="social-btn" title="LinkedIn">in</a>
        <a href="#" className="social-btn" title="Behance">Be</a>
        <a href="#" className="social-btn" title="GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <a href="#" className="social-btn" title="Instagram">✦</a>
        <a href="#" className="social-btn" title="WhatsApp">✉</a>
      </div>
      <div className="availability-pill">
        <div className="avail-dot"></div>
        Disponível para projetos em Junho 2025
      </div>
    </div>

    {/*  SERVICES  */}
    <section id="servicos">
      <div className="section-label">O que eu faço</div>
      <h2 className="section-title">Serviços que <em>Geram Resultado</em></h2>
      <p className="section-desc">Cada projeto é tratado com atenção aos detalhes e foco em resultados reais. Combino criatividade com estratégia para entregar soluções que funcionam de verdade.</p>

      <div className="services-grid">
        {about?.features?.map((service, idx) => {
          const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Layout;
          return (
            <div className="service-card" key={idx}>
              <div className="service-icon">
                <Icon size={28} color="var(--accent)" />
              </div>
              <div className="service-title">{service.title}</div>
              <div
                className="service-desc"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}
              />
              <div className="service-price">Sob consulta</div>
            </div>
          );
        })}
      </div>
    </section>

    {/*  SKILLS  */}
    <section id="habilidades" className="skills-section">
      <div className="section-label">Habilidades Técnicas</div>
      <h2 className="section-title">Ferramentas & <em>Tecnologias</em></h2>

      <div className="skills-layout">
        <div>
          <div className="skills-stack">
            {sortedTech.slice(0, 10).map((tech, idx) => (
              <div className="skill-bar-item" key={idx}>
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
        </div>

        <div>
          <p style={{
            fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.7"
          }}>
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

    {/*  PORTFOLIO  */}
    <section id="portfolio">
      <div className="section-label">Trabalhos Recentes</div>
      <h2 className="section-title">Portfólio <em>Selecionado</em></h2>
      <p className="section-desc">Uma seleção dos projetos que mais me orgulho. Cada entrega com foco em resultado e atenção aos detalhes.</p>

      <div className="portfolio-grid">
        {featuredProjects.map((project, idx) => (
          <div className="portfolio-card" key={project._id || idx}>
            {project.image ? (
              <Image src={project.image} alt={project.title} className="portfolio-thumb" width={500} height={300} />
            ) : (
              <div className="portfolio-thumb-placeholder">
                {['🚀', '🎨', '📈', '🖋', '⚡'][idx % 5]}
              </div>
            )}
            <div className="portfolio-info">
              <div className="portfolio-tag">{project.category || "Projeto"}</div>
              <div className="portfolio-title">{project.title}</div>
              <div className="project-modal-desc">
                {project.description?.length > 150
                  ? `${project.description.slice(0, 150)}...`
                  : project.description}
              </div>
              <div className="portfolio-year">
                {project.year || "Technologies: "} · {project.tech?.join(' · ') || "Tecnologias"}
              </div>
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
            onClick={() => {
              setActiveCategory(cat);
              setVisibleLimit(8);
            }}
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
              <div className="portfolio-thumb-placeholder">
                {['🚀', '🎨', '📈', '🖋', '⚡'][idx % 5]}
              </div>
            )}
            <div className="portfolio-info">
              <div className="portfolio-tag">{project.category || "Projeto"}</div>
              <div className="portfolio-title">{project.title}</div>
              <div className="portfolio-year">
                {project.year || ""} · {project.tech?.join(' · ') || "Tecnologias"}
              </div>
            </div>
            <div className="portfolio-overlay">
              <button className="overlay-btn" onClick={() => setSelectedProject(project)}>Ver Projeto →</button>
            </div>
          </div>
        ))}
      </div>

      {hasMoreProjects && (
        <button
          className="portfolio-load-more"
          onClick={() => setVisibleLimit(prev => prev + 8)}
        >
          Exibir mais projetos
        </button>
        
      )}
    </section>

    {/*  PROCESS  */}
    <section id="processo" className="process-section">
      <div className="section-label">Como Trabalho</div>
      <h2 className="section-title" style={{textAlign:"center"}}>Do Briefing ao <em>Resultado Final</em></h2>
      <p className="section-desc" style={{textAlign:"center", margin:"0"}}>Um processo claro e transparente para que você saiba exatamente o que esperar em cada etapa do projeto.</p>

      <div className="process-steps">
        <div className="process-step">
          <div className="step-number">01</div>
          <div className="step-title">Briefing & Descoberta</div>
          <div className="step-desc">Reunião inicial para entender seus objetivos, público-alvo e expectativas. Alinhamos visão e definimos o escopo.</div>
        </div>
        <div className="process-step">
          <div className="step-number">02</div>
          <div className="step-title">Proposta & Estratégia</div>
          <div className="step-desc">Elaboro uma proposta detalhada com cronograma, entregáveis e investimento. Tudo muito transparente.</div>
        </div>
        <div className="process-step">
          <div className="step-number">03</div>
          <div className="step-title">Execução & Updates</div>
          <div className="step-desc">Trabalho com comunicação constante. Você acompanha o progresso em tempo real e tem acesso direto a mim.</div>
        </div>
        <div className="process-step">
          <div className="step-number">04</div>
          <div className="step-title">Revisão & Aprovação</div>
          <div className="step-desc">Rodadas de feedback para garantir que o resultado final supere suas expectativas antes da entrega.</div>
        </div>
        <div className="process-step">
          <div className="step-number">05</div>
          <div className="step-title">Entrega & Suporte</div>
          <div className="step-desc">Entrega completa com documentação e suporte pós-lançamento. Seu projeto fica em boas mãos a longo prazo.</div>
        </div>
      </div>
    </section>

    {/*  ABOUT  */}
    <section id="sobre">
      <div className="about-section">
        <div className="about-image-wrap">
          {/* <img
            src={ hero?.backgroundImage ||userImage }
            alt={fullName}
            className="hero-photo"
          /> */}
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
          <div className="section-label">Sobre mim</div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: about?.title || "Sobre Mim" }} />
          <div
            className="about-text"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about?.description || "") }}
          />
          <div className="about-highlights">
            {about?.features?.map((feature, idx) => {
              const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.Info;
              return (
                <div className="highlight-item" key={idx}>
                  <div className="highlight-icon">
                    <Icon size={24} color="var(--accent)" />
                  </div>
                  <div className="highlight-text">
                    <strong>{feature.title}</strong>
                    <div
                      className="text-primary"
                      style={{ fontSize: '0.78rem' }}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feature.description) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <a href="#contato" className="btn-primary">✦ Vamos conversar</a>
        </div>
      </div>
    </section>

    {/*  TESTIMONIALS  */}
    <section id="depoimentos" style={{background:"var(--surface)"}}>
      <div className="section-label">Depoimentos</div>
      <h2 className="section-title">O que meus <em>Clientes Dizem</em></h2>

      <div className="testimonials-grid">
        {testimonials.map((testimonial, idx) => (
          <div className="testimonial-card" key={testimonial._id || idx}>
            <div className="testimonial-stars">
              {"★".repeat(testimonial.stars).padStart(5, "☆")}
            </div>
            <p className="testimonial-text">
              &quot;{testimonial.text}&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">
                {testimonial.image ? (
                  <Image src={testimonial.image} alt={testimonial.name} width={42} height={42} />
                ) : (
                  <span style={{fontSize: '1.1rem'}}>👤</span>
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
        <div className="section-label" style={{textAlign:"center"}}>Vamos Trabalhar Juntos</div>
        <h2 className="contact-title">Pronto para <em>Elevar</em> seu Negócio Digital?</h2>
        <p className="contact-desc">
          Seja um site novo, uma campanha de marketing ou uma identidade visual que vai fazer sua marca ser lembrada — estou aqui para transformar sua visão em realidade.
        </p>
        <div className="contact-btns">
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="btn-primary"
          >
            ✉ Enviar Mensagem
          </button>
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
              <span>
                {[contact.address.street, contact.address.city, contact.address.state]
                  .filter(Boolean)
                  .join(", ") || "Remoto"}
              </span>
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
        {/* <img src="==" alt="Portify" /> */}
        <Link href={'/'} className="justify-center">
          <Logo
          alterIcon="https://agenciaaimagic.com.br/portify/logo_nova_txt_g_dark.png"
          alterH={80}
          alterW={120}/>
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
            <div className="project-modal-image" style={{ background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
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
            <div className="project-modal-desc">
              {selectedProject.description}
            </div>
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
