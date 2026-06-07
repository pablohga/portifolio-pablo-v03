"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
const HERO_DARK = "https://agenciaaimagic.com.br/portify/hero_img_dark.png"
const HERO_LIGHT = "https://agenciaaimagic.com.br/portify/hero_img_light.png"
const LOGO_DARK = "https://agenciaaimagic.com.br/portify/logo_nova_txt_m_dark.png"
const LOGO_LIGHT = "https://agenciaaimagic.com.br/portify/logo_nova_txt_g_light.png"
// ── Tokens ───────────────────────────────────────────────────────────────────
const DARK = {
  bgPrimary: "#1E1F25",
  bgSecondary: "#252730",
  heroBg: "#1E1F25",
  heroOverlay: "#071B3B",
  navbar: "#20222B",
  card: "#2A2D36",
  border: "#5A6778",
  primary: "#A6E7FF",
  primaryHover: "#8DE5FF",
  primaryGlow: "#7EDCFF",
  textPrimary: "#FFFFFF",
  textSecondary: "#D6D6D6",
  textMuted: "#A1A1AA",
  iconLight: "#DDF6FF",
};
const LIGHT = {
  bgPrimary: "#F5F5F5",
  bgSecondary: "#FFFFFF",
  heroBg: "#F8F7F5",
  card: "#FFFFFF",
  border: "#E8E8E8",
  primary: "#A6E7FF",
  primaryHover: "#8DDBF5",
  primarySoft: "#D8F5FF",
  textPrimary: "#4B4B4B",
  textSecondary: "#7B7B7B",
  textMuted: "#AFAFAF",
};

// ── Hook: useInView ───────────────────────────────────────────────────────────
function useInView<T extends HTMLElement = HTMLElement>(options: IntersectionObserverInit = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.12, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
}

// ── AnimatedSection ───────────────────────────────────────────────────────────
interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Icons (SVG inline) ────────────────────────────────────────────────────────
const Icon = ({ d, size = 22, color = "currentColor" }: { d: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  free: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  seo: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  fast: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  secure: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  templates: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  config: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  clients: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  finance: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  projects: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  invoices: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  reports: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  check: "M5 13l4 4L19 7",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  arrow: "M5 12h14M12 5l7 7-7 7",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 18L18 6M6 6l12 12",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
};

// ── Navbar ────────────────────────────────────────────────────────────────────
type NavbarProps = { dark: boolean; toggle: () => void };
function Navbar({ dark, toggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const c = dark ? DARK : LIGHT;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Início", "Recursos", "Planos", "Suporte"];

  return (
    <>
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled
        ? dark ? "rgba(32,34,43,0.97)" : "rgba(255,255,255,0.97)"
        : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${dark ? "rgba(90,103,120,0.3)" : "rgba(0,0,0,0.08)"}` : "none",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        <img src={dark ? LOGO_DARK : LOGO_LIGHT} alt="Portify" style={{ height: 28, objectFit: "contain" }} />

        
        <div style={{ display: "flex", alignItems: "center", gap: 32, fontFamily: "Poppins, sans-serif" }} className="desktop-nav">
          {links.map(l => (
            <a key={l} href="#" style={{
              color: c.textSecondary, textDecoration: "none", fontSize: 14, fontWeight: 500,
              transition: "color 0.2s",
            }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = c.primary}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = c.textSecondary}
            >
              {l}
            </a>
          ))}
          <button onClick={toggle} style={{
            background: "none", border: "none", cursor: "pointer",
            color: c.textSecondary, padding: 6, borderRadius: 6,
            display: "flex", alignItems: "center",
          }}>
            <Icon d={dark ? ICONS.sun : ICONS.moon} size={18} color={c.textSecondary} />
          </button>
          <a href="#" style={{
            color: c.textSecondary, textDecoration: "none", fontSize: 14,
            fontFamily: "Poppins, sans-serif", fontWeight: 500,
          }}>Entrar</a>
          <a href="#" style={{
            background: `linear-gradient(135deg, ${c.primary}, ${dark ? DARK.primaryGlow : "#8DDBF5"})`,
            color: "#1B1B1B", textDecoration: "none", fontSize: 13, fontWeight: 600,
            fontFamily: "Poppins, sans-serif", padding: "9px 20px", borderRadius: 8,
            boxShadow: `0 0 16px rgba(166,231,255,0.3)`,
          }}>Cadastrar-se</a>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{
            background: "none", border: "none", cursor: "pointer", display: "none",
            color: c.textPrimary, padding: 4,
          }} className="mobile-menu-btn">
            <Icon d={mobileOpen ? ICONS.close : ICONS.menu} size={22} color={c.textPrimary} />
          </button>
        </div>
      </div>
      
      {mobileOpen && (
        <div style={{
          background: dark ? DARK.navbar : "#fff",
          borderTop: `1px solid ${dark ? DARK.border : "#eee"}`,
          padding: "16px 24px 20px",
        }}>
          {links.map(l => (
            <div key={l} style={{ padding: "10px 0", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#f0f0f0"}` }}>
              <a href="#" style={{ color: c.textPrimary, textDecoration: "none", fontFamily: "Poppins, sans-serif", fontSize: 15 }}>{l}</a>
            </div>
          ))}
        </div>
      )}
    </nav>
    </>
  );
}

