"use client";

import { DARK, LIGHT } from "@/constants/theme";
import { Reveal } from "@/components/ui/reveal";
import { ICONS } from "@/constants/assets";
import { Icon } from "./icons"; // I'll create this helper as well

const STEPS = [
  {
    title: "Escolha Seu Template",
    desc: "Selecione um design profissional cuidadosamente criado para destacar seu nicho e atrair os clientes certos.",
    icon: ICONS.templates,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Curate Seu Trabalho",
    desc: "Adicione seus melhores projetos, defina suas competências e personalize cada detalhe para refletir sua identidade.",
    icon: ICONS.projects,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Otimize para Crescimento",
    desc: "Nossa plataforma já vem com SEO integrado e performance ultra-rápida para você ser encontrado no Google.",
    icon: ICONS.seo,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Lance e Converta",
    desc: "Publique seu portfólio em segundos e comece a transformar visitantes em leads qualificados automaticamente.",
    icon: ICONS.fast,
    color: "bg-orange-500/10 text-orange-500",
  },
];

export function HowItWorksSection({ dark }: { dark: boolean }) {
  const c = dark ? DARK : LIGHT;

  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-[#F8F9FA]"}`}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium mb-4 border ${
              dark ? "bg-[#A6E7FF]/10 border-[#A6E7FF]/20 text-[#A6E7FF]" : "bg-blue-50 border-blue-100 text-blue-600"
            }`}>
              Processo Simples
            </div>
            <h2 className={`font-poppins text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
              dark ? "text-white" : "text-[#1E2A3A]"
            }`}>
              Do Zero ao Portfólio <span className={dark ? "text-[#A6E7FF]" : "text-blue-600"}>Profissional</span>
            </h2>
            <p className={`font-inter text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}>
              Não importa se você é um designer, desenvolvedor ou redator. Nosso processo é intuitivo e rápido.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className={`p-8 rounded-2xl transition-all duration-300 border ${
                dark
                  ? "bg-[#2A2B31] border-slate-700 hover:border-[#A6E7FF]/30 hover:bg-[#2A2B31]/80"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-xl"
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${step.color}`}>
                    <Icon d={step.icon} size={24} />
                  </div>
                  <span className={`font-poppins font-bold text-lg ${dark ? "text-white" : "text-slate-900"}`}>
                    0{i + 1}
                  </span>
                </div>
                <h3 className={`font-poppins font-semibold text-xl mb-3 ${dark ? "text-white" : "text-slate-900"}`}>
                  {step.title}
                </h3>
                <p className={`font-inter text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
