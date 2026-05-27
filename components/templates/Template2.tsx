"use client";

import HeroSection from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Project } from "@/types/project";
import { Category } from "@/types/category";

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
}

export default function Template2({ userId, categories, projects }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white">

      <ProjectsSection userId={userId} initialCategories={categories} initialProjects={projects} />
      <h1 className="hidden">t2</h1>
      <HeroSection userId={userId} />
      <ContactSection userId={userId} />
      <AboutSection userId={userId} />
    </div>
  );
}
