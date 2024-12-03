import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { ComingSoonSection } from '@/components/landing/coming-soon-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
//bb
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <ComingSoonSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
