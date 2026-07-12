"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Eu preciso saber programar para usar o Portify?",
    answer: "Absolutamente não. O Portify foi criado para que qualquer pessoa, independente de conhecimento técnico, possa criar um site profissional usando nosso editor visual de arraste-e-solte."
  },
  {
    question: "Posso usar meu próprio domínio?",
    answer: "Sim! Você pode conectar seu domínio personalizado (.com, .net, .art, etc.) facilmente nas configurações de conta."
  },
  {
    question: "Quanto tempo leva para criar meu primeiro portfólio?",
    answer: "Com nossos templates pré-configurados, a maioria dos usuários consegue publicar sua primeira versão em menos de 30 minutos."
  },
  {
    question: "O Portify é gratuito?",
    answer: "Temos um plano gratuito robusto para quem está começando. À medida que sua carreira cresce, oferecemos planos premium com mais recursos e suporte."
  }
];

export function FAQB({ dark }: { dark?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className={`text-3xl md:text-5xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>
          Dúvidas Frequentes
        </h2>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, i) => (
          <div
            key={i}
            className={`border rounded-xl transition-colors ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-4 text-left flex justify-between items-center gap-4"
            >
              <span className={`font-medium ${dark ? "text-white" : "text-slate-900"}`}>{item.question}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === i ? "rotate-180" : ""} ${dark ? "text-slate-400" : "text-slate-500"}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`px-6 pb-4 text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
