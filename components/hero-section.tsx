"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Hero } from "@/types/hero";

interface HeroSectionProps {
  userId?: string;
  data?: object;
}

export default function HeroSection({ userId }: HeroSectionProps) {
  const [hero, setHero] = useState<Hero | null>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const url = userId ? `/api/hero?userId=${userId}` : "/api/hero";
        const response = await fetch(url);
        const data = await response.json();
        if (data._id) {
          setHero(data);
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      }
    }

    fetchHero();
  }, [userId]);

  if (!hero) return null;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      {hero?.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${hero.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100vh'
          }}
        />
      )}

      {/* Premium Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/60 via-background/20 to-background" />
      <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container relative z-20 text-center px-4"
      >
        {hero?.title && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tighter leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5221e6] via-[#7c3aed] to-[#5221e6] bg-[length:200%_auto] animate-gradient-x">
              {hero.title}
            </span>
          </motion.h1>
        )}

        {hero?.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            {hero.subtitle}
          </motion.p>
        )}

        <motion.div
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="p-2 rounded-full bg-background/30 backdrop-blur-md border border-border/50">
            <ArrowDown className="w-6 h-6 text-[#5221e6] animate-bounce-slow" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
