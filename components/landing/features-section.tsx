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
    <section className="py-10 bg-top bg-center bg-no-repeat sm:bg-contain md:bg-cover lg:bg-contain  bg-[url('https://mundonews.pt/portify/hero_footer.png')]">
      <div className="container px-4 mx-auto max-w-[960px]">
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
                className="p-6 bg-contain bg-no-repeat bg-[url('https://mundonews.pt/portify/card-top.png')] rounded-lg bg-card hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300"
              >
                <div className="flex gap-5 items-center mb-1 inline-block px-4 py-0 rounded-lg text-primary md:bg-cover">
                {/* <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10 text-primary"> */}
                  <IconComponent className="h-8 w-8" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                </div>
                <div className="max-w-[280px] bg-contain bg-[url('https://mundonews.pt/portify/card-body.png')]">
                  <p className="pl-7 w-[200px] text-muted-foreground ">
                    {feature.description}
                  </p>
                </div>
                <div className="max-w-[280px] h-[80px] bg-no-repeat  bg-[url('https://mundonews.pt/portify/card-bottom.png')]">
                  
                    <br />
                  
                </div>
                
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}