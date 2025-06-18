"use client";

import HeroSection from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

export default function Template3() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AboutSection />
      <HeroSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
