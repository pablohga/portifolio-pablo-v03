"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, Layout, Sparkles, Smartphone, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  { name: "Default", image: "/images/templates-thumbs/default.png" },
  { name: "Template 1", image: "/images/templates-thumbs/Template 1.png" },
  { name: "Template 2", image: "/images/templates-thumbs/Template 2.png" },
  { name: "Template 3", image: "/images/templates-thumbs/Template 3.png" },
  { name: "Template 4", image: "/images/templates-thumbs/Template 4.png" },
  { name: "Template 5", image: "/images/templates-thumbs/Template 5.png" },
  { name: "Template 6", image: "/images/templates-thumbs/Template 6.png" },
  { name: "Template 7", image: "/images/templates-thumbs/Template 7.png" },
  { name: "Template 8", image: "/images/templates-thumbs/Template 8.png" },
  { name: "Template 9", image: "/images/templates-thumbs/Template 9.png" },
  { name: "Template 10", image: "/images/templates-thumbs/Template 10.png" },
];

const FEATURES = [
  {
    icon: Smartphone,
    title: "100% Responsivo",
    description: "Seu portfólio perfeito em qualquer dispositivo, do mobile ao desktop.",
  },
  {
    icon: Search,
    title: "Otimizado para SEO",
    description: "Apareça no topo das buscas do Google e atraia mais clientes organicamente.",
  },
  {
    icon: Sparkles,
    title: "Fácil Personalização",
    description: "Altere cores, fontes e conteúdos em segundos sem tocar em uma linha de código.",
  },
  {
    icon: Layout,
    title: "Visual Profissional",
    description: "Templates desenhados por especialistas para transmitir confiança e autoridade.",
  },
];

export function TemplatesSection({ dark }: { dark: boolean }) {
  return (
    <section className={cn(
      "py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300",
      dark ? "bg-[#1E1F25] text-white" : "bg-white text-slate-900"
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
            <Sparkles className="w-3 h-3" />
            <span>Coleções Exclusivas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-poppins">
            Escolha o seu <span className="text-primary">Estilo Ideal</span>
          </h2>
          <p className="text-lg text-muted-foreground opacity-80">
            Não perca tempo criando do zero. Nossos templates são assets de alta conversão,
            projetados para destacar seu trabalho e converter visitantes em clientes.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Templates Grid */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500">
              <Image
                src="/images/image_templates.jpeg"
                alt="Templates Showcase"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TEMPLATES.map((template, index) => (
                <div
                  key={template.name}
                  className={cn(
                    "group relative rounded-xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                    dark ? "border-white/10 bg-white/5 hover:border-primary/50" : "border-black/5 bg-slate-50 hover:border-primary/50"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={template.image}
                      alt={template.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-sm font-medium">{template.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advantages List */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid gap-6">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.title}
                  className={cn(
                    "p-5 rounded-2xl border transition-all duration-300 group",
                    dark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-slate-50 border-black/5 hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={cn(
              "p-8 rounded-3xl border-2 border-dashed transition-all duration-300",
              dark ? "border-primary/30 bg-primary/5" : "border-primary/20 bg-primary/5"
            )}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl">Tudo Pronto Para Você</h4>
                  <p className="text-sm text-muted-foreground">Escolha, personalize e publique.</p>
                </div>
              </div>
              <Button className="w-full py-6 text-lg font-semibold rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Começar a construir agora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
