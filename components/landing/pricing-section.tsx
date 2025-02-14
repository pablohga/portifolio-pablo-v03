"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { PricingSection as PricingSectionType } from "@/types/home";
import { useTranslation } from "react-i18next"; // Use o hook do react-i18next
import i18next from "@/lib/i18next-config"; // Certifique-se de importar o i18n configurado
import DOMPurify from "isomorphic-dompurify";
import PaymentButton from "../payment-button";
import { useEffect } from "react";

interface PricingSectionProps {
  data?: PricingSectionType;
}

/* const defaultPlans = [
  {
    name: "Grátis",
    {t('pricingSection.plans.0.name')}
    price: "0",
    description: "Perfeito para começar",
    features: [
      "3 Categorias",
      "3 Projetos por Categoria",
      "Portfólio Personalizado",
      "Domínio Personalizado",
      "SEO Otimizado",
      "Suporte por Email",
    ],
    buttonText: "Começar Grátis",
  },
  {
    name: "Pagante",
    price: "29,90",
    description: "Para freelancers estabelecidos",
    features: [
      "Categorias Ilimitadas",
      "Projetos Ilimitados",
      "Portfólio Personalizado",
      "Domínio Personalizado",
      "SEO Otimizado",
      "Suporte Prioritário",
      "Temas Premium",
      "Analytics Avançado",
    ],
    buttonText: "Começar Agora",
    popular: true,
  },
  {
    name: "Premium",
    price: "79,90",
    description: "Solução completa para crescimento",
    features: [
      "Tudo do plano Pagante",
      "Sistema de Gestão de Clientes",
      "Gestão Financeira Completa",
      "Curso: Carreira Freelancer",
      "Mentoria em Grupo",
      "Comunidade VIP",
      "Acesso Antecipado a Recursos",
      "Suporte 24/7",
    ],
    buttonText: "Começar Agora",
  },
]; */

export function PricingSection({ data }: PricingSectionProps) {
  const { t } = useTranslation(); // Use the hook to get translations
  const defaultPlans = [
    {
      name: t('pricingSection.plans.0.name'),
      price: data?.plans[0].price,
      description: t('pricingSection.plans.0.description'),
      features: t('pricingSection.plans.0.features', { returnObjects: true }) as string[],
      buttonText: t('pricingSection.plans.0.buttonText'),
    },
    {
      name: t('pricingSection.plans.1.name'),
      price: data?.plans[1].price,
      description: t('pricingSection.plans.1.description'),
      features: t('pricingSection.plans.1.features', { returnObjects: true }) as string[],
      buttonText: t('pricingSection.plans.1.buttonText'),
      popular: true,
    },
    {
      name: t('pricingSection.plans.2.name'),
      price: data?.plans[2].price,
      description: t('pricingSection.plans.2.description'),
      features: t('pricingSection.plans.2.features', { returnObjects: true }) as string[],
      buttonText: t('pricingSection.plans.2.buttonText'),
    },
  ];
  const plans = /* data?.plans || */ defaultPlans;
  const title = /* data?.title || */ t("pricingSection.title");
  const subtitle = /* data?.subtitle || */ t("pricingSection.subtitle");

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(title),
          }} suppressHydrationWarning={true} />
        
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(subtitle),
          }} suppressHydrationWarning={true}/>

        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-lg bg-card border ${
                plan.popular ? "border-primary" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2"
                dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(plan.name),
                }} suppressHydrationWarning={true} />

                <p className="text-muted-foreground mb-4"
                dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(plan.description),
                }} suppressHydrationWarning={true} />

                <div className="mb-4">
                  <span className="text-4xl font-bold"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(`$ ${plan.price}`),
                    }} suppressHydrationWarning={true}/>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link
                    href="/auth/register"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(plan.buttonText),
                    }}
                    suppressHydrationWarning={true}
                  />
                </Button>

              </div>
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(feature),
                      }}
                      suppressHydrationWarning={true}
                    />
                  </li>
                ))}
              </ul>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}