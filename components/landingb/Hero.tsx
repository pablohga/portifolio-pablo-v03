"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HERO_DARK, HERO_FOOTER_DARK, HERO_FOOTER_LIGHT, HERO_LIGHT } from "@/constants/assets";

const PortfolioGrid = () => {
  const bigImage = "/images/templates-thumbs/Template 1.png";

  const smallImages = [
    "/images/templates-thumbs/Template 1.png",
    "/images/templates-thumbs/Template 2.png",
    "/images/templates-thumbs/Template 3.png",
    "/images/templates-thumbs/Template 4.png",
    "/images/templates-thumbs/Template 5.png",
    "/images/templates-thumbs/Template 6.png",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] overflow-hidden rounded-2xl p-4">
      {/* Imagem grande à esquerda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl group cursor-pointer h-full"
      >
        <Image
          src={bigImage}
          alt="Portfolio Example"
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
      </motion.div>

      {/* Grid 2x3 de imagens menores à direita */}
      <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full">
        {smallImages.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative overflow-hidden rounded-xl group cursor-pointer"
          >
            <Image
              src={src}
              alt="Portfolio Example"
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export function HeroB({ dark }: { dark?: boolean }) {
  return (
    <>
      <section className={`relative pt-20 pb-16 px-4 overflow-hidden w-full max-w-full ${dark ? "bg-[#1E1F25]" : "bg-[#F5F5F5]"}`}>
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src={dark ? HERO_DARK : HERO_LIGHT}
            alt="Background"
            fill
            priority
            className="object-cover object-top"
          />
        </div>

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 z-10 ${
          dark
            ? "bg-gradient-to-r from-[#071B3B] via-[#071B3B]/80 to-transparent"
            : "bg-gradient-to-r from-[#F8F7F5] via-[#F8F7F5]/90 to-transparent"
        }`} />

        <div className="relative z-20 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight mb-6 ${dark ? "text-white" : "text-slate-900"}`}>
              Seu trabalho merece <br />
              <span className="text-blue-600">o palco perfeito.</span>
            </h1>
            <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>
              Crie um portfólio profissional em minutos. Sem código, sem complicações.
              Apenas você e sua arte, apresentados da maneira que o mundo deve ver.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
                <Link href="/auth/register">Começar Gratuitamente</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className={`px-8 py-6 text-lg rounded-full ${dark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-300 text-slate-900 hover:bg-slate-100"}`}>
                <Link href="#templates">Ver Exemplos</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative z-30 w-full max-w-5xl mx-auto"
          >
            
          </motion.div>
        </div>
      </section>
      <div 
      id="grid-hero-footer"
      className="w-full h-600 bg-cover bg-center"
      style={{
        backgroundImage: `url(${dark ? HERO_FOOTER_DARK : ""})`,
      }}>
        <PortfolioGrid />
      </div>
    </>
  );
}