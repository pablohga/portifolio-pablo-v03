import { HeroSection } from "@/app/components/landing/hero-section";
import { FeaturesSection } from "@/app/components/landing/features-section";
import { ComingSoonSection } from "@/app/components/landing/coming-soon-section";
import { TestimonialsSection } from "@/app/components/landing/testimonials-section";
import { FAQSection } from "@/app/components/landing/faq-section";
import { CTASection } from "@/app/components/landing/cta-section";

export default function StartPage() {
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