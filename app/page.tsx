import { HeroSection } from '@/app/components/landing/hero-section';
import { FeaturesSection } from '@/app/components/landing/features-section';
import { PricingSection } from '@/app/components/landing/pricing-section';
import { ComingSoonSection } from '@/app/components/landing/coming-soon-section';
import { TestimonialsSection } from '@/app/components/landing/testimonials-section';
import { FAQSection } from '@/app/components/landing/faq-section';
import { CTASection } from '@/app/components/landing/cta-section';
import { Home } from '@/models/home';
import dbConnect from '@/lib/db';
import { HomeData } from '@/types/home';
// novo45366
async function getHomeData(): Promise<HomeData | null> {
  try {
    await dbConnect();
    const home = await Home.findOne().sort({ createdAt: -1 });
    return home ? home.toObject() : null;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return null;
  }
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
