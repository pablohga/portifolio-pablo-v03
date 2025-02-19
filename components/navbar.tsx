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

export default function Navbar() {
  const { data: session, status } = useSession(); // Obtenha o status da sessão
  const [isPortfolioPage, setIsPortfolioPage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userSlug, setUserSlug] = useState<string | null>(null); // Estado para armazenar o slug
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language || 'en');
  const { t } = useTranslation(); // Use the hook to get translations
  // Verificar se o usuário está autenticado
  const isAuthenticated = status === "authenticated";

  // Extrair firstName e lastName apenas se session.user.name existir
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
    // Detected language by i18next
    const detectedLanguage = i18next.language; 
    setCurrentLanguage(detectedLanguage);

    // Adicione um console.log para depurar o status da sessão
    console.log("Session Data:", session); 
    

    if (session?.user?.id) {
      // Busca o slug do usuário com base no session.id
      fetchUserSlug(session.user.id).then((slug) => {
        if (slug) {
          setUserSlug(slug); // Define o estado com o slug
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
  }, [session, status]); // Atualize quando o status da sessão mudar

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'pt' : 'en';
    i18next.changeLanguage(newLanguage); // Change the language
    setCurrentLanguage(newLanguage); // Update the state
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

  // Componente para navbar autenticado em páginas de portfólio
  const AuthenticatedNavbarPort = () => {
    const links = [
      { label: t('Navbar.Home'), href: "/" },
      { label: t('Navbar.About'), href: "/about" },
      { label: t('Navbar.Projects'), href: "/projects" },
      { label: t('Navbar.EditPortfolio'), href: "/dashboard" },
    ];
    console.log('setCurrentLanguage NAVBAR!!!!', currentLanguage)

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

            {/* Translation button */}
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

  //  Componente para navbar autenticado em outras páginas
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
            
            {/* Translation button */}
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

  // Componente para navbar de visitantes em páginas de portfólio
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
            
            {/* Translation button */}
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

  // Componente para navbar de visitantes em outras páginas
  const VisitorNavbar = () => {
    const links = [
      { label: t('Navbar.Home'), href: "/" },
      { label: t('Navbar.Features'), href: "/#features" },
      { label: t('Navbar.Pricing'), href: "/#pricing" },
      { label: t('Navbar.Support'), href: "/support" },
      { label: t('Navbar.SignIn'), href: "/auth/signin" },
      { label: t('Navbar.SignUp'), href: "/auth/register" },
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
            
            {/* Translation button */}
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

  // Renderização condicional com base no status da sessão
  if (status === "loading") {
    return <div>Loading...</div>; // Exibe uma mensagem de carregamento enquanto a sessão é carregada
  }

  return isAuthenticated
    ? isPortfolioPage
      ? <AuthenticatedNavbarPort />
      : <AuthenticatedNavbar />
    : isPortfolioPage
      ? <VisitorNavbarPortfolio />
      : <VisitorNavbar />;
}

// Função para buscar o slug do usuário
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
