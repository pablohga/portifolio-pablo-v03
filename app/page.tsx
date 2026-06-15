"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { LOGO_DARK, LOGO_LIGHT } from "@/constants/assets";
import { DARK, LIGHT } from "@/constants/theme";

import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features";
import { CommunitySection } from "@/components/landing/community";
import { TestimonialsWrapper } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing";
import { FAQSection, CTASection } from "@/components/landing/faq";

function Footer({ dark }: { dark?: boolean }) {
  const c = dark ? DARK : LIGHT;
  return (
    <footer className={`py-10 px-4 sm:px-6 lg:px-8 border-t ${
      dark ? "bg-[#17181E] border-white/5" : "bg-[#E8E8E8] border-black/5"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-6">
        <Image src={dark ? LOGO_DARK : LOGO_LIGHT} alt="Portify" width={100} height={22} style={{ height: 22, width: 'auto', objectFit: "contain" }} />
        <div className="flex gap-6">
          {["Termos de Uso", "Política de Privacidade", "Configurações"].map(l => (
            <a key={l} href="#" className={`font-inter text-xs transition-colors ${dark ? "text-slate-500 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>
              {l}
            </a>
          ))}
        </div>
        <div className={`font-inter text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
          © 2025 Portify. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

export default function PortifyLanding() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className={`font-inter min-h-screen transition-colors duration-300 ${dark ? "bg-[#1E1F25] text-white" : "bg-white text-slate-900"}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(166,231,255,0.2); border-radius: 3px; }
      `}</style>

      <HeroSection dark={dark} />
      <HowItWorksSection dark={dark} />
      <FeaturesSection dark={dark} />
      <CommunitySection dark={dark} />
      <TestimonialsWrapper dark={dark} />
      <PricingSection dark={dark} />
      <FAQSection dark={dark} />
      <CTASection dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}
