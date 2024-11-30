"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "É realmente grátis?",
    answer: "Sim! Nosso construtor de portfólio é completamente gratuito para usar. Acreditamos em fornecer valor primeiro e só cobraremos por recursos adicionais de gestão de negócios no futuro.",
  },
  {
    question: "O que está incluído na versão gratuita?",
    answer: "Tudo que você precisa para criar um portfólio profissional: suporte a domínio personalizado, templates bonitos, ferramentas de SEO, analytics e muito mais. Sem restrições de recursos ou custos ocultos.",
  },
  {
    question: "Meu portfólio continuará gratuito quando vocês lançarem recursos premium?",
    answer: "Absolutamente! Seu portfólio sempre será gratuito. Os próximos recursos premium são ferramentas separadas de gestão de negócios que você pode escolher adicionar depois.",
  },
  {
    question: "Posso usar meu próprio domínio?",
    answer: "Sim! Você pode facilmente conectar seu próprio domínio ao seu portfólio. Fornecemos instruções detalhadas e suporte para ajudá-lo a configurar.",
  },
  {
    question: "Preciso de conhecimento técnico?",
    answer: "Não! Nossa plataforma foi projetada para ser amigável e não requer conhecimento de programação. Se você precisar de ajuda, nossa equipe de suporte está aqui para você.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tem dúvidas? Nós temos respostas! Se você não encontrar o que procura, entre em contato com nossa equipe de suporte.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}