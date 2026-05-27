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

export default function Template3({ userId, categories, projects }: TemplateProps) {
  return (
    <div className="min-h-screen bg-gray-100">

      <AboutSection userId={userId} />
      <h1 className="hidden">t3</h1>
      <HeroSection userId={userId} />
      <ProjectsSection userId={userId} initialCategories={categories} initialProjects={projects} />
      <ContactSection userId={userId} />
    </div>
  );
}