// ── HeroSection ───────────────────────────────────────────────────────────────
function HeroSection({ dark }: { dark: boolean }) {
  const c = dark ? DARK : LIGHT;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
      overflow: "hidden",
      background: dark ? c.bgPrimary : c.bgSecondary,
    }}>
      {/* Hero image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${dark ? HERO_DARK : HERO_LIGHT})`,
        backgroundSize: "cover", backgroundPosition: "center right",
        opacity: 1,
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: dark
          ? "linear-gradient(90deg, #071B3B 0%, rgba(7,27,59,0.82) 40%, rgba(7,27,59,0.15) 70%, transparent 100%)"
          : "linear-gradient(90deg, rgba(248,247,245,1) 0%, rgba(248,247,245,0.92) 40%, rgba(248,247,245,0.5) 65%, transparent 100%)",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%" }}>
        <div style={{ maxWidth: 620 }}>
          {/* Badge */}
          {/* <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: dark ? "rgba(166,231,255,0.1)" : "rgba(166,231,255,0.2)",
            border: `1px solid ${dark ? "rgba(166,231,255,0.25)" : "rgba(166,231,255,0.5)"}`,
            borderRadius: 100, padding: "6px 16px", marginBottom: 28,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease 0.1s",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.primary, display: "block", boxShadow: `0 0 8px ${c.primary}` }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500, color: c.primary }}>100% Gratuito para Sempre</span>
          </div> */}

          {/* Headline */}
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(42px, 6vw, 68px)",
              fontWeight: 700,
              lineHeight: 1.05,
              color: dark ? "#FFFFFF" : "#1E2A3A",
              margin: "0 0 24px",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(28px)",
              transition: "all 0.7s ease 0.2s",
            }}
          >
            Crie seu portfólio
            <br />

            <span
              style={{
                display: "inline-block",
                background: `linear-gradient(135deg, ${c.primary}, ${
                  dark ? "#7EDCFF" : "#5DBBDD"
                })`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              profissional
            </span>

            <br />
            sem gastar nada
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: 17, lineHeight: 1.65,
            color: dark ? c.textSecondary : c.textSecondary,
            marginBottom: 36, maxWidth: 480,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.7s ease 0.35s",
          }}>
            Crie e mantenha seu portfólio totalmente grátis. Sem custos ocultos, sem mensalidades e sem necessidade de cartão de crédito.
          </p>

          {/* CTA */}
          <div style={{
            display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center",
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.5s",
          }}>
            <CTAButton primary href="#">
              Comece Grátis Agora →
            </CTAButton>
            <a href="#" style={{
              fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 500,
              color: dark ? c.textSecondary : c.textSecondary,
              textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
            }}>
              Ver Planos
            </a>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 32, marginTop: 48,
            opacity: mounted ? 1 : 0, transition: "all 0.7s ease 0.65s",
          }}>
            {[["10k+", "Freelancers"], ["4.9★", "Avaliação"], ["Free", "Para sempre"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 22, fontWeight: 700, color: dark ? "#fff" : "#1E2A3A" }}>{val}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.textMuted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
        background: `linear-gradient(to top, ${dark ? c.bgPrimary : c.heroBg}, transparent)`,
        pointerEvents: "none",
      }} />
    </section>
  );
}

