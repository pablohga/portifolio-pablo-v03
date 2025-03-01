"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQSection as FAQSectionType } from "@/types/home";
import { useTranslation } from "react-i18next";

interface FAQSectionProps {
  data?: FAQSectionType;
}

export function FAQSection({ data }: FAQSectionProps) {
  const { t, ready } = useTranslation();

  const defaultFAQs = [
    {
      question: t('FAQ.question1'),
      answer: t('FAQ.answer1'),
    },
    {
      question: t('FAQ.question2'),
      answer: t('FAQ.answer2'),
    },
    {
      question: t('FAQ.question3'),
      answer: t('FAQ.answer3'),
    },
    {
      question: t('FAQ.question4'),
      answer: t('FAQ.answer4'),
    },
    {
      question: t('FAQ.question5'),
      answer: t('FAQ.answer5'),
    },
  ];

  // FIX QUANDO ESTIVER COM TODAS AS LINGUAGENS NO BANCO DE DADOS
  const faqs = /* data?.faqs || */ defaultFAQs;
  const title = /* data?.title || */ t("FAQ.title");
  const subtitle = /* data?.subtitle || */ t("FAQ.subtitle");

  return (
    <section className="py-20 bg-background">
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
