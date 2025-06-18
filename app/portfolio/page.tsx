"use client";

import { TemplateProvider, useTemplate } from "@/components/template-context";
import HeroSection from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";

function PortfolioContent() {
  const { template } = useTemplate();

  switch (template) {
    case "template1":
      return <Template1 />;
    case "template2":
      return <Template2 />;
    case "template3":
      return <Template3 />;
    case "default":
    default:
      return (
        <div className="min-h-screen bg-background">
          <HeroSection />
          <ProjectsSection />
          <AboutSection />
          <ContactSection />
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
