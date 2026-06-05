"use client";

import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Hero } from "@/types/hero";
import { About } from "@/types/about";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";
import { UserAvatar } from "@/components/ui/user-avatar";
import DOMPurify from "isomorphic-dompurify";

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
  userImage?: string;
  userName?: string;
}

export default function Template1({ userId, categories, projects, userImage, userName }: TemplateProps) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

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

  const fullName = userName || hero?.title || "Pablo Azevedo";

  // Renderiza ícone Lucide pelo nome, com fallback para emoji
  const getLucideIcon = (iconName: string, fallbackIndex: number) => {
    const fallbackNames = ["Rocket", "Wrench", "Palette", "Zap", "Target", "TrendingUp", "Diamond", "Shield"];
    const emojiFallback = ["🚀", "🛠️", "🎨", "⚡", "🎯", "📈", "💎", "🛡️"];

    const name = iconName || fallbackNames[fallbackIndex % fallbackNames.length];
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[name];

    if (IconComponent) {
      return <IconComponent size={32} color="var(--gold)" />;
    }

    // Fallback para emoji se o nome não corresponder a nenhum ícone Lucide
    return <span style={{ fontSize: "2rem" }}>{emojiFallback[fallbackIndex % emojiFallback.length]}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs uppercase tracking-widest" style={{ color: "#8C7B5E" }}>
        Loading Template...
      </div>
    );
  }

  return (
    <div className="template-1-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&display=swap');
        :root {
          --bg:        #FDFAF5;
          --bg2:       #F7F2E8;
          --bg3:       #F0E9D8;
          --card:      #EDE3CC;
          --card2:     #E8DCC0;
          --gold:      #C9A84C;
          --gold2:     #B8943F;
          --gold-dim:  rgba(201,168,76,.12);
          --gold-glow: rgba(201,168,76,.25);
          --green:     #A89060;
          --amber:     #C9A84C;
          --text:      #2C2416;
          --muted:     #8C7B5E;
          --border:    rgba(201,168,76,.28);
          --r:         12px;
          --r2:        20px;
        }
        .template-1-wrapper {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.65;
          overflow-x: hidden;
        }
        .template-1-wrapper *, .template-1-wrapper *::before, .template-1-wrapper *::after { box-sizing: border-box; margin: 0; padding: 0 }
        .template-1-wrapper html { scroll-behavior: smooth }
        .template-1-wrapper .container { max-width: 1100px; margin: 0 auto; padding: 0 24px }
        .template-1-wrapper .teal { color: var(--gold) }
        .template-1-wrapper .green { color: var(--green) }
        .template-1-wrapper .amber { color: var(--amber) }
        .template-1-wrapper .muted { color: var(--muted) }
        .template-1-wrapper .badge {
          display: inline-block;
          background: var(--gold-dim);
          border: 1px solid var(--border);
          color: var(--gold);
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 18px;
        }
        .template-1-wrapper .tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--gold-dim);
          border: 1px solid var(--border);
          color: var(--gold);
          font-size: .78rem; font-weight: 600;
          padding: 4px 12px; border-radius: 6px;
        }
        .template-1-wrapper .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold);
          color: #1A1208;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .95rem;
          letter-spacing: .03em;
          padding: 14px 32px;
          border-radius: var(--r);
          border: none; cursor: pointer;
          text-decoration: none;
          transition: all .22s ease;
          box-shadow: 0 0 24px rgba(201,168,76,.35);
        }
        .template-1-wrapper .btn-primary:hover {
          background: var(--gold2);
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(201,168,76,.5);
        }
        .template-1-wrapper .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          color: var(--gold);
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .9rem;
          padding: 12px 28px;
          border-radius: var(--r);
          border: 1.5px solid var(--border);
          cursor: pointer; text-decoration: none;
          transition: all .22s ease;
        }
        .template-1-wrapper .btn-ghost:hover {
          background: var(--gold-dim);
          border-color: var(--gold);
        }
        .template-1-wrapper .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.7rem, 3.5vw, 2.6rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -.02em;
        }
        .template-1-wrapper .section-sub {
          font-size: 1rem;
          color: var(--muted);
          margin-top: 12px;
        }
        .template-1-wrapper nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(253, 250, 245, .92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 14px 0;
        }
        .template-1-wrapper nav .container {
          display: flex; align-items: center; justify-content: space-between;
        }
        .template-1-wrapper nav img { height: 32px; object-fit: contain }
        .template-1-wrapper .nav-cta { font-size: .85rem; padding: 10px 22px }
        .template-1-wrapper #hero {
          position: relative;
          padding: 80px 0 0;
          background: var(--bg);
          overflow: hidden;
        }
        .template-1-wrapper #hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 70% 40%, rgba(201,168,76,.09) 0%, transparent 70%);
          pointer-events: none;
        }
        .template-1-wrapper .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 30px;
          align-items: stretch;
        }
        .template-1-wrapper .hero-copy { padding-bottom: 80px }
        .template-1-wrapper .hero-copy h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 4vw, 3.1rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -.03em;
          margin-bottom: 22px;
        }
        .template-1-wrapper .hero-copy p {
          font-size: 1.05rem; color: var(--muted);
          margin-bottom: 32px; max-width: 460px;
        }
        .template-1-wrapper .hero-stats {
          display: flex; gap: 32px; margin-top: 40px;
        }
        .template-1-wrapper .hero-stat span {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem; font-weight: 700;
          color: var(--gold);
        }
        .template-1-wrapper .hero-stat small { font-size: .78rem; color: var(--muted) }
        .template-1-wrapper .hero-img-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 720px;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }
        .template-1-wrapper .hero-img-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(201,168,76,.18) 0%, transparent 70%);
          filter: blur(40px);
          z-index: 0;
        }
        .template-1-wrapper .hero-img-wrap img {
            width: 100%;
            height: 100%;
            min-height: 720px;
            object-fit: cover;
            object-position: center;
            border-radius: 24px;
            border: 1px solid var(--border);
            display: block;
        }
        .template-1-wrapper .hero-banner {
          width: 100%;
          background: linear-gradient(135deg, #F0E9D8 0%, #EDE3CC 100%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 18px 0; margin-top: 0;
        }
        .template-1-wrapper .hero-banner .container {
          display: flex; align-items: center; justify-content: center;
          gap: 40px; flex-wrap: wrap;
        }
        .template-1-wrapper .hb-item {
          display: flex; align-items: center; gap: 10px;
          font-size: .85rem; color: var(--muted);
          white-space: nowrap;
        }
        .template-1-wrapper .hb-item .dot {
          width: 8px; height: 8px;
          border-radius: 50%; background: var(--gold);
          flex-shrink: 0;
        }
        .template-1-wrapper #pain {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper #pain .container { text-align: center }
        .template-1-wrapper .pain-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px; margin-top: 48px;
        }
        .template-1-wrapper .pain-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 28px 24px;
          text-align: left;
          transition: border-color .2s;
        }
        .template-1-wrapper .pain-card:hover { border-color: var(--gold) }
        .template-1-wrapper .pain-icon {
          width: 40px; height: 40px;
          background: var(--gold-dim);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; margin-bottom: 14px;
        }
        .template-1-wrapper .pain-card h4 {
          font-family: 'Syne', sans-serif;
          font-size: .95rem; font-weight: 700;
          margin-bottom: 8px;
        }
        .template-1-wrapper .pain-card p { font-size: .83rem; color: var(--muted) }
        .template-1-wrapper #modules {
          padding: 90px 0;
          background: var(--bg);
        }
        .template-1-wrapper #modules .container { text-align: center }
        .template-1-wrapper .modules-header { margin-bottom: 52px }
        .template-1-wrapper .modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 14px;
        }
        .template-1-wrapper .module-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 26px 22px;
          position: relative; overflow: hidden;
          transition: all .25s;
        }
        .template-1-wrapper .module-card::after {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
          opacity: 0; transition: opacity .25s;
        }
        .template-1-wrapper .module-card:hover { border-color: var(--gold); transform: translateY(-3px) }
        .template-1-wrapper .module-card:hover::after { opacity: 1 }
        .template-1-wrapper .mod-num {
          font-family: 'Syne', sans-serif;
          font-size: .7rem; font-weight: 700;
          letter-spacing: .15em; color: var(--gold);
          text-transform: uppercase; margin-bottom: 10px;
        }
        .template-1-wrapper .module-card h4 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700;
          margin-bottom: 8px;
        }
        .template-1-wrapper .module-card p { font-size: .82rem; color: var(--muted) }
        .template-1-wrapper #forwho {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper .forwho-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 32px; margin-top: 48px;
        }
        .template-1-wrapper .fw-col {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 32px 28px;
        }
        .template-1-wrapper .fw-col h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700;
          margin-bottom: 20px;
        }
        .template-1-wrapper .fw-list { list-style: none }
        .template-1-wrapper .fw-list li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: .88rem; color: var(--muted);
          padding: 8px 0;
          border-bottom: 1px solid rgba(44,36,22,.08);
        }
        .template-1-wrapper .fw-list li:last-child { border-bottom: none }
        .template-1-wrapper .fw-list .ico { color: var(--gold); font-size: 1rem; flex-shrink: 0; margin-top: 1px }
        .template-1-wrapper .fw-list .ico.no { color: #c0392b }
        .template-1-wrapper #method {
          padding: 90px 0;
          background: var(--bg);
        }
        .template-1-wrapper .method-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center;
          margin-top: 0;
        }
        .template-1-wrapper .method-steps {
          counter-reset: step;
          display: flex; flex-direction: column; gap: 24px;
          margin-top: 40px;
        }
        .template-1-wrapper .step {
          display: flex; gap: 20px; align-items: flex-start;
          counter-increment: step;
        }
        .template-1-wrapper .step-num {
          width: 44px; height: 44px; flex-shrink: 0;
          background: var(--gold-dim);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; color: var(--gold);
        }
        .template-1-wrapper .step-body h4 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; margin-bottom: 5px;
        }
        .template-1-wrapper .step-body p { font-size: .84rem; color: var(--muted) }
        .template-1-wrapper .method-visual {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 36px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .template-1-wrapper .mv-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px;
          background: var(--bg3);
          border-radius: var(--r);
          font-size: .88rem;
        }
        .template-1-wrapper .mv-row span { font-weight: 600 }
        .template-1-wrapper .mv-row small { display: block; color: var(--muted); font-size: .78rem }
        .template-1-wrapper #testimonials {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper .testi-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; margin-top: 48px;
        }
        .template-1-wrapper .testi-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 28px 24px;
          transition: border-color .2s;
        }
        .template-1-wrapper .testi-card:hover { border-color: var(--gold) }
        .template-1-wrapper .stars { color: var(--amber); font-size: .85rem; margin-bottom: 12px }
        .template-1-wrapper .testi-text {
          font-size: .88rem; color: var(--muted);
          margin-bottom: 18px; line-height: 1.7;
        }
        .template-1-wrapper .testi-author {
          display: flex; align-items: center; gap: 10px;
        }
        .template-1-wrapper .testi-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--gold-dim);
          border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: .85rem; font-weight: 700; color: var(--gold);
          flex-shrink: 0;
        }
        .template-1-wrapper .testi-name { font-size: .85rem; font-weight: 700 }
        .template-1-wrapper .testi-role { font-size: .75rem; color: var(--muted) }
        .template-1-wrapper #instructor {
          padding: 90px 0;
          background: var(--bg);
          overflow: hidden;
        }
        .template-1-wrapper .instructor-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .template-1-wrapper .instructor-img {
          position: relative;
        }
        .template-1-wrapper .instructor-img::before {
          content: ''; position: absolute;
          inset: -20px; z-index: 0;
          background: radial-gradient(circle at 50% 60%, var(--gold-glow) 0%, transparent 65%);
          border-radius: 50%;
        }
        .template-1-wrapper .instructor-img img {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: 620px;
          max-height: 760px;
          object-fit: cover;
          border-radius: 24px;
          border: 1px solid var(--border);
          filter: drop-shadow(0 20px 60px rgba(44,36,22,.15));
        }
        .template-1-wrapper .instructor-copy .badge { margin-bottom: 14px }
        .template-1-wrapper .instructor-copy h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700; margin-bottom: 8px;
        }
        .template-1-wrapper .instructor-copy .sub-name {
          color: var(--gold); font-size: 1rem;
          font-weight: 600; margin-bottom: 20px;
        }
        .template-1-wrapper .instructor-copy p {
          font-size: .92rem; color: var(--muted);
          margin-bottom: 14px; line-height: 1.75;
        }
        .template-1-wrapper .instructor-stats {
          display: flex; gap: 24px; margin-top: 28px; flex-wrap: wrap;
        }
        .template-1-wrapper .i-stat {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r);
          padding: 14px 20px;
          text-align: center;
        }
        .template-1-wrapper .i-stat span {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem; font-weight: 700; color: var(--gold);
        }
        .template-1-wrapper .i-stat small { font-size: .75rem; color: var(--muted) }
        .template-1-wrapper #pricing {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper .pricing-wrap {
          max-width: 700px; margin: 48px auto 0;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 48px;
          position: relative; overflow: hidden;
          text-align: center;
        }
        .template-1-wrapper .pricing-wrap::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--green));
        }
        .template-1-wrapper .price-badge {
          display: inline-block;
          background: rgba(168,144,96,.12);
          border: 1px solid rgba(168,144,96,.3);
          color: var(--green);
          font-size: .72rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; padding: 5px 14px; border-radius: 999px;
          margin-bottom: 24px;
        }
        .template-1-wrapper .price-old {
          font-size: .95rem; color: var(--muted);
          text-decoration: line-through; margin-bottom: 6px;
        }
        .template-1-wrapper .price-main {
          display: flex; align-items: flex-start;
          justify-content: center; gap: 6px;
          margin: 8px 0 24px;
        }
        .template-1-wrapper .price-cur {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 700;
          color: var(--gold); padding-top: 10px;
        }
        .template-1-wrapper .price-val {
          font-family: 'Syne', sans-serif;
          font-size: 4.5rem; font-weight: 700;
          color: var(--text); line-height: 1;
        }
        .template-1-wrapper .price-cents {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 700;
          color: var(--muted); padding-top: 10px;
        }
        .template-1-wrapper .price-note {
          font-size: .85rem; color: var(--muted); margin-bottom: 32px;
        }
        .template-1-wrapper .price-features {
          list-style: none;
          display: flex; flex-direction: column; gap: 10px;
          text-align: left; margin: 28px 0;
        }
        .template-1-wrapper .price-features li {
          display: flex; align-items: center; gap: 10px;
          font-size: .88rem;
        }
        .template-1-wrapper .price-features .ck { color: var(--gold); font-size: 1rem }
        .template-1-wrapper .guarantee {
          display: flex; align-items: center; gap: 12px;
          background: rgba(168,144,96,.07);
          border: 1px solid rgba(168,144,96,.2);
          border-radius: var(--r);
          padding: 14px 18px; margin-top: 28px;
          font-size: .84rem; color: var(--muted);
          text-align: left;
        }
        .template-1-wrapper .guarantee .shield { font-size: 1.6rem }
        .template-1-wrapper #bonus {
          padding: 90px 0;
          background: var(--bg);
        }
        .template-1-wrapper .bonus-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; margin-top: 48px;
        }
        .template-1-wrapper .bonus-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 28px 22px;
          transition: all .25s;
          position: relative; overflow: hidden;
        }
        .template-1-wrapper .bonus-card::before {
          content: 'VANTAGEM'; position: absolute;
          top: 14px; right: -20px;
          background: var(--gold); color: #1A1208;
          font-size: .62rem; font-weight: 700; letter-spacing: .1em;
          padding: 3px 30px;
          transform: rotate(40deg);
        }
        .template-1-wrapper .bonus-card:hover { border-color: var(--gold); transform: translateY(-3px) }
        .template-1-wrapper .bonus-icon {
          display: flex; align-items: center; justify-content: flex-start;
          margin-bottom: 14px;
          width: 48px; height: 48px;
          background: var(--gold-dim);
          border-radius: 10px;
          padding: 8px;
        }
        .template-1-wrapper .bonus-card h4 {
          font-family: 'Syne', sans-serif;
          font-size: .98rem; font-weight: 700; margin-bottom: 8px;
        }
        .template-1-wrapper .bonus-card p { font-size: .82rem; color: var(--muted) }
        .template-1-wrapper .bonus-val {
          margin-top: 14px;
          font-size: .8rem; color: var(--green); font-weight: 700;
        }
        .template-1-wrapper #faq {
          padding: 70px 0 30px;
          background: var(--bg2);
        }
        .template-1-wrapper #faq .container { text-align: center }
        .template-1-wrapper .faq-wrap {
          max-width: 720px; margin: 48px auto 0;
          display: flex; flex-direction: column; gap: 12px;
          text-align: left;
        }
        .template-1-wrapper .faq-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r);
          overflow: hidden;
          transition: border-color .2s;
        }
        .template-1-wrapper .faq-item:hover { border-color: var(--gold) }
        .template-1-wrapper .faq-q {
          width: 100%; background: none; border: none;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 18px 22px;
          cursor: pointer; color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: .93rem; font-weight: 600;
          text-align: left;
        }
        .template-1-wrapper .faq-q .arr {
          color: var(--gold); font-size: 1.2rem; flex-shrink: 0;
          transition: transform .25s;
        }
        .template-1-wrapper .faq-a {
          font-size: .86rem; color: var(--muted);
          padding: 0 22px 18px; line-height: 1.75;
          display: none;
        }
        .template-1-wrapper .faq-item.open .faq-a { display: block }
        .template-1-wrapper .faq-item.open .arr { transform: rotate(45deg) }
        .template-1-wrapper #cta-final {
          padding: 50px 0 80px;
          background: var(--bg);
          position: relative; overflow: hidden;
          text-align: center;
        }
        .template-1-wrapper #cta-final::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .template-1-wrapper #cta-final h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700; line-height: 1.15;
          max-width: 700px; margin: 0 auto 20px;
        }
        .template-1-wrapper #cta-final p {
          font-size: 1rem; color: var(--muted);
          max-width: 520px; margin: 0 auto 36px;
        }
        .template-1-wrapper footer {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          padding: 48px 0 32px;
        }
        .template-1-wrapper .footer-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 40px;
        }
        .template-1-wrapper .footer-brand img { height: 28px; margin-bottom: 14px }
        .template-1-wrapper .footer-brand p { font-size: .82rem; color: var(--muted) }
        .template-1-wrapper .footer-col h5 {
          font-family: 'Syne', sans-serif;
          font-size: .8rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 14px;
        }
        .template-1-wrapper .footer-col a {
          display: block; text-decoration: none;
          font-size: .84rem; color: var(--muted);
          margin-bottom: 8px; transition: color .2s;
        }
        .template-1-wrapper .footer-col a:hover { color: var(--text) }
        .template-1-wrapper .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 24px;
          display: flex; align-items: center; justify-content: space-between;
          font-size: .78rem; color: var(--muted);
        }
        .template-1-wrapper .footer-logo-small { height: 22px }

        .template-1-wrapper #projects {
          background: var(--bg) !important;
          color: var(--text) !important;
        }
        .template-1-wrapper #projects h2 {
          font-family: 'Syne', sans-serif !important;
          color: var(--text) !important;
          letter-spacing: -.02em !important;
        }
        .template-1-wrapper #projects p {
          color: var(--muted) !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .template-1-wrapper #projects div {
          padding: 3px;
        }

        /* TabsList */
        .template-1-wrapper #projects [role="tablist"] {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 8px !important;
          height: auto !important;
          padding: 6px 10px !important;
          background: var(--card) !important;
          border: 1px solid var(--border) !important;
          border-radius: 999px !important;
          max-width: fit-content !important;
          margin: 0 auto 48px auto !important;
        }

        /* TabsTrigger */
        .template-1-wrapper #projects [role="tab"] {
          font-family: 'DM Sans', sans-serif !important;
          font-size: .88rem !important;
          font-weight: 600 !important;
          color: var(--muted) !important;
          padding: 8px 20px !important;
          border-radius: 999px !important;
          border: none !important;
          background: transparent !important;
          transition: all .2s ease !important;
          white-space: nowrap !important;
          letter-spacing: .02em !important;
        }
        .template-1-wrapper #projects [role="tab"]:hover {
          color: var(--gold) !important;
          background: var(--gold-dim) !important;
        }
        .template-1-wrapper #projects [role="tab"][data-state="active"] {
          background: var(--gold) !important;
          color: #1A1208 !important;
          font-weight: 700 !important;
        }

        /* Project cards */
        .template-1-wrapper #projects .group {
          background: var(--card) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--r2) !important;
        }
        .template-1-wrapper #projects .group:hover {
          border-color: var(--gold) !important;
          box-shadow: 0 0 30px rgba(201,168,76,0.15) !important;
        }
        .template-1-wrapper #projects .group h3 {
          color: var(--text) !important;
          font-family: 'Syne', sans-serif !important;
        }
        .template-1-wrapper #projects .group h3:hover {
          color: var(--gold) !important;
        }
        .template-1-wrapper #projects .group span {
          background: var(--gold-dim) !important;
          color: var(--gold) !important;
          border: 1px solid var(--border) !important;
        }

        /* Pagination buttons */
        .template-1-wrapper #projects button:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
        .template-1-wrapper #projects .rounded-full.w-10.h-10 {
          background: var(--card) !important;
          border: 1px solid var(--border) !important;
          color: var(--gold) !important;
        }
        .template-1-wrapper #projects .rounded-full.w-10.h-10:hover:not(:disabled) {
          background: var(--gold-dim) !important;
          border-color: var(--gold) !important;
        }

        /* Pagination text */
        .template-1-wrapper #projects span.text-sm.font-medium {
          color: var(--muted) !important;
          font-family: 'DM Sans', sans-serif !important;
        }

        /* ContactSection Overrides */
        .template-1-wrapper #contact {
          background: var(--bg) !important;
          padding: 90px 0 !important;
          color: var(--text) !important;
        }
        .template-1-wrapper #contact form {
          padding: 20px !important;
        }
        .template-1-wrapper #contact form input {
          padding: 10px !important;
        }
        .template-1-wrapper #contact div[class*="bg-[#5221e6"] {
          background: var(--gold-glow) !important;
        }
        .template-1-wrapper #contact h2 {
          font-family: 'Syne', sans-serif !important;
          font-size: clamp(1.7rem, 3.5vw, 2.6rem) !important;
          font-weight: 700 !important;
          color: var(--text) !important;
          letter-spacing: -.02em !important;
        }
        .template-1-wrapper #contact p {
          color: var(--muted) !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .template-1-wrapper #contact .bg-card {
          background: var(--card) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--r2) !important;
        }
        .template-1-wrapper #contact .bg-gradient-to-tr {
          background: linear-gradient(to top right, var(--gold-glow), transparent) !important;
        }
        .template-1-wrapper #contact .border-border\/50 {
          border-color: var(--border) !important;
        }
        .template-1-wrapper #contact label {
          color: var(--text) !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.85rem !important;
        }
        .template-1-wrapper #contact input,
        .template-1-wrapper #contact textarea {
          background: var(--bg2) !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          border-radius: var(--r) !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .template-1-wrapper #contact input:focus,
        .template-1-wrapper #contact textarea:focus {
          border-color: var(--gold) !important;
          outline: none !important;
        }
        .template-1-wrapper #contact button[type="submit"] {
          background: var(--gold) !important;
          color: #1A1208 !important;
          font-family: 'Syne', sans-serif !important;
          font-weight: 700 !important;
          border-radius: var(--r) !important;
          transition: all .22s ease !important;
          box-shadow: 0 0 20px rgba(201,168,76,.3) !important;
        }
        .template-1-wrapper #contact button[type="submit"]:hover {
          background: var(--gold2) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 0 30px rgba(201,168,76,.5) !important;
        }

        @media(max-width:860px) {
          .template-1-wrapper .hero-grid, .template-1-wrapper .method-grid, .template-1-wrapper .instructor-grid, .template-1-wrapper .forwho-grid { grid-template-columns: 1fr }
          .template-1-wrapper .pain-grid, .template-1-wrapper .modules-grid, .template-1-wrapper .testi-grid, .template-1-wrapper .bonus-grid { grid-template-columns: 1fr 1fr }
          .template-1-wrapper .footer-grid { grid-template-columns: 1fr 1fr }
          .template-1-wrapper .hero-img-wrap { max-height: unset; overflow: visible }
          .template-1-wrapper .hero-img-wrap img { width: 100%; max-height: 420px; object-fit: cover }
          .template-1-wrapper .hero-copy { padding-bottom: 40px }
        }
        @media(max-width:560px) {
          .template-1-wrapper .pain-grid, .template-1-wrapper .modules-grid, .template-1-wrapper .testi-grid, .template-1-wrapper .bonus-grid { grid-template-columns: 1fr }
          .template-1-wrapper .footer-grid { grid-template-columns: 1fr }
          .template-1-wrapper .pricing-wrap { padding: 28px 20px }
          .template-1-wrapper .price-val { font-size: 3.5rem }
          .template-1-wrapper .hero-stats { flex-wrap: wrap; gap: 20px }
          .template-1-wrapper #projects .group {
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
            min-height: 420px !important;
          }
          .template-1-wrapper #projects .group img {
            height: 240px !important;
            object-fit: cover !important;
          }
          .template-1-wrapper #projects .group .p-10 {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        }
      ` }} />

      <nav>
        <div className="container">
          <UserAvatar
            user={{ name: fullName, image: userImage || hero?.backgroundImage }}
            className="border-2 border-[var(--gold)]"
          />
          <a href="#cta-final" className="btn-primary nav-cta">Entrar em Contato →</a>
        </div>
      </nav>

      <section id="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy reveal">
              <div className="badge">✦ Portfólio Profissional</div>
              <h1>{hero?.title?.split(" ")[0]}<br /><span className="teal">{hero?.title?.split(" ").slice(1).join(" ")}</span></h1>
              <p>{hero?.subtitle || "Transformando visões em realidade digital com foco em performance, design e resultados reais."}</p>
              <a href="#modules" className="btn-primary">Ver Especialidades →</a>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span>10+</span>
                  <small>Anos de Exp.</small>
                </div>
                <div className="hero-stat">
                  <span>500+</span>
                  <small>Clientes</small>
                </div>
                <div className="hero-stat">
                  <span>100%</span>
                  <small>Dedicação</small>
                </div>
              </div>
            </div>
            <div className="hero-img-wrap reveal">
              <img src={hero?.backgroundImage || "https://images.unsplash.com/photo-1497366216548-375260702979?auto=format&fit=crop&w=1000&q=80"} alt="Hero" />
            </div>
          </div>
        </div>
        <div className="hero-banner">
          <div className="container">
            <div className="instructor-stats">
              {about && about.features && about.features.length > 0 ? (
                about.features.slice(0, 3).map((f, i) => (
                  <div className="hb-item" key={i}>
                    <span className="dot"></span>{f.title}
                  </div>
                ))
              ) : (
                <>
                  <div className="hb-item"><span className="dot"></span><span>R$12M+</span>Em verba gerenciada</div>
                  <div className="hb-item"><span>320+</span>Freelancer Jobs</div>
                  <div className="hb-item"><span>10+</span>Anos de mercado</div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="pain">
        <div className="container">
          <div className="badge">Minha Abordagem</div>
          <h2 className="section-title">Qualidade & Comprometimento<br />
            <span className="teal">focados em você</span>
          </h2>
          <p className="section-sub">Não acredito em soluções genéricas. Cada projeto é tratado com atenção única, unindo expertise técnica com os objetivos reais do seu negócio.</p>
          <div className="pain-grid">
            <div className="pain-card reveal">
              <h4>Foco no Resultado</h4>
              <p>Cada entrega é pensada para atender exatamente o que você precisa, gerando valor real e impacto direto no seu negócio.</p>
            </div>
            <div className="pain-card reveal">
              <h4>Alta Qualidade</h4>
              <p>Trabalho cuidadoso e criterioso para garantir que cada projeto seja entregue com excelência, sem atalhos.</p>
            </div>
            <div className="pain-card reveal">
              <h4>Identidade Única</h4>
              <p>Soluções personalizadas que refletem a essência da sua marca e se destacam no mercado.</p>
            </div>
            <div className="pain-card reveal">
              <h4>Entrega no Prazo</h4>
              <p>Gestão eficiente do tempo com prazos claros para que seu projeto esteja pronto quando você precisa.</p>
            </div>
            <div className="pain-card reveal">
              <h4>Parceria Real</h4>
              <p>Comunicação próxima e transparente em todas as etapas, garantindo que sua visão seja respeitada.</p>
            </div>
            <div className="pain-card reveal">
              <h4>Visão de Crescimento</h4>
              <p>Soluções planejadas para evoluir junto com a sua empresa, preparadas para os próximos passos.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="modules">
        <div className="container">
          <div className="badge">Minhas Especialidades</div>
          <h2 className="section-title">Áreas de <span className="teal">Atuação</span></h2>
          <p className="section-sub">Soluções especializadas com foco em qualidade, design moderno e entrega de valor real para o cliente.</p>
          <div className="modules-grid">
            {categories.length > 0 ? (
              categories.map((cat, i) => (
                <div className="module-card reveal" key={cat._id || i}>
                  <div className="mod-num">Especialidade {String(i + 1).padStart(2, "0")}</div>
                  <h4>{cat.name}</h4>
                  <p>{cat.description || "Desenvolvimento de soluções com foco em alta performance e experiência do usuário."}</p>
                </div>
              ))
            ) : (
              <>
                <div className="module-card reveal">
                  <div className="mod-num">Especialidade 01</div>
                  <h4>Desenvolvimento Web</h4>
                  <p>Criação de sites e aplicações modernas, responsivas e otimizadas para todos os dispositivos.</p>
                </div>
                <div className="module-card reveal">
                  <div className="mod-num">Especialidade 02</div>
                  <h4>Design de Interface (UI/UX)</h4>
                  <p>Foco na experiência do usuário para criar interfaces intuitivas e visualmente impactantes.</p>
                </div>
                <div className="module-card reveal">
                  <div className="mod-num">Especialidade 03</div>
                  <h4>Estratégia Digital</h4>
                  <p>Planejamento estratégico para posicionar sua marca e atrair o público certo no ambiente digital.</p>
                </div>
                <div className="module-card reveal">
                  <div className="mod-num">Especialidade 04</div>
                  <h4>Otimização de Performance</h4>
                  <p>Melhoria de velocidade e SEO para garantir que seu projeto seja encontrado e carregue instantaneamente.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <ProjectsSection
        title="Projetos"
        userId={userId}
        initialCategories={categories}
        initialProjects={projects}
      />

      <section id="forwho">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="badge">Perfil Profissional</div>
            <h2 className="section-title">Comprometimento com <span className="teal">qualidade real</span>,<br />propósito e dedicação</h2>
          </div>
          <div className="forwho-grid">
            <div className="fw-col reveal">
              <h3 className="green">✓ O que entrego</h3>
              <ul className="fw-list">
                <li><span className="ico">✦</span>Soluções sob medida alinhadas aos objetivos do seu projeto</li>
                <li><span className="ico">✦</span>Comunicação clara e transparente em todas as etapas</li>
                <li><span className="ico">✦</span>Entregas dentro do prazo combinado, sem surpresas</li>
                <li><span className="ico">✦</span>Atenção aos detalhes que fazem a diferença no resultado final</li>
                <li><span className="ico">✦</span>Suporte e acompanhamento mesmo após a conclusão do projeto</li>
              </ul>
            </div>
            <div className="fw-col reveal">
              <h3 style={{ color: "#c0392b" }}>✗ O que não faço</h3>
              <ul className="fw-list">
                <li><span className="ico no">✗</span>Entregas genéricas sem entender a real necessidade do cliente</li>
                <li><span className="ico no">✗</span>Promessas impossíveis só para fechar o contrato</li>
                <li><span className="ico no">✗</span>Desaparecimento após o pagamento sem suporte pós-entrega</li>
                <li><span className="ico no">✗</span>Trabalho sem planejamento ou sem alinhamento prévio</li>
                <li><span className="ico no">✗</span>Negligência com qualidade por excesso de projetos simultâneos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="method">
        <div className="container">
          <div className="method-grid">
            <div className="reveal">
              <div className="badge">O Processo</div>
              <h2 className="section-title">Quatro passos para ver <span className="teal">resultado real</span></h2>
              <div className="method-steps">
                <div className="step">
                  <div className="step-num">01</div>
                  <div className="step-body">
                    <h4>Fundamentos sólidos</h4>
                    <p>Entenda a lógica das plataformas antes de gastar R$1 em anúncio.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-num">02</div>
                  <div className="step-body">
                    <h4>Estrutura com método</h4>
                    <p>Monte campanhas com o framework validado do Método Supremo 7.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-num">03</div>
                  <div className="step-body">
                    <h4>Analise e otimize</h4>
                    <p>Use dados reais para tomar decisões e eliminar o desperdício.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-num">04</div>
                  <div className="step-body">
                    <h4>Escale com confiança</h4>
                    <p>Aumente o investimento sabendo exatamente quando e como fazê-lo.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="method-visual reveal">
              <div className="mv-row">
                <div className="mv-icon">🎯</div>
                <div><span>Objetivo correto</span><small>Campanha alinhada com a meta de negócio</small></div>
              </div>
              <div className="mv-row">
                <div className="mv-icon">👥</div>
                <div><span>Público qualificado</span><small>Segmentação que encontra quem vai comprar</small></div>
              </div>
              <div className="mv-row">
                <div className="mv-icon">📝</div>
                <div><span>Criativo persuasivo</span><small>Anúncio que para o scroll e gera clique</small></div>
              </div>
              <div className="mv-row">
                <div className="mv-icon">📈</div>
                <div><span>Otimização contínua</span><small>Dados guiando cada decisão de investimento</small></div>
              </div>
              <div className="mv-row">
                <div className="mv-icon">🚀</div>
                <div><span>Escala sustentável</span><small>Aumento de orçamento sem quebrar a campanha</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="instructor">
        <div className="container">
          <div className="instructor-grid">
            <div className="instructor-img reveal">
              <img src={userImage || "https://agenciaaimagic.com.br/portify/no-image.jpg"} alt="Instructor" />
            </div>
            <div className="instructor-copy reveal">
              <div className="badge">Seu parceiro de jornada</div>
              <h2 className="section-title">Quem vai te acompanhar<br />neste desafio</h2>
              <div className="sub-name teal">{hero?.title || "O parceiro certo para sua jornada."}</div>
              <div
                className="instructor-desc"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about?.description
                  || "Mais do que entregar projetos, meu compromisso é com o seu sucesso estratégico. Com foco em resultados, flexibilidade e uma comunicação transparente, traduzo suas necessidades em soluções criativas e eficientes. Vamos elevar seu negócio juntos? Estou pronto para transformar desafios em grandes conquistas e ser o braço direito que o seu projeto exige.") }}
              />
              <div className="instructor-stats">
                {about && about.features && about.features.length > 0 ? (
                  about.features.slice(0, 3).map((f, i) => (
                    <div className="i-stat" key={i}>
                      <span>{f.title}</span>
                      <p
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(f.description.substring(0, 20) || "") }}
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="i-stat"><span>R$12M+</span><small>Em verba gerenciada</small></div>
                    <div className="i-stat"><span>320+</span><small>Freelancer Jobs</small></div>
                    <div className="i-stat"><span>10+</span><small>Anos de mercado</small></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="bonus">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="badge">Habilidades Exclusivas</div>
            <h2 className="section-title">Você ainda conta com <span className="teal">habilidades exclusivas</span></h2>
            <p className="section-sub">Competências técnicas e habilidades que complementam e aceleram a entrega do seu projeto.</p>
          </div>
          <div className="bonus-grid">
            {about && about.features && about.features.length > 0 ? (
              about.features.map((feature, i) => (
                <div className="bonus-card reveal" key={i}>
                  <div className="bonus-icon">
                    {getLucideIcon(feature.icon, i)}
                  </div>
                  <h4>{feature.title}</h4>
                  <p
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feature.description || "") }}
                  />
                </div>
              ))
            ) : (
              <>
                <div className="bonus-card reveal">
                  <div className="bonus-icon">{getLucideIcon("Wrench", 0)}</div>
                  <h4>Desenvolvimento Fullstack</h4>
                  <p>Criação de soluções completas, do front-end ao back-end, com foco em escalabilidade.</p>
                </div>
                <div className="bonus-card reveal">
                  <div className="bonus-icon">{getLucideIcon("Palette", 1)}</div>
                  <h4>UI/UX Design</h4>
                  <p>Design de interfaces intuitivas e focadas na melhor experiência para o usuário final.</p>
                </div>
                <div className="bonus-card reveal">
                  <div className="bonus-icon">{getLucideIcon("Zap", 2)}</div>
                  <h4>Otimização de Performance</h4>
                  <p>Técnicas avançadas de SEO e performance para garantir carregamentos instantâneos.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="container">
          <div className="badge">Dúvidas</div>
          <h2 className="section-title">Ainda tem dúvida? <span className="teal">A gente responde</span></h2>
          <div className="faq-wrap">
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Como funciona o seu processo de trabalho?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Trabalho com etapas claras: briefing detalhado, planejamento estratégico, design de interface, desenvolvimento técnico e testes rigorosos. Isso garante que o resultado final esteja perfeitamente alinhado aos seus objetivos.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Quais tipos de projetos você costuma atender?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Atendo desde landing pages de alta conversão e sites institucionais até aplicações web complexas e e-commerces, focando sempre em performance, SEO e a melhor experiência para o usuário final.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Quanto tempo leva a entrega de um projeto?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">O prazo varia conforme a complexidade do escopo. Um site institucional, por exemplo, pode levar de 2 a 4 semanas. Para projetos maiores, definimos juntos um cronograma com entregas parciais para que você acompanhe cada etapa.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Como podemos iniciar uma parceria?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">O primeiro passo é preencher o formulário de contato abaixo. Após analisar sua necessidade, agendamos uma conversa rápida para alinhar expectativas e, em seguida, envio uma proposta comercial detalhada.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Você oferece suporte após a entrega do projeto?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Sim. Além da entrega final, ofereço pacotes de manutenção mensal que incluem atualizações de segurança, backups e melhorias contínuas para garantir que sua plataforma nunca fique obsoleta.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Como funciona a questão do orçamento e pagamentos?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Trabalho com orçamentos personalizados baseados no valor e complexidade do projeto. Geralmente, opera-se com um sinal para início dos trabalhos e o restante dividido entre as etapas de entrega ou no fechamento do projeto.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta-final">
        <div className="container">
          <div className="reveal">
            <div className="badge">Última chamada</div>
            <h2 className="section-title">Pare de queimar verba no escuro.<br /><span className="teal">Tenha a parceria ideal para seu projeto.</span></h2>
            <p>Experiência e comprometimento ao seu dispor.</p>
            <ContactSection userId={userId} />
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <p>Otimize seu tempo e potencialize seus resultados com um parceiro dedicado: transformar sua visão em realidade é a minha especialidade.</p>
            </div>
            <div className="footer-col">
              <h5>Conteúdo</h5>
              <a href="#modules">Minhas Especialidades</a>
              <a href="#instructor">Seu parceiro de jornada</a>
              <a href="#bonus">Habilidades Exclusivas</a>
              <a href="#cta-final">Contato {userName}</a>
            </div>
            <div className="footer-col">
              <h5>Suporte</h5>
              <a href="#faq">Dúvidas</a>
              <a href="#">Política de privacidade</a>
              <a href="#">Termos de uso</a>
              <a href="#contato">Contato</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {hero?.title || "Pablo Azevedo"}. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}