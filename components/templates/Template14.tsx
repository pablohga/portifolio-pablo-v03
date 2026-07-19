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
import {
  ProjectsDelivered,
  SatisfiedClients,
  ExperienceTime,
} from "@/components/about-metrics";
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

const TECH_STACK = ["Next.js", "Tailwind CSS", "TypeScript", "React", "Vercel", "Sanity"];

const BENEFITS = [
  { icon: "ShieldCheck", title: "Mais Credibilidade", desc: "Apareça no Google e seja percebido como referência pelos seus clientes." },
  { icon: "Zap", title: "Conexão Instantânea", desc: "Transmita confiança e profissionalismo desde o primeiro acesso." },
  { icon: "Users", title: "Mais Leads", desc: "Conquiste contatos qualificados todos os dias, de forma constante." },
  { icon: "Clock", title: "Vendas 24/7", desc: "Seu site trabalha por você mesmo enquanto você está fora do ar." },
  { icon: "Award", title: "Diferencial no Mercado", desc: "Destaque-se da concorrência e mostre seu valor de forma única." },
  { icon: "TrendingUp", title: "Resultados Reais", desc: "Mais tráfego, mais clientes e mais crescimento para o seu negócio." },
];

const HOW_IT_WORKS = [
  { icon: "Target", title: "Atraia os clientes certos", desc: "Um site bem estruturado posiciona sua marca e gera autoridade." },
  { icon: "MousePointerClick", title: "Converta visitantes em clientes", desc: "Design estratégico para guiar o visitante até entrar em contato." },
  { icon: "Gem", title: "Fortaleça sua marca", desc: "Destaque seu diferencial e mostre seu valor de forma profissional." },
];

const PROCESS_STEPS = [
  { icon: "ClipboardList", title: "Briefing", desc: "Entendemos seu negócio, objetivos e público-alvo para criar a estratégia ideal." },
  { icon: "Compass", title: "Planejamento", desc: "Estruturamos o conteúdo, design e funcionalidades com foco em conversão e performance." },
  { icon: "Code2", title: "Desenvolvimento", desc: "Construímos seu site com tecnologias modernas, SEO e responsividade total." },
  { icon: "Rocket", title: "Lançamento", desc: "Testamos, otimizamos e colocamos seu site no ar com tudo pronto para gerar resultados." },
];

const FAQ_ITEMS = [
  { q: "Quanto tempo leva para meu site ficar pronto?", a: "O prazo varia de acordo com a complexidade do projeto, mas a maioria dos sites institucionais fica pronta entre 2 e 4 semanas após o briefing." },
  { q: "Preciso fornecer o domínio e hospedagem?", a: "Não é obrigatório. Podemos te orientar na escolha e configuração, ou cuidar de todo o processo para você." },
  { q: "O site será responsivo para celular?", a: "Sim. Todos os projetos são desenvolvidos com design responsivo, garantindo uma ótima experiência em qualquer dispositivo." },
  { q: "Vocês fazem manutenção após a entrega?", a: "Sim, oferecemos planos de manutenção e suporte contínuo após o lançamento do seu site." },
  { q: "Posso atualizar o conteúdo do site sozinho?", a: "Sim. Entregamos um painel simples e intuitivo para que você edite textos e imagens sem depender de programação." },
];

const CONTACT_BULLETS = [
  { icon: "Zap", text: "Atendimento rápido e personalizado" },
  { icon: "Target", text: "Estratégia focada em resultados reais" },
  { icon: "Sparkles", text: "Design moderno e alta performance" },
];

