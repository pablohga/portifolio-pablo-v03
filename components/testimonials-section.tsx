"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { Testimonial } from "@/types/testimonial";

interface TestimonialsSectionProps {
  userId?: string;
  initialTestimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
  dark?: boolean;
}

export function TestimonialsSection({
  userId,
  initialTestimonials = [],
  title = "Depoimentos",
  subtitle = "O que meus clientes dizem sobre o meu trabalho"
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isLoading, setIsLoading] = useState(!initialTestimonials.length);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setIsLoading(true);
        const url = userId ? `/api/testimonials?userId=${userId}` : "/api/testimonials";
        const response = await fetch(url);
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!initialTestimonials || initialTestimonials.length === 0) {
      fetchTestimonials();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 bg-background">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4"> {title}</h2>
          <p className="text-muted-foreground">Carregando depoimentos...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Não exibe a seção se não houver depoimentos
  }

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container px-4 mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-lg mx-auto max-w-2xl">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 hover:border-[#5221e6]/50 transition-all duration-500 group">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#5221e6] transition-all duration-500">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
