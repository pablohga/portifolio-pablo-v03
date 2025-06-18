"use client";

import HeroSection from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

export default function Template2() {
  return (
    <div className="min-h-screen bg-white">
      <ProjectsSection />
      <HeroSection />
      <ContactSection />
      <AboutSection />
    </div>
  );
}
