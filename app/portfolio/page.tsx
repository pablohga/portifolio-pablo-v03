"use client";

import { useEffect, useState } from "react";
import { TemplateProvider, useTemplate } from "@/components/template-context";
import HeroSection from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";
import { Category } from "@/types/category";
import { Project } from "@/types/project";

function PortfolioContent() {
  const { template } = useTemplate();
  const [userId, setUserId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userImage, setUserImage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        // Busca dados do usuário logado
        const userRes = await fetch("/api/auth/session");
        const session = await userRes.json();

        if (!session?.user?.id) {
          setLoading(false);
          return;
        }

        const id = session.user.id;
        setUserId(id);
        setUserName(session.user.name || "");
        setUserImage(session.user.image || "");

        // Busca categorias e projetos em paralelo
        const [categoriesRes, projectsRes] = await Promise.all([
          fetch(`/api/categories?userId=${id}`),
          fetch(`/api/projects?userId=${id}`),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando portfólio...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Faça login para ver seu portfólio.</p>
      </div>
    );
  }

  switch (template) {
    case "template1":
      return (
        <Template1
          userId={userId}
          categories={categories}
          projects={projects}
          userImage={userImage}
          userName={userName}
        />
      );
    case "template2":
      return (
        <Template2
          userId={userId}
          categories={categories}
          projects={projects}
        />
      );
    case "template3":
      return (
        <Template3
          userId={userId}
          categories={categories}
          projects={projects}
        />
      );
    case "default":
    default:
      return (
        <div className="min-h-screen bg-background">
          <HeroSection userId={userId} />
          <ProjectsSection
            userId={userId}
            initialCategories={categories}
            initialProjects={projects}
          />
          <AboutSection userId={userId} />
          <ContactSection userId={userId} />
        </div>
      );
  }
}

export default function PortfolioPage() {
  return (
    <TemplateProvider>
      <PortfolioContent />
    </TemplateProvider>
  );
}
