"use client";

import { DARK, LIGHT } from "@/constants/theme";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const FEATURED_PORTFOLIOS = [
  { name: "Ana Silva", role: "UI/UX Designer", image: "/images/landing-page-images/ana silva.jpeg", category: "Design", size: "large" },
  { name: "Lucas Costa", role: "Frontend Developer", image: "/images/landing-page-images/lucas costa.jpeg", category: "Dev", size: "small" },
  { name: "Beatriz Rocha", role: "Brand Strategist", image: "/images/landing-page-images/beatriz rocha.jpeg", category: "Branding", size: "small" },
  { name: "Gabriel Lima", role: "Fullstack Engineer", image: "/images/landing-page-images/Gabriel Lima.jpeg", category: "Dev", size: "medium" },
  { name: "Carla Mendes", role: "Motion Designer", image: "/images/landing-page-images/carla mendes.jpeg", category: "Motion", size: "small" },
  { name: "Felipe Dias", role: "Product Designer", image: "/images/landing-page-images/felipe dias.jpeg", category: "Product", size: "small" },
];

export function CommunitySection({ dark }: { dark: boolean }) {
  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium mb-4 border ${
              dark ? "bg-[#A6E7FF]/10 border-[#A6E7FF]/20 text-[#A6E7FF]" : "bg-blue-50 border-blue-100 text-blue-600"
            }`}>
              Galeria de Inspiração
            </div>
            <h2 className={`font-poppins text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
              dark ? "text-white" : "text-[#1E2A3A]"
            }`}>
              Portfólios que <span className={dark ? "text-[#A6E7FF]" : "text-blue-600"}>Convertem</span>
            </h2>
            <p className={`font-inter text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}>
              Veja como profissionais de diversas áreas utilizam o Portify para atrair clientes de alto valor e escalar suas carreiras.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {FEATURED_PORTFOLIOS.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={cn(
                "group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 border",
                dark ? "border-slate-700" : "border-slate-200",
                p.size === "large" ? "col-span-2 row-span-2" : p.size === "medium" ? "col-span-1 row-span-2" : "col-span-1 row-span-1"
              )}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-white font-poppins font-bold text-lg">{p.name}</span>
                      <span className="text-slate-300 font-inter text-sm">{p.role}</span>
                      <span className="mt-2 inline-block w-fit px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] rounded-md font-bold uppercase tracking-wider">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
