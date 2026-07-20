"use client";

import { useTheme } from "next-themes";
import { HeroB } from "@/components/landingb/Hero";
import { FeaturesB } from "@/components/landingb/Features";
import { TemplateGalleryB } from "@/components/landingb/TemplateGallery";
import { BusinessSuiteB } from "@/components/landingb/BusinessSuiteB";
import { PricingB } from "@/components/landingb/Pricing";
import { FAQB } from "@/components/landingb/FAQ";
import { FooterB } from "@/components/landingb/FooterB";

export default function LandingB() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className={`font-inter min-h-screen transition-colors duration-300 ${dark ? "bg-[#1E1F25] text-white" : "bg-white text-slate-900"}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(166,231,255,0.2); border-radius: 3px; }
      `}</style>

      <HeroB dark={dark} />
      <FeaturesB dark={dark} />
      <TemplateGalleryB dark={dark} />
      <BusinessSuiteB dark={dark} />
      <PricingB dark={dark} />
      <FAQB dark={dark} />
      <FooterB dark={dark} />
    </div>
  );
}
