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
    question: "Is it really free?",
    answer: "Yes! Our portfolio builder is completely free to use. We believe in providing value first and will only charge for additional business management features in the future.",
  },
  {
    question: "What's included in the free version?",
    answer: "Everything you need to create a professional portfolio: custom domain support, beautiful templates, SEO tools, analytics, and more. No feature restrictions or hidden costs.",
  },
  {
    question: "Will my portfolio remain free when you launch premium features?",
    answer: "Absolutely! Your portfolio will always be free. The upcoming premium features are separate business management tools that you can choose to add later.",
  },
  {
    question: "Can I use my own domain name?",
    answer: "Yes! You can easily connect your own domain name to your portfolio. We provide detailed instructions and support to help you set it up.",
  },
  {
    question: "Do I need technical knowledge?",
    answer: "Not at all! Our platform is designed to be user-friendly and requires no coding knowledge. If you ever need help, our support team is here for you.",
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
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers! If you can't find what you're looking for, reach out to our support team.
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