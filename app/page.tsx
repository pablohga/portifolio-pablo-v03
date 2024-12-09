import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { ComingSoonSection } from '@/components/landing/coming-soon-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { Home } from '@/models/home';
import dbConnect from '@/lib/db';

async function getHomeData() {
  await dbConnect();
  return Home.findOne().sort({ createdAt: -1 });
}

export default async function HomePage() {
  const homeData = await getHomeData();

  return (
    <div className="min-h-screen bg-background">
      <HeroSection data={homeData?.heroSection} />
      <FeaturesSection data={homeData?.featuresSection} />
      <PricingSection data={homeData?.pricingSection} />
      <ComingSoonSection />
      <TestimonialsSection data={homeData?.testimonialsSection} />
      <FAQSection data={homeData?.faqSection} />
      <CTASection data={homeData?.ctaSection} />
    </div>
  );
}