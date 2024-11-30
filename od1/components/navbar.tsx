"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Menu, LogIn, UserPlus } from "lucide-react";
import { formatName } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session } = useSession();
  const { firstName, lastName } = formatName(session?.user?.name);
  const t = useTranslations('navigation');

  return (
    <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold">Portify</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/portfolio" className="hover:text-primary transition-colors">
            {t('portfolio')}
          </Link>
          <Link href="/#features" className="hover:text-primary transition-colors">
            {t('features')}
          </Link>
          <Link href="/#pricing" className="hover:text-primary transition-colors">
            {t('pricing')}
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            {t('contact')}
          </Link>
          <LanguageSwitcher />
          <ModeToggle />
          {session ? (
            <>
              <div className="text-sm font-medium">
                {firstName} <span className="text-primary">{lastName}</span>
              </div>
              <Link href="/dashboard">
                <Button variant="outline">{t('dashboard')}</Button>
              </Link>
              <Button variant="ghost" onClick={() => signOut()}>
                {t('signOut')}
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>{t('register')}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/auth/register" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>{t('createAccount')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/signin" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>{t('login')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/portfolio">{t('portfolio')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#features">{t('features')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#pricing">{t('pricing')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">{t('contact')}</Link>
              </DropdownMenuItem>
              {session ? (
                <>
                  <DropdownMenuItem>
                    <span className="font-medium">
                      {firstName} <span className="text-primary">{lastName}</span>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t('dashboard')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    {t('signOut')}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register" className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>{t('createAccount')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin" className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>{t('login')}</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}