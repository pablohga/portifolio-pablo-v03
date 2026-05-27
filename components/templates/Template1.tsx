"use client";

import HeroSection from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { motion } from "framer-motion";

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
}

export default function Template1({ userId, categories, projects }: TemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <HeroSection userId={userId} />
      <AboutSection userId={userId} />
      <ProjectsSection userId={userId} initialCategories={categories} initialProjects={projects} />
      <ContactSection userId={userId} />
    </motion.div>
  );
}
