"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { ModeToggle } from "./mode-toggle";
import { Menu, X } from "lucide-react";
import i18next from "@/lib/i18next-config";
import { useTranslation } from "react-i18next";
import { Globe } from 'lucide-react';
import { useTheme } from "next-themes";
import { DARK, LIGHT } from "@/constants/theme";
import { LOGO_DARK, LOGO_LIGHT, ICONS } from "@/constants/assets";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isPortfolioPage, setIsPortfolioPage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userSlug, setUserSlug] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language || 'en');
  const { t } = useTranslation();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const c = isDark ? DARK : LIGHT;

  const isAuthenticated = status === "authenticated";

  const { firstName, lastName } = session?.user?.name
    ? session.user.name.split(" ").reduce<{ firstName: string; lastName: string }>(
        (acc, name, idx) =>
          idx === 0
            ? { ...acc, firstName: name }
            : { ...acc, lastName: acc.lastName ? acc.lastName + " " + name : name },
        { firstName: "", lastName: "" }
      )
    : { firstName: "", lastName: "" };

  useEffect(() => {
    const detectedLanguage = i18next.language;
    setCurrentLanguage(detectedLanguage);

    if (session?.user?.id) {
      fetchUserSlug(session.user.id).then((slug) => {
        if (slug) {
          setUserSlug(slug);
        }
      });
    }

    const checkPortfolioPage = () => {
      if (document?.title?.includes(" - Portfolio")) {
        setIsPortfolioPage(true);
      } else {
        setIsPortfolioPage(false);
      }
    };

    checkPortfolioPage();

    const observer = new MutationObserver(() => checkPortfolioPage());
    observer.observe(document.querySelector("title") as Node, { childList: true });

    return () => observer.disconnect();
  }, [session, status]);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'pt' : 'en';
    i18next.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const renderLinks = (links: { label: string; href: string }[]) =>
    links.map(({ label, href }) => (
      <Link
        key={href}
        href={href}
        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </Link>
    ));

  const Icon = ({ d, size = 22, color = "currentColor" }: { d: string; size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );

  const AuthenticatedNavbarPort = () => {
    const links = [
      { label: t('Navbar.Home'), href: "/" },
      { label: t('Navbar.About'), href: "#about" },
      { label: t('Navbar.Projects'), href: "#projects" },
      { label: t('Navbar.EditPortfolio'), href: "/dashboard" },
    ];

    return (
      <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">Portify</span>
          </div>
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex items-center">
            {renderLinks(links)}
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleChangeLanguage}
            >
              <Globe className="h-[1.2rem] w-[1.2rem] text-foreground dark:text-white" />
              <span className="sr-only">Toggle language</span>
            </Button>
            <div className="text-sm font-bold">
              {firstName} <span className="text-primary">{lastName}</span>
            </div>
            <Button variant="ghost" onClick={() => signOut()}>
              {t('Navbar.SignOut')}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-background/90 backdrop-blur-sm border-t px-4 py-2">
            {renderLinks(links)}
            <Button
              variant="secondary"
              className="w-full text-left py-2"
              onClick={() => signOut()}
            >
              {t('Navbar.SignOut')}
            </Button>
          </div>
        )}
      </nav>
    );
  };

  const AuthenticatedNavbar = () => {
    const links = [
      { label: t('Navbar.Dashboard'), href: "/dashboard" },
      { label: t('Navbar.MyPortfolio'), href: `/${userSlug}` },
      { label: t('Navbar.Settings'), href: "/settings" },
      { label: t('Navbar.Support'), href: "/support" },
    ];

    return (
      <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">Portify</span>
          </div>
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex items-center">
            {renderLinks(links)}
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleChangeLanguage}
            >
              <Globe className="h-[1.2rem] w-[1.2rem] text-foreground dark:text-white" />
              <span className="sr-only">Toggle language</span>
            </Button>
            <div className="text-sm font-bold">
              {firstName} <span className="text-primary">{lastName}</span>
            </div>
            <Button variant="ghost" onClick={() => signOut()}>
              {t('Navbar.SignOut')}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-background/90 backdrop-blur-sm border-t px-4 py-2">
            {renderLinks(links)}
            <Button
              variant="ghost"
              className="w-full text-left py-2"
              onClick={() => signOut()}
            >
              {t('Navbar.SignOut')}
            </Button>
          </div>
        )}
      </nav>
    );
  };

  const VisitorNavbarPortfolio = () => {
    const links = [
      { label: t('Navbar.Home'), href: "/" },
      { label: t('Navbar.AboutTheCreator'), href: "/about" },
      { label: t('Navbar.Projects'), href: "/projects" },
      { label: t('Navbar.CreateMyPortfolio'), href: "/auth/register" },
    ];

    return (
      <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">Portify</span>
          </div>
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex items-center">
            {renderLinks(links)}
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleChangeLanguage}
            >
              <Globe className="h-[1.2rem] w-[1.2rem] text-foreground dark:text-white" />
              <span className="sr-only">Toggle language</span>
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-background/90 backdrop-blur-sm border-t px-4 py-2">
            {renderLinks(links)}
          </div>
        )}
      </nav>
    );
  };

  const VisitorNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const fn = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", fn);
      return () => window.removeEventListener("scroll", fn);
    }, []);

    const links = [
      { label: t('Navbar.Home'), href: "/" },
      { label: t('Navbar.Features'), href: "/#features" },
      { label: t('Navbar.Pricing'), href: "/#pricing" },
      { label: t('Navbar.Support'), href: "/support" },
    ];

    return (
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled
          ? isDark ? "rgba(32,34,43,0.97)" : "rgba(255,255,255,0.97)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${isDark ? "rgba(90,103,120,0.3)" : "rgba(0,0,0,0.08)"}` : "none",
        transition: "all 0.3s ease",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={isDark ? LOGO_DARK : LOGO_LIGHT} alt="Portify" style={{ height: 28, objectFit: "contain" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 32, fontFamily: "Poppins, sans-serif" }} className="desktop-nav">
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                color: c.textSecondary, textDecoration: "none", fontSize: 14, fontWeight: 500,
                transition: "color 0.2s",
              }}
                onMouseEnter={(e: any) => e.currentTarget.style.color = c.primary}
                onMouseLeave={(e: any) => e.currentTarget.style.color = c.textSecondary}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-4">
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleChangeLanguage}
                >
                  <Globe className="h-[1.2rem] w-[1.2rem] text-foreground dark:text-white" />
                  <span className="sr-only">Toggle language</span>
                </Button>
                <Link href="/auth/signin" style={{
                  color: c.textSecondary, textDecoration: "none", fontSize: 14,
                  fontFamily: "Poppins, sans-serif", fontWeight: 500,
                }}>Entrar</Link>
                <Link href="/auth/register" style={{
                  background: `linear-gradient(135deg, ${c.primary}, ${isDark ? DARK.primaryGlow : "#8DDBF5"})`,
                  color: "#1B1B1B", textDecoration: "none", fontSize: 13, fontWeight: 600,
                  fontFamily: "Poppins, sans-serif", padding: "9px 20px", borderRadius: 8,
                  boxShadow: `0 0 16px rgba(166,231,255,0.3)`,
                }}>Cadastrar-se</Link>
            </div>
          </div>
          <button onClick={toggleMenu} style={{
            background: "none", border: "none", cursor: "pointer", display: "none",
            color: c.textPrimary, padding: 4,
          }} className="mobile-menu-btn">
            <Icon d={isMenuOpen ? ICONS.close : ICONS.menu} size={22} color={c.textPrimary} />
          </button>
        </div>

        {isMenuOpen && (
          <div style={{
            background: isDark ? DARK.navbar : "#fff",
            borderTop: `1px solid ${isDark ? DARK.border : "#eee"}`,
            padding: "16px 24px 20px",
          }}>
            {links.map(l => (
              <div key={l.href} style={{ padding: "10px 0", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f0f0f0"}` }}>
                <Link href={l.href} style={{ color: c.textPrimary, textDecoration: "none", fontFamily: "Poppins, sans-serif", fontSize: 15 }}>{l.label}</Link>
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4">
                <Link href="/auth/signin" style={{ color: c.textPrimary, textDecoration: "none", fontFamily: "Poppins, sans-serif", fontSize: 15, padding: "10px 0" }}>Entrar</Link>
                <Link href="/auth/register" style={{
                    background: `linear-gradient(135deg, ${c.primary}, ${isDark ? DARK.primaryGlow : "#8DDBF5"})`,
                    color: "#1B1B1B", textDecoration: "none", fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 600,
                    padding: "10px 20px", borderRadius: 8, textAlign: "center"
                }}>Cadastrar-se</Link>
            </div>
          </div>
        )}
      </nav>
    );
  };

  if (status === "loading") {
    return <div className="fixed top-0 w-full h-16 flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated
    ? isPortfolioPage
      ? <AuthenticatedNavbarPort />
      : <AuthenticatedNavbar />
    : isPortfolioPage
      ? <VisitorNavbarPortfolio />
      : <VisitorNavbar />;
}

async function fetchUserSlug(userId: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/user/slug?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user slug");
    const data = await res.json();
    return data.slug || null;
  } catch (error) {
    console.error("Error fetching user slug:", error);
    return null;
  }
}
