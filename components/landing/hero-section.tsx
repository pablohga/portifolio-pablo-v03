"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection as HeroSectionType } from "@/types/home";

interface HeroSectionProps {
  data?: HeroSectionType;
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-left overflow-hidden sm:bg-contain md:bg-cover lg:bg-center bg-[url('https://mundonews.pt/portify/hero_img_clean-transformed_new1.png')] bg-cover h-64 w-full">
    {/* <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/50"> */}
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="flex flex-row justify-items-start container px-4 mx-auto max-w-[960px] relative z-10">
        <div className="text-primary max-w-[400px] text-left">
        {/* <div className="max-w-2xl mx-auto text-center"> */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-primary font-semibold">
                {data?.subtitle || ""}
                {/* {data?.subtitle || "Seu Portfólio, Sua Identidade"} */}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text to-primary/70">
            {/* <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"> */}
              {data?.title || "Create your professional portfolio without spending anything"}
            </h1>
            {/* FIX: REMOVIDO PQ ESTA VINDO EM HTML DO BANCO DE DADOS. RESOVER DEPOIS */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {data?.description || "Throw your amazing portfolio site totally free.No hidden rates, no credit card - only pure value for freelancers."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href={data?.buttonLink || "/auth/register"}>
                  {data?.buttonText || "Start Free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
{/*               <Button size="lg" variant="outline" className="text-lg px-8">
                Ver Demo
              </Button> */}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
            Throw your amazing portfolio site totally free.No hidden rates, no credit card - only pure value for freelancers.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}