"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
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
            Comece a Criar Seu Portfólio Gratuito Hoje
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Junte-se a milhares de freelancers que estão mostrando seu trabalho e atraindo melhores clientes com nossa plataforma.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            Criar Seu Portfólio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-primary-foreground/80">
            100% Grátis • Sem Cartão de Crédito • Configure em Minutos
          </p>
        </motion.div>
      </div>
    </section>
  );
}