// ── CTAButton ─────────────────────────────────────────────────────────────────
function CTAButton({
  children,
  href = "#",
  primary = true,
  large = false,
  style = {},
}: {
  children: ReactNode;
  href?: string;
  primary?: boolean;
  large?: boolean;
  style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "Poppins, sans-serif", fontWeight: 600,
        fontSize: large ? 16 : 14,
        padding: large ? "14px 32px" : "11px 24px",
        borderRadius: 8, textDecoration: "none",
        background: primary
          ? `linear-gradient(135deg, #A6E7FF, #7EDCFF)`
          : "transparent",
        color: primary ? "#1B1B1B" : "#A6E7FF",
        border: primary ? "none" : "1.5px solid #A6E7FF",
        boxShadow: primary ? `0 0 ${hov ? "28px" : "16px"} rgba(166,231,255,${hov ? "0.45" : "0.25"})` : "none",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all 0.25s ease",
        cursor: "pointer",
        ...style,
      }}>
      {children}
    </a>
  );
}

// ── FeaturesSection ───────────────────────────────────────────────────────────
function FeaturesSection({ dark }: { dark?: boolean }) {
  const c = dark ? DARK : LIGHT;
  const features = [
    { icon: ICONS.free, title: "100% Gratuito para Sempre", desc: "Crie e mantenha seu portfólio totalmente grátis. Sem custos ocultos ou recursos premium." },
    { icon: ICONS.seo, title: "Otimizado para SEO", desc: "Seja encontrado por clientes com nossas ferramentas de SEO embutidas. Apareça melhor nos resultados da busca." },
    { icon: ICONS.fast, title: "Extremamente Rápido", desc: "Construído com Next.js para um desempenho incrível que agrada visitantes e mecanismos de busca." },
    { icon: ICONS.secure, title: "Seguro & Confiável", desc: "Seu portfólio está protegido com segurança de nível empresarial e hospedado em infraestrutura confiável." },
    { icon: ICONS.templates, title: "Templates Lindos", desc: "Escolha entre nossa coleção de templates profissionais que fazem seu trabalho brilhar." },
    { icon: ICONS.config, title: "Configuração Rápida", desc: "Coloque seu portfólio online em minutos com nosso processo intuitivo. Sem necessidade de conhecimentos técnicos." },
    { icon: ICONS.clients, title: "Gestão de Clientes", desc: "Gerencie informações de clientes, projetos e comunicação em um só lugar." },
    { icon: ICONS.finance, title: "Gestão Financeira", desc: "Acompanhe seus ganhos, despesas e margens de lucro em tempo real." },
    { icon: ICONS.projects, title: "Gestão de Projetos", desc: "Agenda projetos, define marcos e acompanhe prazos de forma eficiente." },
  ];

  return (
    <section style={{ background: dark ? c.bgPrimary : c.bgPrimary, padding: "96px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-block",
              background: dark ? "rgba(166,231,255,0.08)" : "rgba(166,231,255,0.15)",
              border: `1px solid ${dark ? "rgba(166,231,255,0.2)" : "rgba(166,231,255,0.4)"}`,
              borderRadius: 100, padding: "5px 16px", marginBottom: 16,
              fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
              color: dark ? DARK.primary : "#2299BB",
            }}>
              Tudo o que Você Precisa
            </div>
            <h2 style={{
              fontFamily: "Poppins, sans-serif", fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 700, color: dark ? c.textPrimary : c.textPrimary,
              margin: "0 0 16px",
            }}>Tudo o que Você Precisa, <span style={{ color: dark ? c.primary : "#2299BB" }}>Grátis</span></h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: c.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
              Acreditamos que todo freelancer merece uma presença profissional online.
            </p>
          </div>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <FeatureCard feature={f} dark={dark} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type Feature = { icon: string; title: string; desc: string };

function FeatureCard({ feature, dark }: { feature: Feature; dark?: boolean }) {
  const [hov, setHov] = useState(false);
  const c = dark ? DARK : LIGHT;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: dark ? c.card : c.card,
        border: `1px solid ${dark ? (hov ? "rgba(166,231,255,0.35)" : c.border) : (hov ? "rgba(166,231,255,0.5)" : "#E8E8E8")}`,
        borderRadius: 12, padding: "28px 28px",
        boxShadow: hov ? `0 8px 32px rgba(0,0,0,${dark ? "0.3" : "0.08"}), 0 0 20px rgba(166,231,255,${dark ? "0.08" : "0.12"})` : `0 2px 8px rgba(0,0,0,0.06)`,
        transform: hov ? "translateY(-4px)" : "none",
        transition: "all 0.3s ease",
        cursor: "default",
      }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: dark ? "rgba(166,231,255,0.1)" : "rgba(166,231,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 18,
      }}>
        <Icon d={feature.icon} size={20} color={dark ? DARK.primary : "#2299BB"} />
      </div>
      <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 600, color: dark ? c.textPrimary : c.textPrimary, margin: "0 0 10px" }}>{feature.title}</h3>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: c.textMuted, lineHeight: 1.65, margin: 0 }}>{feature.desc}</p>
    </div>
  );
}

