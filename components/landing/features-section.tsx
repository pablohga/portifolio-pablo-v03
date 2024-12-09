"use client";

import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Search, Shield, Zap } from "lucide-react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  data?: {
    title: string;
    subtitle: string;
    features: Feature[];
  };
}

const defaultFeatures: Feature[] = [
  {
    icon: "Code2",
    title: "100% Grátis Para Sempre",
    description: "Crie e mantenha seu portfólio profissional totalmente grátis. Sem custos ocultos ou recursos premium.",
  },
  {
    icon: "Search",
    title: "Otimizado para SEO",
    description: "Seja descoberto por clientes com nossas ferramentas de SEO integradas. Ranqueie melhor nos resultados de busca naturalmente.",
  },
  {
    icon: "Zap",
    title: "Extremamente Rápido",
    description: "Construído com Next.js para um desempenho impressionante que agrada visitantes e mecanismos de busca.",
  },
  {
    icon: "Shield",
    title: "Seguro & Confiável",
    description: "Seu portfólio é protegido com segurança de nível empresarial e hospedado em infraestrutura confiável.",
  },
  {
    icon: "Palette",
    title: "Templates Bonitos",
    description: "Escolha entre nossa coleção de templates profissionalmente projetados que fazem seu trabalho brilhar.",
  },
  {
    icon: "Rocket",
    title: "Configuração Rápida",
    description: "Coloque seu portfólio online em minutos com nosso processo intuitivo. Sem necessidade de conhecimentos técnicos.",
  },
];

const iconComponents = {
  Code2,
  Search,
  Zap,
  Shield,
  Palette,
  Rocket,
};

export function FeaturesSection({ data }: FeaturesSectionProps) {
  const features = data?.features || defaultFeatures;
  const title = data?.title || "Tudo Que Você Precisa, Grátis";
  const subtitle = data?.subtitle || "Acreditamos que todo freelancer merece uma presença online profissional. Por isso, tornamos nosso construtor de portfólio completamente gratuito.";

  return (
    <section className="py-20 bg-background/50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconComponents[feature.icon as keyof typeof iconComponents] || Rocket;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300"
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10 text-primary">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}