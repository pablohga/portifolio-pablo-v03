"use client";

import { DARK, LIGHT } from "@/constants/theme";
import { Reveal } from "@/components/ui/reveal";

const FEATURED_PORTFOLIOS = [
  { name: "Ana Silva", role: "UI/UX Designer", image: "/images/landing-page-images/ana silva.jpeg", category: "Design" },
  { name: "Lucas Costa", role: "Frontend Developer", image: "/images/landing-page-images/lucas costa.jpeg", category: "Dev" },
  { name: "Beatriz Rocha", role: "Brand Strategist", image: "/images/landing-page-images/beatriz rocha.jpeg", category: "Branding" },
  { name: "Gabriel Lima", role: "Fullstack Engineer", image: "/images/landing-page-images/Gabriel Lima.jpeg", category: "Dev" },
  { name: "Carla Mendes", role: "Motion Designer", image: "/images/landing-page-images/carla mendes.jpeg", category: "Motion" },
  { name: "Felipe Dias", role: "Product Designer", image: "/images/landing-page-images/felipe dias.jpeg", category: "Product" },
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
              Comunidade
            </div>
            <h2 className={`font-poppins text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
              dark ? "text-white" : "text-[#1E2A3A]"
            }`}>
              Feito por <span className={dark ? "text-[#A6E7FF]" : "text-blue-600"}>Freelancers</span>, para Freelancers
            </h2>
            <p className={`font-inter text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}>
              Junte-se a milhares de profissionais que já transformaram sua presença online.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {FEATURED_PORTFOLIOS.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={`group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 ${
                dark ? "border border-slate-700" : "border border-slate-200"
              }`}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex flex-col">
                    <span className="text-white font-poppins font-bold text-lg">{p.name}</span>
                    <span className="text-slate-300 font-inter text-sm">{p.role}</span>
                    <span className="mt-2 inline-block w-fit px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] rounded-md font-bold uppercase tracking-wider">
                      {p.category}
                    </span>
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
