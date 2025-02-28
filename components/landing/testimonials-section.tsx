"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TestimonialsSection as TestimonialsSectionType } from "@/types/home";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface TestimonialsSectionProps {
  data?: TestimonialsSectionType;
}



export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const { t, ready } = useTranslation();

  const defaultTestimonials = [
    {
      name: "Sarah Johnson",
      role: "Designer UI/UX",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200",
      content: t("Testimonials.testimonial1"),
    },
    {
      name: "Michael Chen",
      role: "Desenvolvedor Frontend",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200",
      content: t("Testimonials.testimonial2"),
    },
    {
      name: "Emily Rodriguez",
      role: "Designer Gráfica",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200",
      content: t("Testimonials.testimonial3"),
    },
  ];

  // FIX: ADICIONAR CONTEUDO DO data?.testimonials
  const testimonials = /* data?.testimonials || */ defaultTestimonials;
  const title = data?.title || t("Testimonials.title");
  const subtitle = data?.subtitle || t("Testimonials.subtitle");
  
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

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-card"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
