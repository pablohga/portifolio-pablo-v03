"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const templates = [
  { name: "Modernista", category: "Arquitetura", image: "/images/landing-page-images/template_modernista.png" },
  { name: "Minimal", category: "Design Gráfico", image: "/images/landing-page-images/template_minimalista.png" },
  { name: "Vivid", category: "Fotografia", image: "/images/landing-page-images/template_vivid.jpeg" },
  { name: "Sleek", category: "UI/UX Design", image: "/images/landing-page-images/template_sleek.png" },
  { name: "Classic", category: "Ilustração", image: "/images/landing-page-images/tempalte_classic.png" },
  { name: "Bold", category: "Moda", image: "/images/landing-page-images/template_bold.jpeg" },
];

export function TemplateGalleryB({ dark }: { dark?: boolean }) {
  return (
    <section id="templates" className="py-20 px-4 max-w-6xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${dark ? "text-white" : "text-slate-900"}`}>
          Templates para cada nicho.
        </h2>
        <p className={`text-lg mb-12 max-w-2xl mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>
          Não importa sua profissão. Temos o layout perfeito para destacar suas habilidades e atrair os melhores clientes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl cursor-pointer"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src={t.image}
                alt={t.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white">
              <span className="text-xs font-medium px-2 py-1 bg-white/20 backdrop-blur-md rounded-md mb-2 inline-block">
                {t.category}
              </span>
              <h3 className="text-xl font-bold">{t.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-full text-lg">
          Explorar Todos os Templates
        </Button>
      </div>
    </section>
  );
}
