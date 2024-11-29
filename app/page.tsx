import { HeroSection } from '@/components/hero-section';
import { ProjectsSection } from '@/components/projects-section';
import { AboutSection } from '@/components/about-section';
import { ContactSection } from '@/components/contact-section';
// testeq32
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