// ── PricingSection ────────────────────────────────────────────────────────────
function PricingSection({ dark }: { dark?: boolean }) {
  const c = dark ? DARK : LIGHT;
  const plans = [
    {
      name: "Grátis", tagline: "Perfeito para começar", price: "R$ 0,00", period: "/mês",
      cta: "Começar Grátis", featured: false,
      features: ["3 Categorias", "3 Projetos por Categoria", "Portfólio Personalizado", "Domínio Personalizado", "SEO Otimizado", "Suporte por Email"],
    },
    {
      name: "Premium", tagline: "Solução completa para freelancers", price: "R$ 24,90", period: "/mês",
      cta: "Começar Agora", featured: true,
      features: ["Tudo do plano Assinante", "Sistema de Gestão de Clientes", "Gestão Financeira Completa", "Curso Carreira Freelancer", "Mentoria em Grupo", "Comunidade VIP", "Acesso Antecipado a Recursos", "Suporte 24/7"],
    },
    {
      name: "Básico", tagline: "Para freelancers iniciantes", price: "R$ 14,90", period: "/mês",
      cta: "Começar Agora", featured: false,
      features: ["Categorias ilimitadas", "Projetos ilimitados", "Portfólio Personalizado", "Domínio Personalizado", "Otimizado para SEO", "Suporte Prioritário", "Temas Premium", "Analytics Avançado"],
    },
  ];

  return (
    <section style={{ background: dark ? c.bgSecondary : "#F0F0F0", padding: "96px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-block",
              background: dark ? "rgba(166,231,255,0.08)" : "rgba(166,231,255,0.2)",
              border: `1px solid ${dark ? "rgba(166,231,255,0.2)" : "rgba(166,231,255,0.45)"}`,
              borderRadius: 100, padding: "5px 16px", marginBottom: 16,
              fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
              color: dark ? DARK.primary : "#2299BB",
            }}>Planos</div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: dark ? c.textPrimary : c.textPrimary, margin: "0 0 14px" }}>Escolha Seu Plano</h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: c.textMuted, margin: 0 }}>Encontre o plano perfeito para suas necessidades</p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          {plans.map((plan, i) => (
            <Reveal key={i} delay={i * 80}>
              <PlanCard plan={plan} dark={dark} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, dark }: { plan: { name: string; tagline: string; price: string; period: string; cta: string; featured: boolean; features: string[]; }; dark?: boolean }) {
  const [hov, setHov] = useState(false);
  const c = dark ? DARK : LIGHT;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: plan.featured
          ? dark ? "linear-gradient(160deg, #1a3a5c 0%, #0d2240 100%)" : "linear-gradient(160deg, #daf4fc 0%, #c0ecf9 100%)"
          : dark ? c.card : c.card,
        border: `1.5px solid ${plan.featured ? (dark ? "#4DB8E8" : "#6DCBEA") : (dark ? c.border : "#E0E0E0")}`,
        borderRadius: 14, padding: "32px 28px",
        boxShadow: plan.featured
          ? `0 0 40px rgba(166,231,255,${dark ? "0.2" : "0.25"}), 0 8px 32px rgba(0,0,0,0.15)`
          : hov ? `0 8px 24px rgba(0,0,0,0.1)` : `0 2px 8px rgba(0,0,0,0.06)`,
        transform: plan.featured ? "scale(1.03)" : (hov ? "translateY(-4px)" : "none"),
        transition: "all 0.3s ease",
        position: "relative", overflow: "hidden",
      }}>

      {plan.featured && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: "linear-gradient(135deg, #A6E7FF, #7EDCFF)",
          color: "#1B1B1B", fontSize: 11, fontWeight: 700,
          fontFamily: "Poppins, sans-serif", padding: "4px 12px", borderRadius: 100,
        }}>POPULAR</div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 20, fontWeight: 700, color: dark ? c.textPrimary : c.textPrimary, marginBottom: 4 }}>{plan.name}</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: c.textMuted }}>{plan.tagline}</div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 36, fontWeight: 700, color: dark ? c.textPrimary : c.textPrimary }}>{plan.price}</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: c.textMuted }}>{plan.period}</span>
      </div>

      <CTAButton primary={plan.featured} href="#" style={{ width: "100%", justifyContent: "center", marginBottom: 24, fontSize: 14 }}>
        {plan.cta}
      </CTAButton>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plan.features.map((f, j) => (
          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: dark ? "rgba(166,231,255,0.12)" : "rgba(166,231,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <Icon d={ICONS.check} size={11} color={dark ? DARK.primary : "#2299BB"} />
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: dark ? c.textSecondary : c.textSecondary, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ComingSoonSection ─────────────────────────────────────────────────────────
function ComingSoonSection({ dark }: { dark?: boolean }) {
  const c = dark ? DARK : LIGHT;
  const items = [
    { icon: ICONS.finance, title: "Gestão de Renda", desc: "Acompanhe seus ganhos, despesas e margem de lucro em tempo real." },
    { icon: ICONS.clients, title: "Gerenciamento de Clientes", desc: "Gerencie informações de clientes, projetos e comunicação em um só lugar." },
    { icon: ICONS.invoices, title: "Criação de Faturas", desc: "Gere faturas profissionais automatizadas." },
    { icon: ICONS.reports, title: "Relatórios Financeiros", desc: "Obtenha insights sobre seu desempenho com análises financeiras detalhadas." },
    { icon: ICONS.calendar, title: "Planejamento de Projetos", desc: "Agenda projetos, define marcos e acompanhe de forma eficiente." },
  ];

  return (
    <section style={{ background: dark ? c.bgPrimary : c.bgPrimary, padding: "96px 32px", position: "relative", overflow: "hidden" }}>
      {/* decorative blob */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: dark ? "radial-gradient(circle, rgba(166,231,255,0.04) 0%, transparent 70%)" : "radial-gradient(circle, rgba(166,231,255,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-block",
              background: dark ? "rgba(166,231,255,0.08)" : "rgba(166,231,255,0.2)",
              border: `1px solid ${dark ? "rgba(166,231,255,0.2)" : "rgba(166,231,255,0.45)"}`,
              borderRadius: 100, padding: "5px 16px", marginBottom: 16,
              fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
              color: dark ? DARK.primary : "#2299BB",
            }}>Em Breve</div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: dark ? c.textPrimary : c.textPrimary, margin: "0 0 14px" }}>
              Potencialize Seu <span style={{ color: dark ? c.primary : "#2299BB" }}>Negócio Freelancer</span>
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: c.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.65 }}>
              Tenha acesso antecipado aos nossos próximos recursos premium projetados para ajudar você a gerenciar seu negócio freelancer como um profissional.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <div style={{
                background: dark ? c.card : c.card,
                border: `1px solid ${dark ? c.border : "#E8E8E8"}`,
                borderRadius: 12, padding: "26px 24px",
                opacity: 0.75,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: dark ? "rgba(166,231,255,0.08)" : "rgba(166,231,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
                }}>
                  <Icon d={item.icon} size={18} color={dark ? "#7EDCFF" : "#4AAABB"} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 600, color: dark ? c.textPrimary : c.textPrimary, margin: 0 }}>{item.title}</h3>
                  <span style={{
                    background: dark ? "rgba(166,231,255,0.1)" : "rgba(166,231,255,0.2)",
                    color: dark ? c.primary : "#2299BB",
                    fontSize: 10, fontWeight: 600, fontFamily: "Poppins, sans-serif",
                    padding: "2px 8px", borderRadius: 100,
                  }}>EM BREVE</span>
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TestimonialsSection ───────────────────────────────────────────────────────
function TestimonialsSection({ dark }: { dark?: boolean }) {
  const c = dark ? DARK : LIGHT;
  const testimonials = [
    { name: "Sarah Johnson", role: "Designer UI/UX", text: "Esta plataforma me ajudou a conseguir mais clientes do que nunca. As opções de personalização são incríveis.", avatar: "SJ", stars: 5 },
    { name: "Michael Chen", role: "Desenvolvedor Frontend", text: "Configurar meu portfólio foi muito fácil. As funções de SEO melhoraram significativamente minha visibilidade.", avatar: "MC", stars: 5 },
    { name: "Emily Rodriguez", role: "Designer Gráfico", text: "A melhor decisão que fiz para minha carreira freelancer. Meu portfólio se ve incrível e atrai clientes de alta qualidade.", avatar: "ER", stars: 5 },
  ];

  return (
    <section style={{ background: dark ? c.bgSecondary : "#F0F0F0", padding: "96px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-block",
              background: dark ? "rgba(166,231,255,0.08)" : "rgba(166,231,255,0.2)",
              border: `1px solid ${dark ? "rgba(166,231,255,0.2)" : "rgba(166,231,255,0.45)"}`,
              borderRadius: 100, padding: "5px 16px", marginBottom: 16,
              fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
              color: dark ? DARK.primary : "#2299BB",
            }}>Depoimentos</div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: dark ? c.textPrimary : c.textPrimary, margin: "0 0 14px" }}>
              Amado por <span style={{ color: dark ? c.primary : "#2299BB" }}>Freelancers</span>
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: c.textMuted, margin: 0 }}>
              Junte-se a miles de freelancers exitosos que transformaron sua presença em linha.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{
                background: dark ? c.card : c.card,
                border: `1px solid ${dark ? c.border : "#E8E8E8"}`,
                borderRadius: 14, padding: "28px",
                boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {Array(t.stars).fill(0).map((_, j) => (
                    <svg key={j} width={14} height={14} viewBox="0 0 24 24" fill="#F59E0B"><path d={ICONS.star} /></svg>
                  ))}
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: dark ? c.textSecondary : c.textSecondary, lineHeight: 1.7, margin: "0 0 20px" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, #A6E7FF, #7EDCFF)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#1B1B1B",
                    flexShrink: 0,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 600, color: dark ? c.textPrimary : c.textPrimary }}>{t.name}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.textMuted }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQSection ────────────────────────────────────────────────────────────────
