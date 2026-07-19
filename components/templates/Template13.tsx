"use client";

import React, { useEffect, useMemo, useState } from "react";
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
          className="bg-[var(--cyan)] text-[#020817] px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-2 hover:brightness-110 transition-all cursor-pointer inline-block"
        >
          Mais...
        </button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#071228] text-white border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-white font-display uppercase">{title}</DialogTitle>
          </DialogHeader>
          <div
            className="text-sm leading-relaxed text-[var(--muted)]"
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

export default function Template13({ userId, categories, projects, userImage, userName }: TemplateProps) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [contact, setContact] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [visibleLimit, setVisibleLimit] = useState<number>(6);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

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
            } catch (error) {
              console.error(`JSON parse failed for ${end.key} (${end.url}):`, error);
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
  const profileImage = hero?.backgroundImage || userImage || "";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = `${fullName} | Portfolio profissional`;
    const description = `Portfolio de ${fullName}: projetos, servicos, depoimentos e contato profissional.`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [fullName]);

  const userProjects = useMemo(
    () => projects.filter((project) => project.userId === userId),
    [projects, userId]
  );

  const sortedProjects = useMemo(
    () => [...userProjects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [userProjects]
  );

  const featuredProjects = useMemo(() => {
    const featured = sortedProjects.filter((project) => project.isFeatured);
    const rest = sortedProjects.filter((project) => !project.isFeatured);
    return [...featured, ...rest].slice(0, 8);
  }, [sortedProjects]);

  const categoryNames = categories
    .map((category: any) => category?.name || category?.title)
    .filter(Boolean);

  const allCategories = ["Todos", ...Array.from(new Set([
    ...categoryNames,
    ...userProjects.map((project) => project.category).filter(Boolean),
  ]))];

  const filteredProjects = activeCategory === "Todos"
    ? sortedProjects
    : sortedProjects.filter((project) => project.category === activeCategory);

  const displayedProjects = filteredProjects.slice(0, visibleLimit);
  const hasMoreProjects = filteredProjects.length > visibleLimit;

  const techCounts = userProjects.reduce((acc, project) => {
    (project.tech || []).forEach((tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTech = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tech]) => tech);

  const fallbackServices = [
    {
      title: "Identidade Visual",
      description: "Logos, branding e sistemas visuais prontos para posicionar marcas com clareza.",
      icon: "Palette",
    },
    {
      title: "Design de Interfaces",
      description: "Websites, aplicativos e experiencias responsivas com foco em conversao.",
      icon: "LayoutDashboard",
    },
    {
      title: "Desenvolvimento No-Code",
      description: "Projetos em Webflow, Framer, Elementor e automacoes para acelerar entregas.",
      icon: "Code2",
    },
    {
      title: "Motion Graphics",
      description: "Animacoes, interacoes e detalhes visuais que deixam a marca memoravel.",
      icon: "Clapperboard",
    },
  ];

  const services = about?.features && about.features.length > 0 ? about.features : fallbackServices;

  const fallbackTestimonials = [
    {
      _id: "fallback-1",
      name: "Ana Luiza",
      role: "Gestora de Marketing",
      text: "Excelente profissional, entendeu nosso objetivo e entregou uma experiencia digital muito acima do esperado.",
      stars: 5,
      image: "",
    },
    {
      _id: "fallback-2",
      name: "Joao Pedro",
      role: "Fundador",
      text: "O projeto ficou bonito, rapido e estrategico. Tivemos mais clareza para apresentar a empresa aos clientes.",
      stars: 5,
      image: "",
    },
    {
      _id: "fallback-3",
      name: "Marina Costa",
      role: "Diretora Comercial",
      text: "A comunicacao foi objetiva e o resultado final trouxe mais autoridade para nossa presenca online.",
      stars: 5,
      image: "",
    },
  ] as Testimonial[];

  const visibleTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const addressText = contact?.address
    ? [contact.address.street, contact.address.city, contact.address.state].filter(Boolean).join(", ")
    : "";

  const whatsappUrl = contact?.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`
    : undefined;

  if (loading) {
    return (
      <div className="template13-wrapper">
        <style dangerouslySetInnerHTML={{ __html: `
          .template13-wrapper {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #020817;
            color: #dffcff;
            font-family: "Sora", "Poppins", sans-serif;
          }
          .t13-loader {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: 2px solid rgba(46, 240, 255, .18);
            border-top-color: #2ef0ff;
            animation: t13Spin 1s linear infinite;
            box-shadow: 0 0 32px rgba(46, 240, 255, .35);
          }
          @keyframes t13Spin { to { transform: rotate(360deg); } }
        ` }} />
        <div className="t13-loader" aria-label="Carregando" />
      </div>
    );
  }

  return (
    <div className="template13-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap');

        .template13-wrapper {
          --bg: #020817;
          --bg-deep: #050314;
          --panel: rgba(10, 24, 48, .64);
          --panel-strong: rgba(13, 31, 64, .82);
          --text: #f4fbff;
          --muted: #a8c7d6;
          --cyan: #2ef0ff;
          --cyan-soft: rgba(46, 240, 255, .16);
          --pink: #ff4fa3;
          --violet: #8f54ff;
          --green: #62ffd0;
          --border: rgba(83, 236, 255, .36);
          --shadow-cyan: 0 0 30px rgba(46, 240, 255, .28);
          --shadow-pink: 0 0 34px rgba(255, 79, 163, .26);
          min-height: 100vh;
          overflow-x: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 4% 7%, rgba(46, 240, 255, .38), transparent 23rem),
            radial-gradient(circle at 96% 4%, rgba(255, 79, 163, .28), transparent 24rem),
            radial-gradient(circle at 55% 45%, rgba(143, 84, 255, .18), transparent 28rem),
            linear-gradient(180deg, #06142b 0%, #020817 28%, #040512 100%);
          font-family: "Inter", sans-serif;
          line-height: 1.5;
        }

        .template13-wrapper *,
        .template13-wrapper *::before,
        .template13-wrapper *::after {
          box-sizing: border-box;
        }

        .template13-wrapper a {
          color: inherit;
          text-decoration: none;
        }

        .template13-wrapper button {
          font: inherit;
        }

        .t13-shell {
          width: min(1180px, calc(100% - 36px));
          margin: 48px auto 28px;
          position: relative;
          border: 1px solid rgba(221, 247, 255, .68);
          border-radius: 18px;
          background:
            linear-gradient(180deg, rgba(2, 5, 18, .94), rgba(2, 8, 23, .94)),
            linear-gradient(135deg, rgba(46, 240, 255, .1), rgba(255, 79, 163, .1));
          box-shadow:
            0 30px 90px rgba(0, 0, 0, .55),
            0 0 0 6px rgba(255, 255, 255, .08),
            0 0 65px rgba(46, 240, 255, .34);
          overflow: hidden;
        }

        .t13-shell::before {
          content: "";
          display: block;
          height: 45px;
          background: linear-gradient(180deg, #eef3f8, #cfd6df);
          border-bottom: 1px solid rgba(0, 0, 0, .22);
        }

        .t13-window-dots {
          position: absolute;
          top: 16px;
          left: 22px;
          display: flex;
          gap: 9px;
          z-index: 5;
        }

        .t13-window-dots span {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          display: block;
        }

        .t13-window-dots span:nth-child(1) { background: #ff6158; }
        .t13-window-dots span:nth-child(2) { background: #ffc130; }
        .t13-window-dots span:nth-child(3) { background: #27c93f; }

        .t13-window-bar {
          position: absolute;
          top: 13px;
          left: 36%;
          right: 28%;
          height: 17px;
          border-radius: 999px;
          background: rgba(173, 184, 199, .35);
          z-index: 4;
        }

        .t13-page {
          position: relative;
          padding: 30px 0 18px;
          background:
            radial-gradient(circle at 77% 12%, rgba(46, 240, 255, .2), transparent 19rem),
            radial-gradient(circle at 32% 43%, rgba(255, 79, 163, .15), transparent 20rem),
            linear-gradient(180deg, rgba(2, 7, 22, .98), rgba(2, 6, 18, .98));
        }

        .t13-page::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 76px 76px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,.45), transparent 70%);
        }

        .t13-inner {
          position: relative;
          z-index: 1;
          width: min(900px, calc(100% - 42px));
          margin: 0 auto;
        }

        .t13-nav {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 20px;
          min-height: 44px;
          margin-bottom: 58px;
        }

        .t13-logo {
          font-family: "Sora", sans-serif;
          font-weight: 800;
          font-size: clamp(1rem, 2vw, 1.25rem);
          letter-spacing: 0;
          background: linear-gradient(90deg, var(--pink), var(--cyan) 70%);
          -webkit-background-clip: text;
          color: transparent;
          width: fit-content;
        }

        .t13-menu {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          border: 1px solid rgba(118, 222, 255, .26);
          background: rgba(10, 17, 39, .72);
          box-shadow: inset 0 0 22px rgba(46, 240, 255, .12), var(--shadow-cyan);
          backdrop-filter: blur(18px);
        }

        .t13-menu a {
          padding: 8px 17px;
          border-radius: 999px;
          color: rgba(244, 251, 255, .86);
          font-size: .82rem;
          font-weight: 600;
          transition: .25s ease;
        }

        .t13-menu a:hover,
        .t13-menu a:first-child {
          color: #fff;
          background: linear-gradient(135deg, rgba(143, 84, 255, .9), rgba(46, 240, 255, .42));
          box-shadow: 0 0 18px rgba(255, 79, 163, .38);
        }

        .t13-socials {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .t13-socials a,
        .t13-mobile-toggle {
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(123, 239, 255, .28);
          background: linear-gradient(135deg, rgba(46, 240, 255, .3), rgba(255, 79, 163, .28));
          color: #fff;
          box-shadow: 0 0 18px rgba(46, 240, 255, .35);
          font-size: .68rem;
          font-weight: 800;
        }

        .t13-mobile-toggle {
          display: none;
          cursor: pointer;
        }

        .t13-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(260px, .88fr);
          align-items: center;
          gap: 52px;
          padding-bottom: 72px;
        }

        .t13-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--green);
          font-weight: 700;
          font-size: .88rem;
          margin-bottom: 15px;
        }

        .t13-kicker span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 18px var(--green);
        }

        .t13-hero h1 {
          font-family: "Sora", sans-serif;
          margin: 0;
          font-size: clamp(2.55rem, 5.4vw, 4.9rem);
          line-height: .96;
          letter-spacing: 0;
          color: #fff;
        }

        .t13-hero h1 strong {
          display: block;
          color: var(--cyan);
          text-shadow: 0 0 24px rgba(46, 240, 255, .42);
        }

        .t13-hero h1 span {
          display: block;
          font-weight: 500;
        }

        .t13-hero-copy {
          color: var(--muted);
          font-size: clamp(.98rem, 1.4vw, 1.12rem);
          max-width: 560px;
          margin: 18px 0 25px;
        }

        .t13-actions,
        .t13-contact-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .t13-primary,
        .t13-secondary {
          border: 0;
          min-height: 44px;
          border-radius: 999px;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          cursor: pointer;
          font-weight: 800;
          color: #fff;
          transition: .25s ease;
        }

        .t13-primary {
          background: linear-gradient(135deg, #795cff, #2ef0ff 48%, #ff4fa3);
          box-shadow: 0 0 18px rgba(46, 240, 255, .45), 0 12px 28px rgba(255, 79, 163, .25);
        }

        .t13-secondary {
          background: rgba(255, 255, 255, .06);
          border: 1px solid rgba(83, 236, 255, .32);
        }

        .t13-primary:hover,
        .t13-secondary:hover {
          transform: translateY(-2px);
          filter: saturate(1.2);
        }

        .t13-portrait-wrap {
          position: relative;
          min-height: 310px;
          display: grid;
          place-items: center;
          perspective: 900px;
        }

        .t13-orbit {
          position: absolute;
          width: 78%;
          aspect-ratio: 1;
          border-radius: 28%;
          border: 1px solid rgba(46, 240, 255, .2);
          transform: rotate(-10deg);
          box-shadow: inset 0 0 48px rgba(46, 240, 255, .12);
        }

        .t13-orbit::before,
        .t13-orbit::after {
          content: "";
          position: absolute;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: var(--pink);
          box-shadow: 0 0 20px var(--pink);
        }

        .t13-orbit::before { top: 10%; left: 4%; }
        .t13-orbit::after { right: 8%; bottom: 16%; background: var(--cyan); box-shadow: 0 0 22px var(--cyan); }

        .t13-portrait-card {
          position: relative;
          width: min(310px, 88%);
          aspect-ratio: 1.08 / .88;
          border-radius: 34px;
          padding: 11px;
          transform: rotate(7deg) rotateY(-10deg);
          background: linear-gradient(135deg, rgba(46, 240, 255, .9), rgba(143, 84, 255, .85) 52%, rgba(255, 79, 163, .9));
          box-shadow: 0 24px 60px rgba(0, 0, 0, .52), 0 0 44px rgba(46, 240, 255, .46);
        }

        .t13-portrait-card::after {
          content: "";
          position: absolute;
          inset: 13px -13px -13px 13px;
          border-radius: 34px;
          border: 2px solid rgba(46, 240, 255, .48);
          z-index: -1;
        }

        .t13-portrait-card img,
        .t13-portrait-fallback {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 35% 25%, rgba(46, 240, 255, .32), rgba(143, 84, 255, .42)), #11182f;
          color: var(--cyan);
          font-family: "Sora", sans-serif;
          font-size: 4rem;
          font-weight: 800;
        }

        .t13-section {
          padding: 34px 0 72px;
        }

        .t13-section-title {
          font-family: "Sora", sans-serif;
          text-align: center;
          font-size: clamp(2rem, 3.6vw, 3rem);
          line-height: 1;
          margin: 0 0 30px;
          color: #f8f3ff;
          text-shadow: 0 0 20px rgba(46, 240, 255, .2);
        }

        .t13-section-title span {
          color: var(--cyan);
        }

        .t13-section-lead {
          max-width: 640px;
          margin: -14px auto 32px;
          text-align: center;
          color: var(--muted);
        }

        .t13-services {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 22px;
          justify-content: center;
        }

        .t13-service-card,
        .t13-project-card,
        .t13-testimonial,
        .t13-blog-card,
        .t13-contact-card {
          position: relative;
          border: 1px solid var(--border);
          background:
            linear-gradient(145deg, rgba(46, 240, 255, .12), transparent 36%),
            linear-gradient(315deg, rgba(255, 79, 163, .22), transparent 38%),
            rgba(9, 25, 48, .72);
          box-shadow: inset 0 0 24px rgba(255, 255, 255, .04), 0 0 24px rgba(46, 240, 255, .16);
          backdrop-filter: blur(18px);
        }

        .t13-service-card {
          min-height: 210px;
          padding: 26px 18px;
          border-radius: 14px;
          text-align: center;
          overflow: hidden;
        }

        .t13-service-card::before,
        .t13-project-card::before,
        .t13-testimonial::before,
        .t13-contact-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(46, 240, 255, .38), transparent 42%, rgba(255, 79, 163, .44));
          opacity: .55;
          pointer-events: none;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          padding: 1px;
        }

        .t13-service-icon {
          width: 62px;
          height: 62px;
          margin: 0 auto 15px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          color: #fff;
          background: linear-gradient(135deg, rgba(46, 240, 255, .55), rgba(143, 84, 255, .72), rgba(255, 79, 163, .65));
          box-shadow: 0 0 22px rgba(46, 240, 255, .4);
        }

        .t13-service-card h3 {
          font-family: "Sora", sans-serif;
          font-size: 1.02rem;
          line-height: 1.1;
          margin: 0 0 9px;
        }

        .t13-service-card p,
        .t13-service-desc {
          color: rgba(231, 247, 255, .76);
          font-size: .88rem;
          line-height: 1.4;
          text-align: justify;
        }

        .t13-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          margin: 0 auto 44px;
          max-width: 740px;
        }

        .t13-stat {
          padding: 15px 18px;
          border-radius: 14px;
          border: 1px solid rgba(46, 240, 255, .24);
          background: rgba(4, 15, 34, .72);
          color: var(--cyan);
          text-align: center;
          box-shadow: inset 0 0 18px rgba(46, 240, 255, .08);
        }

        .t13-project-strip {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(235px, 1fr);
          gap: 24px;
          overflow-x: auto;
          padding: 8px 0 24px;
          scroll-snap-type: x proximity;
        }

        .t13-project-strip::-webkit-scrollbar,
        .t13-tabs::-webkit-scrollbar {
          height: 6px;
        }

        .t13-project-strip::-webkit-scrollbar-thumb,
        .t13-tabs::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, var(--cyan), var(--pink));
          border-radius: 999px;
        }

        .t13-project-card {
          border-radius: 12px;
          min-height: 178px;
          overflow: hidden;
          scroll-snap-align: center;
          cursor: pointer;
        }

        .t13-project-thumb {
          height: 104px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(46, 240, 255, .28), rgba(255, 79, 163, .2));
        }

        .t13-project-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .t13-project-placeholder {
          height: 100%;
          display: grid;
          place-items: center;
          color: var(--cyan);
        }

        .t13-project-body {
          padding: 13px 14px 12px;
        }

        .t13-project-body h3 {
          margin: 0 0 6px;
          font-family: "Sora", sans-serif;
          font-size: 1rem;
          line-height: 1.15;
        }

        .t13-project-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: var(--cyan);
          font-size: .8rem;
          font-weight: 800;
        }

        .t13-project-meta span:last-child {
          width: 28px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(46, 240, 255, .35), rgba(255, 79, 163, .62));
        }

        .t13-tabs {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 0 22px;
          margin-top: 8px;
        }

        .t13-tab {
          flex: 0 0 auto;
          border: 1px solid rgba(83, 236, 255, .32);
          border-radius: 999px;
          background: rgba(255, 255, 255, .04);
          color: var(--muted);
          padding: 9px 16px;
          cursor: pointer;
          font-weight: 700;
          transition: .25s ease;
        }

        .t13-tab.active,
        .t13-tab:hover {
          color: #fff;
          background: linear-gradient(135deg, rgba(143, 84, 255, .82), rgba(46, 240, 255, .32));
          box-shadow: 0 0 18px rgba(46, 240, 255, .25);
        }

        .t13-filter-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 8px;
        }

        .t13-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          align-items: stretch;
        }

        .t13-testimonial {
          border-radius: 14px;
          padding: 24px 20px;
          min-height: 184px;
          transform: rotate(var(--tilt, 0deg));
        }

        .t13-quote {
          color: var(--cyan);
          font-family: Georgia, serif;
          font-size: 2.1rem;
          line-height: 1;
        }

        .t13-testimonial p {
          margin: 5px 0 18px;
          color: rgba(244, 251, 255, .86);
          font-size: .93rem;
        }

        .t13-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .t13-author img,
        .t13-author-fallback {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(46, 240, 255, .7);
          background: linear-gradient(135deg, var(--cyan), var(--pink));
          display: grid;
          place-items: center;
          font-weight: 800;
          color: #06111f;
        }

        .t13-author strong {
          display: block;
          color: var(--cyan);
          font-size: .88rem;
        }

        .t13-author span {
          color: var(--muted);
          font-size: .78rem;
        }

        .t13-about-grid {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 38px;
          align-items: center;
        }

        .t13-about-media {
          position: relative;
          min-height: 380px;
        }

        .t13-about-photo {
          width: min(310px, 88%);
          aspect-ratio: 4 / 5;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(46, 240, 255, .5);
          box-shadow: 0 0 36px rgba(46, 240, 255, .24), 0 0 70px rgba(255, 79, 163, .2);
          background: rgba(255,255,255,.04);
        }

        .t13-about-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        .t13-about-float {
          position: absolute;
          right: 0;
          bottom: 18px;
          width: 190px;
          padding: 17px;
          border-radius: 18px;
          border: 1px solid rgba(255, 79, 163, .42);
          background: rgba(9, 24, 47, .8);
          box-shadow: var(--shadow-pink);
        }

        .t13-about-float strong {
          display: block;
          color: var(--cyan);
          font-family: "Sora", sans-serif;
          margin-bottom: 5px;
        }

        .t13-about-content h2 {
          text-align: left;
          margin-bottom: 20px;
        }

        .t13-about-text {
          color: rgba(231, 247, 255, .8);
          margin-bottom: 22px;
        }

        .t13-chip-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .t13-chip {
          border: 1px solid rgba(46, 240, 255, .25);
          border-radius: 999px;
          padding: 8px 13px;
          background: rgba(46, 240, 255, .07);
          color: rgba(244, 251, 255, .9);
          font-size: .85rem;
          font-weight: 700;
        }

        .t13-blog-row {
          display: grid;
          grid-template-columns: .72fr 1.15fr 1fr;
          gap: 18px;
          align-items: stretch;
        }

        .t13-blog-title {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }

        .t13-blog-title h2 {
          text-align: left;
          margin-bottom: 18px;
        }

        .t13-blog-card {
          border-radius: 12px;
          min-height: 136px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .t13-blog-card.featured {
          background: #efe9ff;
          color: #16192e;
          overflow: hidden;
        }

        .t13-blog-card small {
          width: fit-content;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(46, 240, 255, .12);
          color: var(--cyan);
          font-weight: 800;
        }

        .t13-blog-card.featured small {
          color: #794cff;
          background: rgba(121, 76, 255, .12);
        }

        .t13-blog-card h3 {
          margin: 8px 0 7px;
          font-family: "Sora", sans-serif;
          font-size: 1.18rem;
          line-height: 1.1;
        }

        .t13-blog-card p {
          margin: 0;
          color: rgba(231, 247, 255, .72);
          font-size: .86rem;
        }

        .t13-blog-card.featured p {
          color: rgba(22, 25, 46, .72);
        }

        .t13-contact-card {
          border-radius: 14px;
          padding: 26px;
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 24px;
          background:
            linear-gradient(135deg, rgba(46, 240, 255, .32), transparent 35%),
            linear-gradient(315deg, rgba(255, 79, 163, .45), transparent 39%),
            rgba(10, 24, 48, .86);
        }

        .t13-contact-card h2 {
          font-family: "Sora", sans-serif;
          color: var(--cyan);
          margin: 0 0 12px;
        }

        .t13-contact-list {
          display: grid;
          gap: 10px;
          color: rgba(244, 251, 255, .86);
        }

        .t13-contact-item {
          display: flex;
          gap: 9px;
          align-items: center;
        }

        .t13-contact-nav {
          display: grid;
          justify-items: start;
          gap: 9px;
          align-content: center;
        }

        .t13-footer {
          padding: 22px 0 0;
          text-align: center;
          color: rgba(244, 251, 255, .62);
          font-size: .82rem;
        }

        .t13-footer-brand {
          display: flex;
          justify-content: center;
          margin-top: 12px;
        }

        .t13-load-more {
          margin: 24px auto 0;
          display: flex;
        }

        .t13-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          padding: 24px;
          display: grid;
          place-items: center;
          background: rgba(0, 4, 16, .78);
          backdrop-filter: blur(12px);
        }

        .t13-modal {
          width: min(880px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 18px;
          border: 1px solid rgba(46, 240, 255, .38);
          background: #071228;
          box-shadow: 0 0 44px rgba(46, 240, 255, .28);
          position: relative;
        }

        .t13-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(0,0,0,.42);
          color: #fff;
          cursor: pointer;
          z-index: 2;
        }

        .t13-modal-image {
          width: 100%;
          height: min(46vh, 390px);
          object-fit: cover;
          display: block;
          background: rgba(46, 240, 255, .08);
        }

        .t13-modal-info {
          padding: 26px;
        }

        .t13-modal-info h3 {
          margin: 0 0 10px;
          font-family: "Sora", sans-serif;
          font-size: 1.8rem;
        }

        .t13-modal-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          color: var(--cyan);
          font-size: .85rem;
          margin-bottom: 16px;
        }

        .t13-modal-desc {
          color: rgba(244, 251, 255, .78);
          margin-bottom: 20px;
        }

        @media (max-width: 960px) {
          .t13-shell {
            margin-top: 24px;
            width: min(100% - 24px, 760px);
          }

          .t13-inner {
            width: min(100% - 32px, 680px);
          }

          .t13-nav {
            grid-template-columns: 1fr auto;
            margin-bottom: 42px;
          }

          .t13-mobile-toggle {
            display: inline-flex;
          }

          .t13-menu {
            position: absolute;
            left: 16px;
            right: 16px;
            top: 82px;
            display: none;
            flex-direction: column;
            border-radius: 18px;
            padding: 12px;
          }

          .t13-menu.open {
            display: flex;
          }

          .t13-menu a {
            width: 100%;
            text-align: center;
          }

          .t13-socials {
            display: none;
          }

          .t13-hero,
          .t13-about-grid,
          .t13-contact-card,
          .t13-blog-row {
            grid-template-columns: 1fr;
          }

          .t13-hero {
            gap: 28px;
          }

          .t13-portrait-wrap {
            min-height: 285px;
          }

          .t13-services,
          .t13-testimonials-grid,
          .t13-filter-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .t13-blog-title h2,
          .t13-about-content h2 {
            text-align: center;
          }
        }

        @media (max-width: 620px) {
          .t13-shell {
            margin: 12px auto;
            border-radius: 14px;
          }

          .t13-shell::before {
            height: 38px;
          }

          .t13-window-dots {
            top: 13px;
            left: 16px;
          }

          .t13-window-bar {
            left: 34%;
            right: 12%;
            top: 11px;
          }

          .t13-page {
            padding-top: 24px;
          }

          .t13-hero h1 {
            font-size: clamp(2.35rem, 13vw, 3.8rem);
          }

          .t13-services,
          .t13-testimonials-grid,
          .t13-filter-grid,
          .t13-stats {
            grid-template-columns: 1fr;
          }

          .t13-section {
            padding-bottom: 58px;
          }

          .t13-about-media {
            min-height: 320px;
          }

          .t13-about-float {
            position: relative;
            width: 100%;
            margin-top: 16px;
            right: auto;
            bottom: auto;
          }

          .t13-actions,
          .t13-contact-actions {
            align-items: stretch;
          }

          .t13-primary,
          .t13-secondary {
            width: 100%;
          }
        }
      ` }} />

      <div className="t13-shell">
        <div className="t13-window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="t13-window-bar" aria-hidden="true" />

        <main className="t13-page">
          <div className="t13-inner">
            <nav className="t13-nav" aria-label="Principal">
              <a href="#inicio" className="t13-logo">{fullName}</a>
              <div className={`t13-menu ${isMenuOpen ? "open" : ""}`}>
                <a href="#inicio" onClick={() => setIsMenuOpen(false)}>Inicio</a>
                <a href="#portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</a>
                <a href="#sobre" onClick={() => setIsMenuOpen(false)}>Sobre</a>
                <a href="#contato" onClick={() => setIsMenuOpen(false)}>Contato</a>
              </div>
              <div className="t13-socials" aria-label="Redes sociais">
                <a href={contact?.behance || "#"} title="Behance">Be</a>
                <a href={contact?.linkedin || "#"} title="LinkedIn">in</a>
                <a href={contact?.instagram || "#"} title="Instagram">Ig</a>
              </div>
              <button className="t13-mobile-toggle" onClick={() => setIsMenuOpen((value) => !value)} aria-label="Abrir menu">
                <LucideIcons.Menu size={16} />
              </button>
            </nav>

            <section className="t13-hero" id="inicio">
              <div>
                <div className="t13-kicker"><span /> {addressText || "Portfolio profissional"}</div>
                <h1>
                  <strong>Criador de experiencias digitais.</strong>
                  <span>{fullName}</span>
                </h1>
                <p className="t13-hero-copy">
                  Transformo ideias em presenca digital de alto impacto, combinando estrategia, design e execucao para gerar resultados reais.
                </p>
                <div className="t13-actions">
                  <a href="#portfolio" className="t13-primary">
                    Ver Portfolio <LucideIcons.ArrowRight size={18} />
                  </a>
                  {whatsappUrl ? (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="t13-secondary">
                      Falar no WhatsApp
                    </a>
                  ) : (
                    <button className="t13-secondary" onClick={() => setIsContactModalOpen(true)}>
                      Pedir orcamento
                    </button>
                  )}
                </div>
              </div>

              <div className="t13-portrait-wrap">
                <div className="t13-orbit" aria-hidden="true" />
                <div className="t13-portrait-card">
                  {profileImage ? (
                    <Image src={profileImage} alt={fullName} width={310} height={350} />
                  ) : (
                    <div className="t13-portrait-fallback">{fullName.charAt(0)}</div>
                  )}
                </div>
              </div>
            </section>

            <section className="t13-section" id="servicos">
              <h2 className="t13-section-title">Habili<span>dades</span></h2>
              <div className="t13-stats">
                <div className="t13-stat"><ProjectsDelivered about={about || undefined} dark={true} /></div>
                <div className="t13-stat"><SatisfiedClients about={about || undefined} dark={true} /></div>
                <div className="t13-stat"><ExperienceTime about={about || undefined} dark={true} /></div>
              </div>
              <div className="t13-services">
                {services.slice(0, 4).map((service: any, idx) => {
                  const Icon = (LucideIcons as any)[service.icon] || [LucideIcons.Palette, LucideIcons.LayoutDashboard, LucideIcons.Code2, LucideIcons.Clapperboard][idx % 4];
                  const rawDesc = service.description || "";
                  const plainText = rawDesc.replace(/<[^>]*>/g, ' ');
                  const words = plainText.trim().split(/\s+/);
                  const isLong = words.length > 80;
                  const truncatedText = isLong ? words.slice(0, 80).join(' ') + '...' : rawDesc;

                  return (
                    <article className="t13-service-card" key={`${service.title}-${idx}`}>
                      <div className="t13-service-icon"><Icon size={30} /></div>
                      <h3>{service.title}</h3>
                      <div className="t13-service-desc">
                        <ExpandableText
                          text={rawDesc}
                          title={service.title}
                          className="opacity-80"
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {featuredProjects.length > 0 && (
              <section className="t13-section" id="portfolio">
                <h2 className="t13-section-title">Projetos em <span>Destaque</span></h2>
                <div className="t13-project-strip">
                  {featuredProjects.map((project, idx) => (
                    <article className="t13-project-card" key={project._id || idx} onClick={() => setSelectedProject(project)}>
                      <div className="t13-project-thumb">
                        {project.image ? (
                          <Image src={project.image} alt={project.title} width={520} height={300} />
                        ) : (
                          <div className="t13-project-placeholder"><LucideIcons.Sparkles size={34} /></div>
                        )}
                      </div>
                      <div className="t13-project-body">
                        <h3>{project.title}</h3>
                        <div className="t13-project-meta">
                          <span>{project.category || "Resultados"}</span>
                          <span><LucideIcons.ArrowRight size={14} /></span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="t13-tabs">
                  {allCategories.map((category) => (
                    <button
                      className={`t13-tab ${activeCategory === category ? "active" : ""}`}
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setVisibleLimit(6);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="t13-filter-grid">
                  {displayedProjects.map((project, idx) => (
                    <article className="t13-project-card" key={project._id || `filtered-${idx}`} onClick={() => setSelectedProject(project)}>
                      <div className="t13-project-thumb">
                        {project.image ? (
                          <Image src={project.image} alt={project.title} width={520} height={300} />
                        ) : (
                          <div className="t13-project-placeholder"><LucideIcons.ImageIcon size={34} /></div>
                        )}
                      </div>
                      <div className="t13-project-body">
                        <h3>{project.title}</h3>
                        <div className="t13-project-meta">
                          <span>{project.year || project.category || "Projeto"}</span>
                          <span><LucideIcons.ArrowRight size={14} /></span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {hasMoreProjects && (
                  <button className="t13-primary t13-load-more" onClick={() => setVisibleLimit((value) => value + 6)}>
                    Exibir mais projetos
                  </button>
                )}
              </section>
            )}

            <section className="t13-section" id="depoimentos">
              <h2 className="t13-section-title">Depoi<span>mentos</span></h2>
              <div className="t13-testimonials-grid">
                {visibleTestimonials.slice(0, 3).map((testimonial, idx) => (
                  <article className="t13-testimonial" style={{ "--tilt": `${idx === 1 ? 1.2 : idx === 2 ? -1.1 : 0}deg` } as React.CSSProperties} key={testimonial._id || idx}>
                    <div className="t13-quote">&quot;</div>
                    <p>{testimonial.text}</p>
                    <div className="t13-author">
                      {testimonial.image ? (
                        <Image src={testimonial.image} alt={testimonial.name} width={44} height={44} />
                      ) : (
                        <div className="t13-author-fallback">{testimonial.name?.charAt(0) || "C"}</div>
                      )}
                      <div>
                        <strong>{testimonial.name}</strong>
                        <span>{testimonial.role}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="t13-section" id="sobre">
              <div className="t13-about-grid">
                <div className="t13-about-media">
                  <div className="t13-about-photo">
                    {profileImage ? (
                      <Image src={profileImage} alt={fullName} width={310} height={350} />
                    ) : (
                      <div className="t13-portrait-fallback">{fullName.charAt(0)}</div>
                    )}
                  </div>
                  <div className="t13-about-float">
                    <strong>Design focado em resultados</strong>
                    <span>Processo claro, visual marcante e entrega orientada a crescimento.</span>
                  </div>
                </div>
                <div className="t13-about-content">
                  <h2
                    className="t13-section-title"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about?.title || "Sobre Mim") }}
                  />
                  <ExpandableText
                    text={about?.description || "Atuo na criacao de experiencias digitais completas para profissionais e empresas que querem se posicionar melhor, vender com mais clareza e transmitir autoridade em cada ponto de contato."}
                    title="Sobre Mim"
                    className="t13-about-text"
                  />
                  <div className="t13-chip-list">
                    {(sortedTech.length > 0 ? sortedTech : ["Branding", "Web Design", "UX/UI", "Automacoes"]).slice(0, 8).map((tech) => (
                      <span className="t13-chip" key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="t13-section" id="insights">
              <div className="t13-blog-row">
                <div className="t13-blog-title">
                  <h2 className="t13-section-title">Insights<br />&amp; Blog</h2>
                  <a href="#contato" className="t13-primary">Ver post</a>
                </div>
                <article className="t13-blog-card featured">
                  <small>Conteudo</small>
                  <h3>Design Thinking</h3>
                  <p>Estrutura, criatividade e validacao para transformar ideias em experiencias digitais uteis.</p>
                </article>
                <article className="t13-blog-card">
                  <small>Recente post</small>
                  <h3>Como um portfolio vende antes da primeira reuniao</h3>
                  <p>Clareza visual, prova de resultado e posicionamento criam confianca desde o primeiro clique.</p>
                </article>
              </div>
            </section>

            <section className="t13-section" id="contato">
              <div className="t13-contact-card">
                <div>
                  <h2>Contacts</h2>
                  <div className="t13-contact-list">
                    {contact?.email && (
                      <a className="t13-contact-item" href={`mailto:${contact.email}`}>
                        <LucideIcons.Mail size={17} /> {contact.email}
                      </a>
                    )}
                    {addressText && (
                      <span className="t13-contact-item">
                        <LucideIcons.MapPin size={17} /> {addressText}
                      </span>
                    )}
                    {contact?.availability && (
                      <span className="t13-contact-item">
                        <LucideIcons.Clock size={17} /> {contact.availability}
                      </span>
                    )}
                  </div>
                  <div className="t13-contact-actions" style={{ marginTop: 18 }}>
                    {whatsappUrl && (
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="t13-primary">
                        Falar no WhatsApp
                      </a>
                    )}
                    <button className="t13-secondary" onClick={() => setIsContactModalOpen(true)}>
                      Pedir orcamento
                    </button>
                  </div>
                </div>
                <div className="t13-contact-nav">
                  <a className="t13-contact-item" href="#inicio"><LucideIcons.Home size={16} /> Inicio</a>
                  <a className="t13-contact-item" href={contact?.behance || "#"}><LucideIcons.CircleDot size={16} /> Behance</a>
                  <a className="t13-contact-item" href={contact?.linkedin || "#"}><LucideIcons.Linkedin size={16} /> LinkedIn</a>
                  <a className="t13-contact-item" href={contact?.instagram || "#"}><LucideIcons.Instagram size={16} /> Instagram</a>
                </div>
              </div>

              <footer className="t13-footer">
                <div>(c) {new Date().getFullYear()} {fullName}. Todos os direitos reservados.</div>
                <div className="t13-footer-brand">
                  <Link href="/">
                    <Logo alterIcon="/images/logo_nova_txt_g_dark.png" alterH={54} alterW={92} />
                  </Link>
                </div>
              </footer>
            </section>
          </div>
        </main>
      </div>

      {selectedProject && (
        <div className="t13-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="t13-modal" onClick={(event) => event.stopPropagation()}>
            <button className="t13-modal-close" onClick={() => setSelectedProject(null)}>x</button>
            {selectedProject.image ? (
              <Image src={selectedProject.image} alt={selectedProject.title} className="t13-modal-image" width={920} height={520} />
            ) : (
              <div className="t13-modal-image" style={{ display: "grid", placeItems: "center" }}>
                <LucideIcons.Sparkles size={54} color="var(--cyan)" />
              </div>
            )}
            <div className="t13-modal-info">
              <h3>{selectedProject.title}</h3>
              <div className="t13-modal-meta">
                <span>{selectedProject.year || "Projeto"}</span>
                <span>{selectedProject.category || "Portfolio"}</span>
                <span>{selectedProject.tech?.join(", ") || "Tecnologias"}</span>
              </div>
              <div className="t13-modal-desc">{selectedProject.description}</div>
              <div className="t13-actions">
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="t13-primary">
                    Visualizar Site <LucideIcons.ExternalLink size={16} />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="t13-secondary">
                    GitHub <LucideIcons.ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedService && (
        <div className="t13-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="t13-modal" onClick={(event) => event.stopPropagation()}>
            <button className="t13-modal-close" onClick={() => setSelectedService(null)}>x</button>
            <div className="t13-modal-info">
              <h3>{selectedService.title}</h3>
              <div
                className="t13-modal-desc"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedService.description || "") }}
              />
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
