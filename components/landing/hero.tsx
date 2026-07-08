"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { DARK, LIGHT } from "@/constants/theme";
import { HERO_DARK, HERO_LIGHT } from "@/constants/assets";
import { Reveal } from "@/components/ui/reveal";

function CTAButton({
  children,
  href = "#",
  primary = true,
  large = false,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  primary?: boolean;
  large?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`
        inline-flex items-center justify-center gap-2 font-poppins font-semibold transition-all duration-300 rounded-lg
        ${large ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"}
        ${primary
          ? "bg-gradient-to-br from-[#A6E7FF] to-[#7EDCFF] text-slate-900 shadow-[0_0_20px_rgba(166,231,255,0.3)] hover:shadow-[0_0_30px_rgba(166,231,255,0.5)] hover:-translate-y-0.5"
          : "border-1.5 border-[#A6E7FF] text-[#A6E7FF] hover:bg-[#A6E7FF]/10"}
        ${className}
      `}
    >
      {children}
    </a>
  );
}

export function HeroSection({ dark }: { dark: boolean }) {
  const c = dark ? DARK : LIGHT;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${dark ? "bg-[#1E1F25]" : "bg-[#F5F5F5]"}`}>
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${dark ? HERO_DARK : HERO_LIGHT})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      />

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 z-10 ${
        dark
          ? "bg-gradient-to-r from-[#071B3B] via-[#071B3B]/80 to-transparent"
          : "bg-gradient-to-r from-[#F8F7F5] via-[#F8F7F5]/90 to-transparent"
      }`} />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <Reveal>
            <h1 className={`font-poppins text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 transition-all duration-700 ${
              dark ? "text-white" : "text-[#1E2A3A]"
            }`}>
              Seu portfólio profissional <br />
              <span className="inline-block bg-gradient-to-br from-[#A6E7FF] to-[#7EDCFF] bg-clip-text text-transparent">
                pronto em menos de 5 minutos.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className={`font-inter text-lg leading-relaxed mb-10 max-w-lg ${dark ? "text-slate-300" : "text-slate-600"}`}>
              Conquiste mais clientes, transmita autoridade e envie um link que vende por você.
            </p>
          </Reveal>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Reveal delay={400}>
              <CTAButton primary large href="#pricing">
                Criar meu portfólio grátis
              </CTAButton>
            </Reveal>
          </div>

          {/* Trust Bar */}
          <Reveal delay={600}>
            <div className={`flex flex-wrap items-center gap-6 ${dark ? "text-white" : "text-slate-900"}`}>
              {[
                { label: "Sem cartão" },
                { label: "Publicação imediata" },
                { label: "Plano gratuito para sempre" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span className="font-inter text-sm font-medium opacity-80">{stat.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t ${
        dark ? "from-[#1E1F25] to-transparent" : "from-[#F5F5F5] to-transparent"
      }`} />
    </section>
  );
}
