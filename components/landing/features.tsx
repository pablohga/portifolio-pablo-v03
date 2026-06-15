"use client";

import { DARK, LIGHT } from "@/constants/theme";
import { ICONS } from "@/constants/assets";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "./icons";

const FEATURES = {
  growth: [
    {
      title: "SEO de Alta Performance",
      desc: "Seja encontrado pelos clientes certos com nossas tags otimizadas e indexação acelerada.",
      icon: ICONS.seo,
      size: "large",
    },
    {
      title: "Domínio Personalizado",
      desc: "Aumente sua autoridade com seu próprio endereço web.",
      icon: ICONS.templates,
      size: "small",
    },
  ],
  management: [
    {
      title: "CRM de Freelancers",
      desc: "Gerencie seus leads e clientes em um único lugar, sem precisar de planilhas complexas.",
      icon: ICONS.clients,
      size: "medium",
    },
    {
      title: "Gestão Financeira",
      desc: "Acompanhe seus ganhos e despesas em tempo real.",
      icon: ICONS.finance,
      size: "small",
    },
    {
      title: "Controle de Projetos",
      desc: "Defina prazos, marcos e organize suas entregas com eficiência.",
      icon: ICONS.projects,
      size: "small",
    },
  ],
  speed: [
    {
      title: "Setup em 5 Minutos",
      desc: "Escolha um template, adicione seus projetos e esteja online instantaneamente.",
      icon: ICONS.fast,
      size: "medium",
    },
    {
      title: "Hospedagem Segura",
      desc: "Seus dados protegidos com infraestrutura de nível empresarial.",
      icon: ICONS.secure,
      size: "small",
    },
  ],
};

export function FeaturesSection({ dark }: { dark: boolean }) {
  const c = dark ? DARK : LIGHT;

  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-white"}`}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Growth Column */}
          <div className="space-y-6">
            <h3 className={`font-poppins font-bold text-lg mb-4 flex items-center gap-2 ${dark ? "text-slate-300" : "text-slate-700"}`}>
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Crescimento
            </h3>
            {FEATURES.growth.map((f, i) => (
              <FeatureCard key={i} feature={f} dark={dark} />
            ))}
          </div>

          {/* Management Column */}
          <div className="space-y-6">
            <h3 className={`font-poppins font-bold text-lg mb-4 flex items-center gap-2 ${dark ? "text-slate-300" : "text-slate-700"}`}>
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Gestão
            </h3>
            {FEATURES.management.map((f, i) => (
              <FeatureCard key={i} feature={f} dark={dark} />
            ))}
          </div>

          {/* Speed Column */}
          <div className="space-y-6">
            <h3 className={`font-poppins font-bold text-lg mb-4 flex items-center gap-2 ${dark ? "text-slate-300" : "text-slate-700"}`}>
              <span className="w-2 h-2 rounded-full bg-green-500" /> Agilidade
            </h3>
            {FEATURES.speed.map((f, i) => (
              <FeatureCard key={i} feature={f} dark={dark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, dark }: { feature: any; dark: boolean }) {
  return (
    <Reveal>
      <div className={`p-6 rounded-2xl border transition-all duration-300 group ${
        dark
          ? "bg-[#2A2B31] border-slate-700 hover:border-[#A6E7FF]/30 hover:bg-[#2A2B31]/80"
          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md"
      }`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
          dark ? "bg-[#A6E7FF]/10 text-[#A6E7FF]" : "bg-blue-50 text-blue-600"
        }`}>
          <Icon d={feature.icon} size={20} />
        </div>
        <h4 className={`font-poppins font-semibold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>
          {feature.title}
        </h4>
        <p className={`font-inter text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
          {feature.desc}
        </p>
      </div>
    </Reveal>
  );
}
