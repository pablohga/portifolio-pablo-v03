"use client";

import { DARK, LIGHT } from "@/constants/theme";
import { Reveal } from "@/components/ui/reveal";

const FEATURED_PORTFOLIOS = [
  { name: "Ana Silva", role: "UI/UX Designer", image: "https://images.unsplash.com/photo-1507003211169-186a95359742?w=400&h=300&fit=crop", category: "Design" },
  { name: "Lucas Costa", role: "Frontend Developer", image: "https://images.unsplash.com/photo-1498050108241-ab65da3446d5?w=400&h=300&fit=crop", category: "Dev" },
  { name: "Beatriz Rocha", role: "Brand Strategist", image: "https://images.unsplash.com/photo-148736625C88-E3953a7c67a6?w=400&h=300&fit=crop", category: "Branding" },
  { name: "Gabriel Lima", role: "Fullstack Engineer", image: "https://images.unsplash.com/photo-1519389971654-97C74d7602b8?w=400&h=300&fit=crop", category: "Dev" },
  { name: "Carla Mendes", role: "Motion Designer", image: "https://images.unsplash.com/photo-1550745165-9bc098f04669?w=400&h=300&fit=crop", category: "Motion" },
  { name: "Felipe Dias", role: "Product Designer", image: "https://images.unsplash.com/photo-1531427186611-0057c287e8e7?w=400&h=300&fit=crop", category: "Product" },
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
