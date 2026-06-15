"use client";

import { DARK, LIGHT } from "@/constants/theme";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "./icons";
import { ICONS } from "@/constants/assets";

const PLANS = [
  {
    name: "Grátis",
    tagline: "Perfeito para começar",
    price: "R$ 0",
    period: "/mês",
    cta: "Começar Grátis",
    featured: false,
    features: ["3 Categorias", "3 Projetos por Categoria", "Portfólio Personalizado", "Domínio Personalizado", "SEO Otimizado", "Suporte por Email"],
  },
  {
    name: "Premium",
    tagline: "A escolha dos profissionais",
    price: "R$ 24,90",
    period: "/mês",
    cta: "Assinar Premium",
    featured: true,
    features: ["Tudo do plano Básico", "Sistema de Gestão de Clientes", "Gestão Financeira Completa", "Curso Carreira Freelancer", "Mentoria em Grupo", "Comunidade VIP", "Acesso Antecipado", "Suporte 24/7"],
  },
  {
    name: "Básico",
    tagline: "Para freelancers em crescimento",
    price: "R$ 14,90",
    period: "/mês",
    cta: "Escolher Básico",
    featured: false,
    features: ["Categorias ilimitadas", "Projetos ilimitados", "Portfólio Personalizado", "Domínio Personalizado", "Otimizado para SEO", "Suporte Prioritário", "Temas Premium", "Analytics Avançado"],
  },
];

export function PricingSection({ dark }: { dark: boolean }) {
  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium mb-4 border ${
              dark ? "bg-[#A6E7FF]/10 border-[#A6E7FF]/20 text-[#A6E7FF]" : "bg-blue-50 border-blue-100 text-blue-600"
            }`}>
              Planos e Preços
            </div>
            <h2 className={`font-poppins text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
              dark ? "text-white" : "text-[#1E2A3A]"
            }`}>
              Investimento <span className={dark ? "text-[#A6E7FF]" : "text-blue-600"}>Transparente</span>
            </h2>
            <p className={`font-inter text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}>
              Escolha o plano que melhor se adapta ao seu momento atual. Mude quando quiser.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.featured
                  ? "bg-gradient-to-b from-blue-500/10 to-transparent border-blue-500 shadow-2xl scale-105 z-10"
                  : dark ? "bg-[#2A2B31] border-slate-700" : "bg-white border-slate-200"
              }`}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Mais Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`font-poppins font-bold text-2xl mb-2 ${dark ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`font-inter text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.tagline}
                  </p>
                </div>

                <div className="text-center mb-8">
                  <span className={`font-poppins font-bold text-4xl ${dark ? "text-white" : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`font-inter text-sm ml-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.period}
                  </span>
                </div>

                <a
                  href="#"
                  className={`w-full flex items-center justify-center py-3 rounded-xl font-poppins font-semibold transition-all duration-300 mb-8 ${
                    plan.featured
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                      : dark ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {plan.cta}
                </a>

                <div className="space-y-4">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        dark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"
                      }`}>
                        <Icon d={ICONS.check} size={10} />
                      </div>
                      <span className={`font-inter text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
