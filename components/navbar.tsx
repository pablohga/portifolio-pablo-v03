"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { ModeToggle } from "./mode-toggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isPortfolioPage, setIsPortfolioPage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  }, []);

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

  const AuthenticatedNavbarPort = () => {
    const links = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Edit Portfolio", href: "/dashboard" },
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
            <div className="text-sm font-bold">
              {firstName} <span className="text-primary">{lastName}</span>
            </div>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
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
              Sign Out
            </Button>
          </div>
        )}
      </nav>
    );
  };

  const AuthenticatedNavbar = () => {
    const links = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Portfolio", href: `/${session?.user?.slug}` },
      { label: "Settings", href: "/settings" },
      { label: "Support", href: "/support" },
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
            <div className="text-sm font-bold">
              {firstName} <span className="text-primary">{lastName}</span>
            </div>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
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
              Sign Out
            </Button>
          </div>
        )}
      </nav>
    );
  };

  const VisitorNavbarPortfolio = () => {
    const links = [
      { label: "Home", href: "/" },
      { label: "About the Creator", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Create My Portfolio", href: "/auth/register" },
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
    const links = [
      { label: "Home", href: "/" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Support", href: "/support" },
      { label: "Sign In", href: "/auth/signin" },
      { label: "Sign Up", href: "/auth/register" },
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

  return session?.user
    ? isPortfolioPage
      ? <AuthenticatedNavbarPort />
      : <AuthenticatedNavbar />
    : isPortfolioPage
      ? <VisitorNavbarPortfolio />
      : <VisitorNavbar />;
}
