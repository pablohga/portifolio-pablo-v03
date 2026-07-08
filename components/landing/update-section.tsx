"use client";

import { Reveal } from "@/components/ui/reveal";
import { ArrowRight } from "lucide-react";

export function UpdateSection({ dark }: { dark: boolean }) {
  const comparisons = [
    { antes: "📱 Instagram", depois: "🌐 Um site profissional." },
    { antes: "PDF", depois: "Link profissional." },
    { antes: "Explicando tudo para cada cliente.", depois: "Seu portfólio vende sozinho." },
  ];

  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className={`font-poppins text-4xl md:text-5xl font-bold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
              Se atualize!
            </h2>
            <p className={`font-inter text-lg ${dark ? "text-slate-400" : "text-slate-600"}`}>
              Pare de usar métodos obsoletos e profissionalize sua captação.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {comparisons.map((comp, i) => (
            <Reveal key={i} delay={i * 200}>
              <div className={`p-8 rounded-3xl border transition-all duration-500 group hover:-translate-y-2 ${
                dark ? "bg-[#2A2B31] border-slate-700" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="space-y-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>Antes</span>
                    <p className={`text-lg font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{comp.antes}</p>
                  </div>

                  <div className={`p-3 rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 ${
                    dark ? "bg-[#A6E7FF]/10 text-[#A6E7FF]" : "bg-blue-50 text-blue-600"
                  }`}>
                    <ArrowRight className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-primary" : "text-blue-600"}`}>Depois</span>
                    <p className={`text-xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{comp.depois}</p>
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
