"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  User,
  Layout,
  Search,
  Mail,
  Folder,
  ExternalLink,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface SidebarItemProps {
  title: string;
  href: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

function SidebarItem({ title, href, icon: Icon, active, onClick, children }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!children;

  return (
    <div className="space-y-1">
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
          active
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 flex-1",
            active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
          )}
          onClick={(e) => {
            if (hasChildren) {
              // If it has children, we might want to prevent default and just toggle
              // But the user requested links, so we'll let it navigate and toggle.
            }
          }}
        >
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </Link>
        {hasChildren && (
          <div className="ml-2">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="ml-7 pl-4 border-l border-border/50 space-y-1 mt-1">
          {children}
        </div>
      )}
    </div>
  );
}

function SubItem({ title, href }: { title: string; href: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === "/dashboard" && searchParams.get("tab") === href.split('=')[1];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
        active
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      {title}
    </Link>
  );
}

export function Sidebar({ userSlug }: { userSlug?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const { t } = useTranslation();

  const isActive = (href: string) => {
    if (href.includes("?tab=")) {
      const tab = href.split('=')[1];
      return currentTab === tab;
    }
    return pathname === href;
  };

  return (
    <aside className="pt-4 flex flex-col h-full bg-card border-r border-border transition-all duration-300 w-64 overflow-y-auto">
      {/* <div className="p-6 mb-4">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            P
          </div>
          <span>Portify</span>
        </div>
      </div> */}

      <nav className="flex-1 px-4 space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("Dashboard.General")}
          </p>
          <div className="space-y-1">
            <SidebarItem
              title={t("Dashboard.ProfileSettings")}
              href="/dashboard/profile"
              icon={User}
              active={isActive("/dashboard/profile")}
            />
          </div>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("Dashboard.Portfolio")}
          </p>
          <div className="space-y-1">
            <SidebarItem
              title={t("Dashboard.TemplateSelection")}
              href="/dashboard?tab=templates"
              icon={Layout}
              active={isActive("/dashboard?tab=templates") || ["hero", "about"].includes(currentTab || "")}
            >
              <SubItem title={t("Dashboard.TemplateSelection")} href="/dashboard?tab=templates" />
              <SubItem title={t("Dashboard.EditHeroBannerSection")} href="/dashboard?tab=hero" />
              <SubItem title={t("Dashboard.EditSectionAboutYou")} href="/dashboard?tab=about" />
            </SidebarItem>

            <SidebarItem
              title={t("Dashboard.ManageCategories")}
              href="/dashboard?tab=categories-add"
              icon={Folder}
              active={isActive("/dashboard?tab=categories-add") || ["categories-add", "categories-edit"].includes(currentTab || "")}
            >
              <SubItem title={t("Dashboard.AddCategories")} href="/dashboard?tab=categories-add" />
              <SubItem title={t("Dashboard.EditCategories")} href="/dashboard?tab=categories-edit" />
            </SidebarItem>

            <SidebarItem
              title={t("Dashboard.ManageProjects")}
              href="/dashboard?tab=projects-add"
              icon={Layout}
              active={isActive("/dashboard?tab=projects-add") || ["projects-add", "projects-edit"].includes(currentTab || "")}
            >
              <SubItem title={t("Dashboard.AddProjects")} href="/dashboard?tab=projects-add" />
              <SubItem title={t("Dashboard.EditProjects")} href="/dashboard?tab=projects-edit" />
            </SidebarItem>

            <SidebarItem
              title={t("Dashboard.AddTestimonials")}
              href="/dashboard?tab=testimonials"
              icon={User}
              active={isActive("/dashboard?tab=testimonials")}
            />
          </div>
        </div>

        <div className="space-y-1">
          <SidebarItem
            title={t("Dashboard.EditSeoSettings")}
            href="/dashboard?tab=seo"
            icon={Search}
            active={isActive("/dashboard?tab=seo")}
          />
          <SidebarItem
            title={t("Dashboard.EditContactSettings")}
            href="/dashboard?tab=contact"
            icon={Mail}
            active={isActive("/dashboard?tab=contact")}
          />
        </div>
      </nav>

      <div className="p-4 mt-auto space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground transition-colors"
          asChild
        >
          <Link href={userSlug ? `/${userSlug.toLowerCase().replace(/\s+/g, '-')}` : "#"}>
            <ExternalLink className="h-4 w-4" />
            <span>{t("Dashboard.ViewYourPortfolio")}</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span>{t("Dashboard.Logout")}</span>
        </Button>
      </div>
    </aside>
  );
}