function FAQSection({ dark }: { dark?: boolean }) {
  const c = dark ? DARK : LIGHT;
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Quais são as limitações do plano gratuito?", a: "O plano gratuito inclui 3 categorias, 3 projetos por categoria, portfólio personalizado, domínio personalizado, SEO otimizado e suporte por email. Perfeito para começar sua presença online." },
    { q: "Como funciona o plano Pagante?", a: "O plano Básico por R$ 14,90/mês oferece categorias e projetos ilimitados, temas premium, analytics avançado e suporte prioritário. O plano Premium por R$ 24,90/mês inclui gestão de clientes, gestão financeira e muito mais." },
    { q: "O que está incluso no plano Premium?", a: "O Premium inclui tudo do plano Básico, mais: Sistema de Gestão de Clientes, Gestão Financeira Completa, Curso Carreira Freelancer, Mentoria em Grupo, Comunidade VIP, Acesso Antecipado a Recursos e Suporte 24/7." },
    { q: "Posso mudar de plano depois?", a: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é calculado proporcionalmente." },
    { q: "Como funciona o curso de carreira freelancer?", a: "O curso de carreira freelancer é um programa completo incluído no plano Premium que cobre desde a configuração do seu portfólio até estratégias avançadas de aquisição de clientes." },
  ];

  return (
    <section style={{ background: dark ? c.bgPrimary : c.bgPrimary, padding: "96px 32px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-block",
              background: dark ? "rgba(166,231,255,0.08)" : "rgba(166,231,255,0.2)",
              border: `1px solid ${dark ? "rgba(166,231,255,0.2)" : "rgba(166,231,255,0.45)"}`,
              borderRadius: 100, padding: "5px 16px", marginBottom: 16,
              fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
              color: dark ? DARK.primary : "#2299BB",
            }}>FAQ</div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: dark ? c.textPrimary : c.textPrimary, margin: "0 0 14px" }}>Perguntas Frequentes</h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: c.textMuted, margin: 0 }}>
              Tire suas dúvidas sobre nossos planos e funcionalidades.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 50}>
              <div style={{
                background: dark ? DARK.card : "#fff",
                border: `1px solid ${dark ? (open === i ? "rgba(166,231,255,0.3)" : DARK.border) : (open === i ? "rgba(166,231,255,0.5)" : "#E8E8E8")}`,
                borderRadius: 10, overflow: "hidden",
                transition: "border-color 0.2s",
              }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 22px", textAlign: "left", gap: 12,
                }}>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 500, color: dark ? c.textPrimary : c.textPrimary }}>{f.q}</span>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                    background: dark ? "rgba(166,231,255,0.1)" : "rgba(166,231,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 0.2s",
                    transform: open === i ? "rotate(45deg)" : "none",
                  }}>
                    <Icon d={ICONS.plus} size={14} color={dark ? DARK.primary : "#2299BB"} />
                  </div>
                </button>
                {open === i && (
                  <div style={{ padding: "0 22px 18px", fontFamily: "Inter, sans-serif", fontSize: 14, color: dark ? c.textMuted : c.textMuted, lineHeight: 1.7 }}>
                    {f.a}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTASection ────────────────────────────────────────────────────────────────
function CTASectionFull({ dark }: { dark: boolean }) {
  const c = dark ? DARK : LIGHT;
  return (
    <section style={{ background: dark ? c.bgSecondary : "#EBF9FF", padding: "96px 32px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 700, height: 400, borderRadius: "50%",
        background: dark
          ? "radial-gradient(ellipse, rgba(166,231,255,0.07) 0%, transparent 70%)"
          : "radial-gradient(ellipse, rgba(166,231,255,0.35) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <Reveal>
          <div style={{
            display: "inline-block",
            background: dark ? "rgba(166,231,255,0.08)" : "rgba(166,231,255,0.25)",
            border: `1px solid ${dark ? "rgba(166,231,255,0.2)" : "rgba(166,231,255,0.5)"}`,
            borderRadius: 100, padding: "5px 16px", marginBottom: 24,
            fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
            color: dark ? DARK.primary : "#2299BB",
          }}>Comece Hoje</div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: dark ? c.textPrimary : "#1E2A3A", margin: "0 0 18px", lineHeight: 1.15 }}>
            Comece a Criar Seu<br />
            <span style={{ color: dark ? c.primary : "#2299BB" }}>Portfólio Gratuito</span> Hoje
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: c.textMuted, lineHeight: 1.65, marginBottom: 36 }}>
            Junte-se às milhares de freelancers que estão mostrando seu trabalho e atraindo melhores clientes com nossa plataforma.
          </p>
          <CTAButton primary href="#" large>
            Criar Seu Portfólio →
          </CTAButton>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.textMuted, marginTop: 18 }}>
            Sem cartão de crédito · Grátis para sempre · Configuração em minutos
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ dark }: { dark?: boolean }) {
  const c = dark ? DARK : LIGHT;
  return (
    <footer style={{ background: dark ? "#17181E" : "#E8E8E8", padding: "40px 32px", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <img src={dark ? LOGO_DARK : LOGO_LIGHT} alt="Portify" style={{ height: 22, objectFit: "contain" }} />
        <div style={{ display: "flex", gap: 24 }}>
          {["Termos de Uso", "Política de Privacidade", "Configurações"].map(l => (
            <a key={l} href="#" style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.textMuted, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.textMuted }}>© 2025 Portify. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function PortifyLanding() {
  const [dark, setDark] = useState(true);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", background: dark ? DARK.bgPrimary : LIGHT.bgPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(166,231,255,0.2); border-radius: 3px; }
      `}</style>
      <Navbar dark={dark} toggle={() => setDark(!dark)} />
      <HeroSection dark={dark} />
      <FeaturesSection dark={dark} />
      <PricingSection dark={dark} />
      <ComingSoonSection dark={dark} />
      <TestimonialsSection dark={dark} />
      <FAQSection dark={dark} />
      <CTASectionFull dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}