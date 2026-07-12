"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const FeatureItem = ({ title, description, image, reverse, dark }: any) => {
  return (
    <section className={`py-20 px-4 ${reverse ? "flex-row-reverse" : "flex-row"} flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto`}>
      <motion.div
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex-1 space-y-6"
      >
        <h2 className={`text-3xl md:text-5xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>
          {title}
        </h2>
        <p className={`text-lg ${dark ? "text-slate-400" : "text-slate-600"}`}>
          {description}
        </p>
        <div className="flex gap-4">
          <div className={`h-1 w-20 rounded-full ${dark ? "bg-blue-500" : "bg-blue-600"}`} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex-1 relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </motion.div>
    </section>
  );
};

export function FeaturesB({ dark }: { dark?: boolean }) {
  const features = [
    {
      title: "Design que Impressiona",
      description: "Não se preocupe com pixels. Nossos templates são curados por designers profissionais para garantir que seu trabalho seja o protagonista.",
      image: "/images/feature1.png",
      reverse: false
    },
    {
      title: "Simplicidade Absoluta",
      description: "Arraste, solte e publique. O editor mais intuitivo do mercado permite que você mude tudo sem tocar em uma única linha de código.",
      image: "/images/feature2.png",
      reverse: true
    },
    {
      title: "Visibilidade Global",
      description: "Otimizado para SEO e redes sociais. Seu portfólio não será apenas bonito, ele será encontrado por quem realmente importa.",
      image: "/images/feature3.png",
      reverse: false
    }
  ];

  return (
    <div className="py-20 space-y-0">
      {features.map((f, i) => (
        <FeatureItem key={i} {...f} dark={dark} />
      ))}
    </div>
  );
}
