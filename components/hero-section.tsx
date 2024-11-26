"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Hero } from "@/types/hero";

export function HeroSection() {
  const [hero, setHero] = useState<Hero | null>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await fetch("/api/hero");
        const data = await response.json();
        if (data._id) {
          setHero(data);
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      }
    }

    fetchHero();
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/50 z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container relative z-20 text-center"
      >
        {hero?.title && (
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5221e6] to-[#5221e6]/70">
              {hero.title}
            </span>
          </h1>
        )}
        {hero?.subtitle && (
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {hero.subtitle}
          </p>
        )}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="w-8 h-8 text-[#5221e6]" />
        </motion.div>
      </motion.div>
    </section>
  );
}