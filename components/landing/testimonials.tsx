"use client";

import { DARK, LIGHT } from "@/constants/theme";
import { Reveal } from "@/components/ui/reveal";
import { TestimonialsSection as DynamicTestimonials } from "@/components/testimonials-section";

export function TestimonialsWrapper({ dark }: { dark: boolean }) {
  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-[#F8F9FA]"}`}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium mb-4 border ${
              dark ? "bg-[#A6E7FF]/10 border-[#A6E7FF]/20 text-[#A6E7FF]" : "bg-blue-50 border-blue-100 text-blue-600"
            }`}>
              Depoimentos
            </div>
            <h2 className={`font-poppins text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
              dark ? "text-white" : "text-[#1E2A3A]"
            }`}>
              Amado por <span className={dark ? "text-[#A6E7FF]" : "text-blue-600"}>Profissionais</span>
            </h2>
            <p className={`font-inter text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}>
              Veja como nossa plataforma está ajudando freelancers a conquistar mais clientes e valorizar seu trabalho.
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <DynamicTestimonials dark={dark} />
        </div>
      </div>
    </section>
  );
}
