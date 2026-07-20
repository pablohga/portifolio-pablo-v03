"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, CheckCircle2, Wallet, UserPlus } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, items, dark }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl group ${
        dark
          ? "bg-[#161C24] border-white/10 hover:border-blue-500/50"
          : "bg-white border-slate-200 hover:border-blue-600/50"
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white ${
        dark ? "bg-white/5 text-blue-400" : "bg-slate-100 text-blue-600"
      }`}>
        <Icon size={28} />
      </div>

      <h3 className={`text-2xl font-bold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
        {title}
      </h3>

      <p className={`text-lg mb-8 ${dark ? "text-slate-400" : "text-slate-600"}`}>
        {description}
      </p>

      <ul className="space-y-4">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0" />
            <span className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export function BusinessSuiteB({ dark }: { dark?: boolean }) {
  return (
    <section id="business-suite" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${dark ? "text-white" : "text-slate-900"}`}>
            Transforme seu portfólio em uma <br />
            <span className="text-blue-600">empresa lucrativa.</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>
            Pare de apenas mostrar seu trabalho. Comece a gerir seu negócio com ferramentas profissionais de CRM e Finanças integradas ao seu site.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureCard
          icon={Users}
          title="Sistema de Gestão de Clientes"
          description="Transforme visitantes em clientes fiéis. Controle todo o ciclo de vida do seu lead, desde o primeiro contato até a entrega final do projeto."
          items={[
            "Funil de vendas intuitivo (Leads → Projetos)",
            "Histórico completo de interações por cliente",
            "Gestão de status de projetos em tempo real",
            "Lembretes de follow-up automáticos"
          ]}
          dark={dark}
        />
        <FeatureCard
          icon={Wallet}
          title="Gestão Financeira Completa"
          description="Tenha controle total sobre seu dinheiro. Saiba exatamente quanto está ganhando, o que tem a receber e onde pode otimizar seus lucros."
          items={[
            "Emissão de faturas e controle de pagamentos",
            "Dashboard de receita mensal e anual",
            "Cálculo de lucratividade por projeto",
            "Relatórios financeiros para tomada de decisão"
          ]}
          dark={dark}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className={`mt-16 p-8 rounded-3xl text-center relative overflow-hidden ${
          dark ? "bg-blue-600/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"
        }`}
      >
        <div className="relative z-10">
          <h4 className={`text-xl font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>
            Pronto para escalar seu negócio?
          </h4>
          <p className={`mb-6 ${dark ? "text-slate-400" : "text-slate-600"}`}>
            Essas funcionalidades estão disponíveis nos nossos planos pagos.
          </p>
          <a href="#pricing" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all hover:scale-105">
            Ver Planos <TrendingUp size={18} />
          </a>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      </motion.div>
    </section>
  );
}
