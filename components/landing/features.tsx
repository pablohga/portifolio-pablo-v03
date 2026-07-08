"use client";

import { DARK, LIGHT } from "@/constants/theme";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "./icons";
import { ICONS } from "@/constants/assets";

const FEATURES = [
  { title: "Publicação em segundos", desc: "Coloque seu portfólio no ar instantaneamente sem complicações.", icon: ICONS.fast },
  { title: "Responsivo", desc: "Experiência impecável em qualquer tela, do celular ao desktop.", icon: ICONS.templates },
  { title: "SEO", desc: "Otimizado para que seus clientes te encontrem facilmente no Google.", icon: ICONS.seo },
  { title: "Editor simples", desc: "Altere tudo intuitivamente sem precisar de código.", icon: ICONS.projects },
  { title: "Galeria ilimitada", desc: "Exiba todos os seus melhores trabalhos sem restrições.", icon: ICONS.clients },
  { title: "WhatsApp integrado", desc: "Receba orçamentos diretamente no seu celular.", icon: ICONS.finance },
  { title: "Domínio personalizado", desc: "Sua marca com seu próprio endereço web profissional.", icon: ICONS.templates },
  { title: "Depoimentos", desc: "Converta visitantes em clientes com provas sociais reais.", icon: ICONS.secure },
];

export function FeaturesSection({ dark }: { dark: boolean }) {
  return (
    <section id="features" className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium mb-4 border ${
              dark ? "bg-[#A6E7FF]/10 border-[#A6E7FF]/20 text-[#A6E7FF]" : "bg-blue-50 border-blue-100 text-blue-600"
            }`}>
              Recursos Poderosos
            </div>
            <h2 className={`font-poppins text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
              dark ? "text-white" : "text-[#1E2A3A]"
            }`}>
              Tudo para você <span className={dark ? "text-[#A6E7FF]" : "text-blue-600"}>Crescer</span>
            </h2>
            <p className={`font-inter text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}>
              Mais do que um portfólio, uma ferramenta completa para gerenciar sua carreira freelancer.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} dark={dark} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, dark }: { feature: any; dark: boolean }) {
  return (
    <Reveal delay={0}>
      <div className={`p-8 rounded-3xl border transition-all duration-300 group ${
        dark
          ? "bg-[#2A2B31] border-slate-700 hover:border-[#A6E7FF]/30 hover:bg-[#2A2B31]/80"
          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-xl"
      }`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
          dark ? "bg-[#A6E7FF]/10 text-[#A6E7FF]" : "bg-blue-50 text-blue-600"
        }`}>
          <Icon d={feature.icon} size={28} />
        </div>
        <h4 className={`font-poppins font-bold text-lg mb-3 ${dark ? "text-white" : "text-slate-900"}`}>
          {feature.title}
        </h4>
        <p className={`font-inter text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
          {feature.desc}
        </p>
      </div>
    </Reveal>
  );
}
