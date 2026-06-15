"use client";

import { useState } from "react";
import { DARK, LIGHT } from "@/constants/theme";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "./icons";
import { ICONS } from "@/constants/assets";

const FAQS = [
  {
    q: "Quanto tempo leva para criar meu portfólio?",
    a: "Se você já tiver seus projetos e fotos, você pode estar online em menos de 10 minutos. Nosso processo de configuração é extremamente simplificado.",
  },
  {
    q: "O plano gratuito tem alguma limitação real?",
    a: "O plano gratuito é perfeito para quem está começando. Você tem tudo o que precisa para ter uma presença profissional: domínio personalizado, SEO e templates lindos. Conforme você cresce, pode migrar para planos com gestão de clientes e finanças.",
  },
  {
    q: "Posso usar meu próprio domínio?",
    a: "Sim! Todos os nossos planos, incluindo o gratuito, permitem que você conecte seu domínio personalizado para manter total autoridade sobre sua marca.",
  },
  {
    q: "Como funciona a migração entre planos?",
    a: "Você pode fazer upgrade ou downgrade a qualquer momento. Se fizer upgrade, as novas funções são liberadas instantaneamente.",
  },
  {
    q: "Preciso de conhecimentos técnicos para configurar?",
    a: "Absolutamente nenhum. Nossa plataforma foi desenhada para que você foque no seu trabalho, enquanto nós cuidamos de toda a parte técnica, hospedagem e performance.",
  },
];

export function FAQSection({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-white"}`}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium mb-4 border ${
              dark ? "bg-[#A6E7FF]/10 border-[#A6E7FF]/20 text-[#A6E7FF]" : "bg-blue-50 border-blue-100 text-blue-600"
            }`}>
              Dúvidas Comuns
            </div>
            <h2 className={`font-poppins text-3xl md:text-4xl font-bold mb-4 ${
              dark ? "text-white" : "text-[#1E2A3A]"
            }`}>
              Perguntas Frequentes
            </h2>
            <p className={`font-inter text-base ${dark ? "text-slate-400" : "text-slate-600"}`}>
              Tudo o que você precisa saber para começar com confiança.
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className={`rounded-2xl border transition-all duration-300 ${
                open === i
                  ? dark ? "bg-[#2A2B31] border-blue-500/50" : "bg-white border-blue-300 shadow-md"
                  : dark ? "bg-transparent border-slate-700" : "bg-transparent border-slate-200"
              }`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className={`font-poppins font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                    open === i ? "rotate-45" : ""
                  } ${dark ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <Icon d={ICONS.plus} size={16} />
                  </div>
                </button>
                {open === i && (
                  <div className={`px-6 pb-6 font-inter text-sm leading-relaxed transition-all ${
                    dark ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection({ dark }: { dark: boolean }) {
  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
      dark ? "bg-[#1E1F25]" : "bg-blue-600"
    }`}>
      {/* Decorative Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none ${
        dark ? "bg-blue-400" : "bg-white"
      }`} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal>
          <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium mb-6 border ${
            dark ? "bg-[#A6E7FF]/10 border-[#A6E7FF]/20 text-[#A6E7FF]" : "bg-white/20 border-white/30 text-white"
          }`}>
            Sua Carreira Não Pode Esperar
          </div>
          <h2 className={`font-poppins text-4xl md:text-6xl font-bold mb-6 leading-tight ${
            dark ? "text-white" : "text-white"
          }`}>
            Construa Seu Futuro <br />
            <span className={dark ? "text-[#A6E7FF]" : "text-blue-200"}>Hoje Mesmo</span>
          </h2>
          <p className={`font-inter text-lg mb-10 leading-relaxed ${
            dark ? "text-slate-400" : "text-blue-100"
          }`}>
            Junte-se a mais de 10.000 profissionais que pararam de ser invisíveis e começaram a atrair os melhores clientes do mercado.
          </p>
          <a
            href="#"
            className={`inline-flex items-center justify-center px-10 py-4 rounded-xl font-poppins font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              dark
                ? "bg-gradient-to-r from-[#A6E7FF] to-[#7EDCFF] text-slate-900 shadow-xl shadow-blue-500/20"
                : "bg-white text-blue-600 shadow-xl shadow-black/10"
            }`}
          >
            Criar Meu Portfólio Grátis →
          </a>
          <p className={`mt-6 font-inter text-xs ${dark ? "text-slate-500" : "text-blue-200"}`}>
            Sem cartão de crédito · Configuração em 5 minutos · 100% Grátis para começar
          </p>
        </Reveal>
      </div>
    </section>
  );
}
