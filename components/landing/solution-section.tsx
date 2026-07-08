"use client";

import { Reveal } from "@/components/ui/reveal";
import { CheckCircle2, XCircle } from "lucide-react";

export function SolutionSection({ dark }: { dark: boolean }) {
  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className={`font-poppins text-3xl md:text-5xl font-bold mb-6 ${dark ? "text-white" : "text-slate-900"}`}>
              A diferença entre ser visto <br />
              <span className="text-[#7EDCFF]">como amador ou profissional.</span>
            </h2>
            <p className={`text-xl font-bold text-[#7EDCFF]`}>
              O problema não é seu trabalho, mas como você o apresenta.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col justify-center space-y-8">
            <Reveal delay={200}>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h3 className={`font-poppins font-bold text-xl ${dark ? "text-red-400" : "text-red-600"}`}>
                    Sem o Portify
                  </h3>
                  <p className={`text-lg font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
                    Você ainda perde clientes porque...
                  </p>
                </div>
                <div className="grid gap-4">
                  {[
                    "envia fotos no WhatsApp",
                    "usa PDF desatualizado",
                    "Instagram bagunçado",
                    "demora para responder",
                    "não transmite confiança",
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                      dark ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-200 text-red-600"
                    }`}>
                      <XCircle className="w-5 h-5 shrink-0" />
                      <span className="font-inter text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <Reveal delay={400}>
              <div className={`p-8 rounded-3xl border-2 border-dashed transition-all duration-300 ${
                dark ? "border-green-500/30 bg-green-500/5" : "border-green-500/20 bg-green-50"
              }`}>
                <div className="flex flex-col gap-2 mb-6">
                  <h3 className={`font-poppins font-bold text-xl ${dark ? "text-green-400" : "text-green-600"}`}>
                    Com o Portify
                  </h3>
                  <p className={`text-xl font-bold font-poppins ${dark ? "text-white" : "text-slate-900"}`}>
                    Então: Imagine enviar apenas um link.
                  </p>
                </div>
                <div className="space-y-4">
                  <p className={`text-sm font-medium mb-4 opacity-70 ${dark ? "text-slate-300" : "text-slate-600"}`}>
                    Seu cliente vê:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "seus trabalhos",
                      "depoimentos",
                      "serviços",
                      "botão de orçamento",
                      "WhatsApp",
                      "redes sociais",
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        dark ? "bg-green-500/10 text-green-400" : "bg-white shadow-sm text-slate-900 border border-green-100"
                      }`}>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="font-inter text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className={`mt-6 text-center font-bold text-lg font-poppins ${dark ? "text-green-400" : "text-green-600"}`}>
                    Tudo organizado.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