export default function Template14({ userId, categories, projects, userImage, userName }: TemplateProps) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [contact, setContact] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.style.setProperty("--bg", "#0b1712");
      document.documentElement.style.setProperty("--surface", "#0f2019");
      document.documentElement.style.setProperty("--card", "#122a21");
      document.documentElement.style.setProperty("--card-2", "#0e241c");
      document.documentElement.style.setProperty("--border", "rgba(255,255,255,0.08)");
      document.documentElement.style.setProperty("--text", "#eef5f0");
      document.documentElement.style.setProperty("--muted", "#9db3a8");
      document.documentElement.style.setProperty("--nav-bg", "rgba(11,23,18,0.85)");
    } else {
      document.documentElement.style.setProperty("--bg", "#ffffff");
      document.documentElement.style.setProperty("--surface", "#f6f8f6");
      document.documentElement.style.setProperty("--card", "#ffffff");
      document.documentElement.style.setProperty("--card-2", "#f2f4f2");
      document.documentElement.style.setProperty("--border", "rgba(15,25,20,0.08)");
      document.documentElement.style.setProperty("--text", "#101913");
      document.documentElement.style.setProperty("--muted", "#5c6b62");
      document.documentElement.style.setProperty("--nav-bg", "rgba(255,255,255,0.85)");
    }
  }, [theme]);

  useEffect(() => {
    async function fetchData() {
      try {
        const endpoints = [
          { key: "hero", url: `/api/hero?userId=${userId}` },
          { key: "about", url: `/api/about?userId=${userId}` },
          { key: "testimonials", url: `/api/testimonials?userId=${userId}` },
          { key: "contact", url: `/api/contact/settings?userId=${userId}` },
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

  const fullName = userName || hero?.title || "Sua Empresa";

  const userProjects = projects.filter((p) => p.userId === userId);

  const featuredProjects = (() => {
    const sorted = [...userProjects].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const featured = sorted.find((p) => p.isFeatured);
    if (featured) {
      const others = sorted.filter((p) => p._id !== featured._id);
      return [featured, ...others].slice(0, 4);
    }
    return sorted.slice(0, 4);
  })();

  const categoryNames: string[] =
    categories && categories.length > 0
      ? Array.from(new Set(categories.map((c: any) => c.name || c)))
      : Array.from(new Set(userProjects.map((p) => p.category).filter(Boolean) as string[]));

  const allCategories = ["Todos", ...categoryNames];

  const filteredProjects =
    activeCategory === "Todos" ? userProjects : userProjects.filter((p) => p.category === activeCategory);

  const previewProjects = filteredProjects.slice(0, 4);

  return (
    <div className="template-converted-wrapper" data-theme={theme}>
      <style
        dangerouslySetInnerHTML={{
          __html: `

        :root {
          --accent: #3f8a5c;
          --accent-dark: #2c6b45;
          --accent-soft: rgba(63,138,92,0.12);
          --accent-mid: rgba(63,138,92,0.25);
          --dark-bg: #0b1712;
          --dark-surface: #0f2019;
          --dark-card: #122a21;
          --font-display: 'Manrope', 'Segoe UI', sans-serif;
          --font-body: 'Inter', 'Segoe UI', sans-serif;
          --radius-sm: 8px;
          --radius-md: 14px;
          --radius-lg: 20px;
          --radius-xl: 28px;
          --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .template-converted-wrapper {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
          overflow-x: hidden;
          min-height: 100vh;
          transition: background 0.3s, color 0.3s;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }

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

        .nav-links { display: flex; align-items: center; gap: 1.8rem; list-style: none; }

        .nav-links a {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text);
          text-decoration: none;
          transition: var(--transition);
        }

        .nav-links a:hover { color: var(--accent); }

        .nav-actions { display: flex; align-items: center; gap: 12px; }

        .btn-theme {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          width: 38px; height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
        }
        .btn-theme:hover { border-color: var(--accent); color: var(--accent); }

        .btn-cta {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          background: var(--accent);
          color: #ffffff;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: var(--transition);
        }
        .btn-cta:hover { background: var(--accent-dark); transform: translateY(-2px); }

        .btn-outline {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          background: transparent;
          color: var(--text);
          border: 1.5px solid var(--border);
          padding: 0.7rem 1.5rem;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: var(--transition);
        }
        .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

        .hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .hamburger span { display: block; width: 22px; height: 2px; background: var(--text); border-radius: 2px; }

        /* ─── HERO ─── */
        .hero {
          padding: 10rem 5vw 5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          background: var(--bg);
        }

        .hero-eyebrow {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.01em;
          margin-bottom: 1.2rem;
        }
        .hero-title em { font-style: normal; color: var(--accent); }

        .hero-desc {
          font-size: 1.05rem;
          color: var(--muted);
          max-width: 480px;
          margin-bottom: 2rem;
        }

        .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 2.5rem; }

        .hero-stats { display: flex; gap: 2.2rem; flex-wrap: wrap; }
        .stat-item { text-align: left; }
        .stat-number {
          font-family: var(--font-display);
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
        }
        .stat-label { font-size: 0.75rem; color: var(--muted); margin-top: 4px; }

        .hero-visual { position: relative; }

        .browser-mock {
          background: var(--dark-bg);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .browser-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 0.7rem 1rem;
          background: rgba(255,255,255,0.04);
        }
        .browser-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.2); }
        .browser-label {
          margin-left: 10px; font-size: 0.7rem; color: rgba(255,255,255,0.4);
          font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase;
        }

        .browser-content { padding: 2.4rem 2rem 1.6rem; position: relative; overflow: hidden; }

        .browser-headline {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(1.3rem, 2.2vw, 1.9rem);
          line-height: 1.2;
          color: #ffffff;
          margin-bottom: 0.8rem;
          max-width: 90%;
        }
        .browser-headline em { color: var(--accent); font-style: normal; }

        .browser-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.55);
          max-width: 80%;
          margin-bottom: 1.4rem;
        }

        .browser-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--accent);
          color: #fff;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.75rem;
          padding: 0.55rem 1.2rem;
          border-radius: 50px;
        }

        .browser-thumbs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 1.8rem;
        }

        .browser-thumb {
          aspect-ratio: 3/4;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255,255,255,0.06);
        }
        .browser-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .browser-thumb-empty {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.3); font-size: 1.4rem;
        }

        /* ─── SECTIONS ─── */
        section { padding: 5.5rem 5vw; background: var(--bg); }

        .section-label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.75rem;
          text-align: center;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.7rem, 3vw, 2.5rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1rem;
          text-align: center;
        }
        .section-title em { font-style: normal; color: var(--accent); }

        .section-desc {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.75;
          margin: 0 auto 3rem;
          text-align: center;
          max-width: 640px;
        }

        /* ─── HOW IT WORKS / FEATURE CARDS ─── */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          transition: var(--transition);
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.08); }

        .feature-icon {
          width: 48px; height: 48px;
          background: var(--accent-soft);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.2rem;
        }

        .feature-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.02rem;
          margin-bottom: 0.5rem;
        }

        .feature-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.6; }

        /* ─── PROCESS ─── */
        .process-section { background: var(--surface); }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .process-step {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.8rem;
        }

        .step-number {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--accent);
          margin-bottom: 0.8rem;
        }

        .step-title { font-family: var(--font-display); font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; }
        .step-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }

        .tech-row {
          display: flex; align-items: center; justify-content: center;
          gap: 2.4rem; flex-wrap: wrap;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .tech-row-label {
          text-align: center;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 1.5rem;
          font-family: var(--font-display);
          font-weight: 700;
        }

        .tech-chip {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text);
          display: flex; align-items: center; gap: 8px;
          opacity: 0.75;
        }

        /* ─── SOBRE ─── */
        .about-section {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 3.5rem;
          align-items: center;
        }

        .about-image-wrap { position: relative; }

        .about-image {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          border-radius: var(--radius-xl);
          display: block;
          box-shadow: 0 30px 70px rgba(0,0,0,0.15);
        }

        .about-badge {
          position: absolute;
          bottom: -18px; left: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0.8rem 1.2rem;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .about-badge-icon {
          width: 32px; height: 32px;
          background: var(--accent-soft);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        .about-badge-text { font-size: 0.78rem; color: var(--muted); line-height: 1.3; }
        .about-badge-text strong { display: block; color: var(--text); font-family: var(--font-display); font-size: 0.85rem; }

        .about-label { font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.6rem; }

        .about-title { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.6rem, 2.6vw, 2.2rem); margin-bottom: 1.2rem; line-height: 1.25; }
        .about-title em { font-style: normal; color: var(--accent); }

        .about-text { font-size: 1rem; color: var(--muted); line-height: 1.8; margin-bottom: 1.5rem; }

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
          padding: 1.8rem;
          display: flex; gap: 1rem;
          transition: var(--transition);
        }
        .service-card:hover { border-color: var(--accent-mid); transform: translateY(-3px); }

        .service-icon {
          width: 44px; height: 44px; flex: 0 0 auto;
          background: var(--accent-soft);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
        }

        .service-title { font-family: var(--font-display); font-weight: 700; font-size: 0.98rem; margin-bottom: 0.4rem; }
        .service-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }

        /* ─── PORTFOLIO NICHE ─── */
        .portfolio-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 2.5rem;
          align-items: stretch;
        }

        .niche-list { display: flex; flex-direction: column; gap: 10px; }

        .niche-item {
          display: flex; align-items: center; justify-content: space-between;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.1rem 1.4rem;
          cursor: pointer;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.92rem;
          transition: var(--transition);
        }
        .niche-item:hover, .niche-item.active { border-color: var(--accent); color: var(--accent); }

        .niche-preview {
          background: var(--dark-bg);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0,0,0,0.2);
        }

        .niche-preview-content { padding: 2.2rem 1.8rem 1.6rem; }

        .niche-preview-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.4rem;
          color: #fff;
          margin-bottom: 0.6rem;
          max-width: 85%;
        }

        .niche-preview-sub { font-size: 0.82rem; color: rgba(255,255,255,0.55); margin-bottom: 1.4rem; max-width: 85%; }

        .niche-preview-thumbs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 1.6rem;
        }
        .niche-thumb { aspect-ratio: 3/4; border-radius: 10px; overflow: hidden; background: rgba(255,255,255,0.06); }
        .niche-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ─── BENEFITS ─── */
        .benefits-section { background: var(--surface); }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 2rem;
        }

        .benefit-item { text-align: center; }

        .benefit-icon {
          width: 52px; height: 52px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
        }

        .benefit-title { font-family: var(--font-display); font-weight: 700; font-size: 0.92rem; margin-bottom: 0.4rem; }
        .benefit-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.55; }

        /* ─── TESTIMONIALS ─── */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .testimonial-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.8rem;
        }

        .testimonial-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }

        .author-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--accent-soft);
          border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          font-size: 1.1rem;
        }
        .author-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .author-name { font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; }
        .author-role { font-size: 0.75rem; color: var(--muted); }

        .testimonial-stars { color: #f5b942; font-size: 0.85rem; margin-bottom: 0.8rem; }
        .testimonial-text { font-size: 0.9rem; color: var(--muted); line-height: 1.7; }

        /* ─── FAQ ─── */
        .faq-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 2.5rem;
          align-items: start;
        }

        .faq-list { display: flex; flex-direction: column; gap: 10px; }

        .faq-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .faq-question {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 1.4rem;
          cursor: pointer;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.92rem;
        }

        .faq-answer { padding: 0 1.4rem 1.2rem; font-size: 0.88rem; color: var(--muted); line-height: 1.7; }

        .faq-cta {
          background: var(--dark-bg);
          border-radius: var(--radius-lg);
          padding: 2.4rem 2rem;
          color: #fff;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100%;
        }

        .faq-cta-title { font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; margin-bottom: 0.8rem; line-height: 1.3; }
        .faq-cta-title em { color: var(--accent); font-style: normal; }
        .faq-cta-desc { font-size: 0.88rem; color: rgba(255,255,255,0.6); margin-bottom: 1.5rem; }

        /* ─── CONTACT ─── */
        .contact-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3rem;
          align-items: center;
        }

        .contact-bullets { display: flex; flex-direction: column; gap: 1rem; margin: 1.6rem 0 2rem; }
        .contact-bullet { display: flex; align-items: center; gap: 12px; font-size: 0.92rem; font-weight: 500; }
        .contact-bullet-icon {
          width: 32px; height: 32px;
          background: var(--accent-soft);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex: 0 0 auto;
        }

        .contact-info { display: flex; gap: 1.6rem; flex-wrap: wrap; margin-top: 1.5rem; }
        .contact-info-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--muted); }
        .contact-info-item span:first-child { color: var(--accent); }

        .phone-mock {
          background: var(--dark-bg);
          border-radius: 36px;
          padding: 14px;
          max-width: 280px;
          margin: 0 auto;
          box-shadow: 0 30px 70px rgba(0,0,0,0.25);
        }
        .phone-screen {
          background: var(--surface);
          border-radius: 24px;
          padding: 1.2rem;
          min-height: 340px;
        }
        .phone-bubble {
          background: var(--card);
          border-radius: 14px;
          padding: 0.7rem 1rem;
          font-size: 0.8rem;
          margin-bottom: 0.7rem;
          max-width: 80%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .phone-bubble.mine { background: var(--accent); color: #fff; margin-left: auto; }

        /* ─── FINAL CTA BANNER ─── */
        .final-cta {
          background: var(--dark-bg);
          border-radius: var(--radius-xl);
          margin: 0 5vw;
          width: calc(100% - 10vw);
          padding: 3rem 3rem;
          display: flex; align-items: center; justify-content: space-between; gap: 2rem;
          flex-wrap: wrap;
          color: #fff;
        }
        .final-cta-title { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.5rem, 2.6vw, 2.1rem); margin-bottom: 0.6rem; line-height: 1.25; }
        .final-cta-desc { font-size: 0.9rem; color: rgba(255,255,255,0.6); max-width: 420px; margin-bottom: 1.4rem; }

        .payment-card {
          background: #fff;
          color: #101913;
          border-radius: var(--radius-md);
          padding: 1rem 1.4rem;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .payment-icon { width: 38px; height: 38px; background: var(--accent-soft); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .payment-text strong { display: block; font-family: var(--font-display); font-size: 0.95rem; }
        .payment-text span { font-size: 0.75rem; color: var(--muted); }

        /* ─── FOOTER ─── */
        footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 3.5rem 5vw 2rem;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .footer-logo img { height: 30px; width: auto; margin-bottom: 0.8rem; }
        .footer-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.6; max-width: 260px; }

        .footer-col-title { font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; margin-bottom: 0.9rem; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
        .footer-links a { font-size: 0.85rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--accent); }

        .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
          font-size: 0.78rem;
          color: var(--muted);
        }
        .footer-bottom a { color: var(--accent); text-decoration: none; }

        /* ─── PROJECT MODAL ─── */
        .project-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 2rem;
        }
        .project-modal-content {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          max-width: 860px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;
        }
        .project-modal-close {
          position: absolute; top: 20px; right: 20px;
          background: rgba(0,0,0,0.5); color: #fff; border: none;
          width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center; z-index: 10;
        }
        .project-modal-image { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        .project-modal-info { padding: 2.2rem; }
        .project-modal-title { font-family: var(--font-display); font-size: 1.7rem; font-weight: 800; margin-bottom: 0.8rem; }
        .project-modal-meta { display: flex; gap: 0.8rem; margin-bottom: 1.2rem; font-size: 0.82rem; color: var(--muted); flex-wrap: wrap; }
        .project-modal-meta span { background: var(--surface); padding: 4px 12px; border-radius: 50px; border: 1px solid var(--border); }
        .project-modal-desc { font-size: 0.95rem; line-height: 1.7; color: var(--muted); margin-bottom: 1.6rem; }
        .project-modal-footer { display: flex; gap: 1rem; }

        /* ─── MOBILE ─── */
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .hero { grid-template-columns: 1fr; padding-top: 8rem; }
          .about-section { grid-template-columns: 1fr; }
          .portfolio-layout { grid-template-columns: 1fr; }
          .faq-layout { grid-template-columns: 1fr; }
          .contact-layout { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 600px) {
          section { padding: 3.5rem 5vw; }
          .hero-stats { gap: 1.3rem; }
          .final-cta { flex-direction: column; align-items: flex-start; padding: 2rem; }
          .footer-top { grid-template-columns: 1fr; }
          footer { padding: 2.5rem 5vw 1.5rem; }
        }
      `,
        }}
      />

      {/* NAV */}
      <nav>
        <Link href={"/"} className="justify-center">
          <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={80} alterW={120} />
        </Link>
        <ul className="nav-links">
          <li><a href="#hero">Início</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#portfolio">Portfólio</a></li>
          <li><a href="#processo">Processo</a></li>
          <li><a href="#depoimentos">Depoimentos</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="nav-actions">
          <button
            className="btn-theme"
            title="Alternar tema"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <a href="#contato" className="btn-cta">Começar projeto</a>
        </div>
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div>
          <div className="hero-eyebrow">{fullName}</div>
          <h1
            className="hero-title"
            dangerouslySetInnerHTML={{
              __html: hero?.title || "Páginas que ranqueiam no <em>Google</em> e transformam visitas em clientes.",
            }}
          />
          <p className="hero-desc">
            {hero?.subtitle ||
              "Design estratégico, performance e SEO para destacar sua marca e gerar resultados reais."}
          </p>

          <div className="hero-ctas">
            <a href="#contato" className="btn-cta">Começar meu projeto</a>
            <a href="#portfolio" className="btn-outline">Ver portfólio →</a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number"><ProjectsDelivered about={about || undefined} dark={theme === "dark"} /></div>
              <div className="stat-label">Projetos entregues</div>
            </div>
            <div className="stat-item">
              <div className="stat-number"><ExperienceTime about={about || undefined} dark={theme === "dark"} /></div>
              <div className="stat-label">No mercado</div>
            </div>
            <div className="stat-item">
              <div className="stat-number"><SatisfiedClients about={about || undefined} dark={theme === "dark"} /></div>
              <div className="stat-label">De satisfação</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Focados em resultados</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="browser-mock">
            <div className="browser-bar">
              <div className="browser-dot"></div>
              <div className="browser-dot"></div>
              <div className="browser-dot"></div>
              <span className="browser-label">{fullName}</span>
            </div>
            <div className="browser-content">
              <h3 className="browser-headline">
                Criamos marcas digitais que <em>se destacam</em>
              </h3>
              <p className="browser-sub">
                Estratégia, design e tecnologia para impulsionar marcas que lideram o futuro.
              </p>
              <span className="browser-btn">Ver projeto →</span>

              <div className="browser-thumbs">
                {[0, 1, 2, 3].map((idx) => {
                  const p = featuredProjects[idx];
                  return (
                    <div className="browser-thumb" key={idx}>
                      {p?.image ? (
                        <Image src={p.image} alt={p.title} width={160} height={210} />
                      ) : (
                        <div className="browser-thumb-empty">◻</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona">
        <div className="section-label">Como funciona</div>
        <h2 className="section-title">
          Antes da compra, o cliente passa pelo <em>Google</em>.
        </h2>
        <p className="section-desc">
          Seu site é o primeiro contato com o seu negócio. Ter uma presença digital profissional transmite confiança
          e aumenta as chances de fechar mais projetos.
        </p>
        <div className="feature-grid">
          {HOW_IT_WORKS.map((item, idx) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Sparkles;
            return (
              <div className="feature-card" key={idx}>
                <div className="feature-icon">
                  <Icon size={22} color="var(--accent)" />
                </div>
                <div className="feature-title">{item.title}</div>
                <div className="feature-desc">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROCESSO */}
      <section id="processo" className="process-section">
        <div className="section-label">Processo</div>
        <h2 className="section-title">
          Hoje a primeira parada é a <em>inteligência artificial</em>.
        </h2>
        <p className="section-desc">
          Criamos soluções modernas com tecnologia de ponta. Do planejamento ao lançamento, usamos IA para entregar
          sites mais rápidos, inteligentes e eficientes.
        </p>

        <div className="process-steps">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = (LucideIcons as any)[step.icon] || LucideIcons.Circle;
            return (
              <div className="process-step" key={idx}>
                <Icon size={22} color="var(--accent)" style={{ marginBottom: "0.8rem" }} />
                <div className="step-number">0{idx + 1}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="tech-row-label">Tecnologias que utilizamos</div>
        <div className="tech-row">
          {TECH_STACK.map((tech, idx) => (
            <div className="tech-chip" key={idx}>{tech}</div>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre">
        <div className="about-section">
          <div className="about-image-wrap">
            <Image
              src={userImage || hero?.backgroundImage || ""}
              alt={fullName}
              className="about-image"
              width={500}
              height={650}
            />
            <div className="about-badge">
              <div className="about-badge-icon">
                <LucideIcons.Star size={16} color="var(--accent)" />
              </div>
              <div className="about-badge-text">
                <strong><SatisfiedClients about={about || undefined} dark={false} /></strong>
                clientes satisfeitos
              </div>
            </div>
          </div>
          <div>
            <div className="about-label">Sobre {fullName}</div>
            <h2 className="about-title" dangerouslySetInnerHTML={{ __html: about?.title || `Oi, eu sou a <em>${fullName}</em>` }} />
            <div
              className="about-text"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  about?.description ||
                    "Apaixonado(a) por criar experiências que geram impacto. Transformo ideias em sites modernos, rápidos e que convertem visitantes em clientes."
                ),
              }}
            />
            <a href="#contato" className="btn-cta">Saiba mais sobre mim →</a>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos">
        <div className="section-label">Serviços</div>
        <h2 className="section-title">Soluções pra cada tipo de <em>negócio</em></h2>
        <p className="section-desc">
          Cada projeto é tratado com atenção aos detalhes e foco em resultados reais.
        </p>
        <div className="services-grid">
          {(about?.features?.length ? about.features : [
            { icon: "Building2", title: "Site Institucional", description: "Transmita credibilidade e profissionalismo com um site moderno e estratégico." },
            { icon: "ShoppingCart", title: "Loja Virtual", description: "Venda mais com um e-commerce seguro, rápido e otimizado para conversão." },
            { icon: "MessageSquare", title: "Landing Pages", description: "Páginas rápidas e focadas em resultados para campanhas e lançamentos." },
            { icon: "FileText", title: "Páginas de Vendas", description: "Estruturas persuasivas que aumentam suas conversões e maximizam o lucro." },
            { icon: "Layers", title: "Sites Sob Medida", description: "Projetos personalizados para atender necessidades específicas e se destacar." },
            { icon: "Search", title: "Otimização e SEO", description: "Seu site no topo do Google com SEO técnico, conteúdo estratégico e performance." },
          ]).map((service: any, idx: number) => {
            const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Layout;
            return (
              <div className="service-card" key={idx}>
                <div className="service-icon">
                  <Icon size={22} color="var(--accent)" />
                </div>
                <div>
                  <div className="service-title">{service.title}</div>
                  <div
                    className="service-desc"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio">
        <div className="section-label">Portfólio</div>
        <h2 className="section-title">Encontre o modelo de site que combina com <em>você</em></h2>
        <p className="section-desc">
          Explore projetos organizados por área de atuação e veja o que podemos criar para o seu negócio.
        </p>

        <div className="portfolio-layout">
          <div className="niche-list">
            {allCategories.filter((c) => c !== "Todos").length > 0 ? (
              allCategories
                .filter((c) => c !== "Todos")
                .map((cat) => (
                  <div
                    key={cat}
                    className={`niche-item ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat} <span>→</span>
                  </div>
                ))
            ) : (
              <div className="niche-item">Todos os projetos <span>→</span></div>
            )}
          </div>

          <div className="niche-preview">
            <div className="browser-bar">
              <div className="browser-dot"></div>
              <div className="browser-dot"></div>
              <div className="browser-dot"></div>
              <span className="browser-label">{activeCategory}</span>
            </div>
            <div className="niche-preview-content">
              <div className="niche-preview-title">
                Transformando ideias em marcas que conectam.
              </div>
              <div className="niche-preview-sub">
                Design pensado para conectar sua marca ao público certo.
              </div>
              <span className="browser-btn">Ver projetos →</span>
              <div className="niche-preview-thumbs">
                {[0, 1, 2, 3].map((idx) => {
                  const p = previewProjects[idx];
                  return (
                    <div
                      className="niche-thumb"
                      key={idx}
                      onClick={() => p && setSelectedProject(p)}
                      style={{ cursor: p ? "pointer" : "default" }}
                    >
                      {p?.image ? (
                        <Image src={p.image} alt={p.title} width={160} height={210} />
                      ) : (
                        <div className="browser-thumb-empty">◻</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="benefits-section">
        <div className="section-label">Benefícios</div>
        <h2 className="section-title">O que muda quando você tem um <em>site de verdade</em></h2>
        <div className="benefits-grid">
          {BENEFITS.map((b, idx) => {
            const Icon = (LucideIcons as any)[b.icon] || LucideIcons.Check;
            return (
              <div className="benefit-item" key={idx}>
                <div className="benefit-icon">
                  <Icon size={22} color="var(--accent)" />
                </div>
                <div className="benefit-title">{b.title}</div>
                <div className="benefit-desc">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos">
        <div className="section-label">Depoimentos</div>
        <h2 className="section-title">Profissionais que confiam no <em>nosso trabalho</em></h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div className="testimonial-card" key={testimonial._id || idx}>
              <div className="testimonial-header">
                <div className="author-avatar">
                  {testimonial.image ? (
                    <Image src={testimonial.image} alt={testimonial.name} width={44} height={44} />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div>
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
              <div className="testimonial-stars">{"★".repeat(testimonial.stars).padStart(5, "☆")}</div>
              <p className="testimonial-text">&quot;{testimonial.text}&quot;</p>
            </div>
          ))}
          {testimonials.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--muted)", gridColumn: "1 / -1" }}>
              Nenhum depoimento disponível no momento.
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="section-label">FAQ</div>
        <h2 className="section-title">Respostas pra começar <em>tranquilo</em></h2>

        <div className="faq-layout">
          <div className="faq-list">
            {FAQ_ITEMS.map((item, idx) => (
              <div className="faq-item" key={idx}>
                <div className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  {item.q}
                  <span>{openFaq === idx ? "−" : "+"}</span>
                </div>
                {openFaq === idx && <div className="faq-answer">{item.a}</div>}
              </div>
            ))}
          </div>

          <div className="faq-cta">
            <div className="faq-cta-title">
              Vamos colocar seu negócio na <em>primeira página</em>?
            </div>
            <p className="faq-cta-desc">
              Chegou a hora de transformar seu site em uma máquina de atrair clientes.
            </p>
            <a href="#contato" className="btn-cta">Começar meu projeto</a>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato">
        <div className="contact-layout">
          <div>
            <div className="section-label" style={{ textAlign: "left" }}>Contato</div>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Bora começar <em>o seu projeto</em>?
            </h2>

            <div className="contact-bullets">
              {CONTACT_BULLETS.map((b, idx) => {
                const Icon = (LucideIcons as any)[b.icon] || LucideIcons.Check;
                return (
                  <div className="contact-bullet" key={idx}>
                    <div className="contact-bullet-icon">
                      <Icon size={16} color="var(--accent)" />
                    </div>
                    {b.text}
                  </div>
                );
              })}
            </div>

            <div className="hero-ctas">
              <button onClick={() => setIsContactModalOpen(true)} className="btn-cta">
                ✉ Enviar mensagem
              </button>
              {contact?.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
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
                    {[contact.address.street, contact.address.city, contact.address.state].filter(Boolean).join(", ") ||
                      "Remoto"}
                  </span>
                </div>
              )}
              {contact?.availability && (
                <div className="contact-info-item">
                  <span>⏰</span>
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

          <div className="phone-mock">
            <div className="phone-screen">
              <div className="phone-bubble">Olá! Vi seu site e adorei o design 👋</div>
              <div className="phone-bubble mine">Que bom! Como posso te ajudar?</div>
              <div className="phone-bubble">Preciso de um orçamento para meu negócio</div>
              <div className="phone-bubble mine">Vamos conversar! Me conta mais sobre o projeto 🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ paddingBottom: "3rem" }}>
        <div className="final-cta">
          <div>
            <div className="final-cta-title">Vamos criar algo incrível juntos.</div>
            <p className="final-cta-desc">
              Seu próximo grande resultado começa com um site à altura da sua marca.
            </p>
            <button onClick={() => setIsContactModalOpen(true)} className="btn-cta">
              Falar com especialista
            </button>
          </div>
          <div className="payment-card">
            <div className="payment-icon">
              <LucideIcons.CheckCircle2 size={20} color="var(--accent)" />
            </div>
            <div className="payment-text">
              <strong>Projeto concluído</strong>
              <span>Site Institucional</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-logo">
              <Link href={"/"}>
                <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={80} alterW={120} />
              </Link>
            </div>
            <p className="footer-desc">
              Design estratégico e performance para sites que geram resultados reais.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Navegação</div>
            <ul className="footer-links">
              <li><a href="#hero">Início</a></li>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#servicos">Serviços</a></li>
              <li><a href="#portfolio">Portfólio</a></li>
              <li><a href="#processo">Processo</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Suporte</div>
            <ul className="footer-links">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#">Políticas de Privacidade</a></li>
              <li><a href="#">Termos de Uso</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Redes</div>
            <ul className="footer-links">
              <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              {contact?.whatsapp && (
                <li>
                  <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Portfólio criado com <a href="https://portify.art" target="_blank">Portify</a></span>
          <span>© {new Date().getFullYear()} {fullName}. Todos os direitos reservados.</span>
        </div>
      </footer>

      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="project-modal-close" onClick={() => setSelectedProject(null)}>✕</button>
            {selectedProject.image ? (
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                className="project-modal-image"
                width={900}
                height={500}
              />
            ) : (
              <div
                className="project-modal-image"
                style={{ background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}
              >
                🚀
              </div>
            )}
            <div className="project-modal-info">
              <h3 className="project-modal-title">{selectedProject.title}</h3>
              <div className="project-modal-meta">
                <span>📅 {selectedProject.year || ""}</span>
                <span>📁 {selectedProject.category || "Projeto"}</span>
                <span>🛠️ {selectedProject.tech?.join(", ") || "Tecnologias"}</span>
              </div>
              <div className="project-modal-desc">{selectedProject.description}</div>
              <div className="project-modal-footer">
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" className="btn-cta" style={{ textDecoration: "none" }}>
                    Visualizar Site →
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" className="btn-outline" style={{ textDecoration: "none" }}>
                    GitHub ↗
                  </a>
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
