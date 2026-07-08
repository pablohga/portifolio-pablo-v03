"use client";

import { Reveal } from "@/components/ui/reveal";

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
            href="#pricing"
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
