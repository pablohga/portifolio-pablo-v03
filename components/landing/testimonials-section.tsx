"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Designer UI/UX",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    content: "Esta plataforma me ajudou a conseguir mais clientes do que nunca. Os templates de portfólio são lindos e as opções de personalização são infinitas.",
  },
  {
    name: "Michael Chen",
    role: "Desenvolvedor Frontend",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    content: "Configurar meu portfólio foi muito fácil. Os recursos de SEO melhoraram significativamente minha visibilidade online.",
  },
  {
    name: "Emily Rodriguez",
    role: "Designer Gráfica",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    content: "O melhor investimento que fiz para minha carreira freelancer. Meu portfólio parece profissional e atrai clientes de alta qualidade.",
  },
];

export function TestimonialsSection() {
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
          <h2 className="text-4xl font-bold mb-4">Amado por Freelancers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Junte-se a milhares de freelancers de sucesso que transformaram sua presença online.
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
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
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