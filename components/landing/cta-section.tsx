"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CTASection as CTASectionType } from "@/types/home";

interface CTASectionProps {
  data?: CTASectionType;
}

export function CTASection({ data }: CTASectionProps) {
  const title = data?.title || "Comece a Criar Seu Portfólio Gratuito Hoje";
  const subtitle = data?.subtitle || "Junte-se a milhares de freelancers que estão mostrando seu trabalho e atraindo melhores clientes com nossa plataforma.";
  const buttonText = data?.buttonText || "Criar Seu Portfólio";
  const features = data?.features || ["100% Grátis", "Sem Cartão de Crédito", "Configure em Minutos"];

  return (
    <section className="py-20 bg-primary">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4 text-primary-foreground">
            {title}
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-primary-foreground/80">
            {features.join(" • ")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}