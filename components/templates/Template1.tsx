"use client";

import HeroSection from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

export default function Template1() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <HeroSection />
      <h1>t1</h1>
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
