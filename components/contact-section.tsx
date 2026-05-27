"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact-form";
import Image from "next/image";

interface ContactSectionProps {
  userId?: string;
}

interface ContactImage {
  imageUrl: string;
}

export function ContactSection({ userId }: ContactSectionProps) {
  const [contactImage, setContactImage] = useState<ContactImage | null>(null);

  useEffect(() => {
    async function fetchContactImage() {
      try {
        const url = userId ? `/api/contact/image?userId=${userId}` : "/api/contact/image";
        const response = await fetch(url);
        const data = await response.json();
        if (data._id) {
          setContactImage(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact image:", error);
      }
    }

    fetchContactImage();
  }, [userId]);

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5221e6]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5221e6]/5 rounded-full blur-3xl -z-10" />

      <div className="container px-4 mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Entre em contato</h2>
          <p className="text-muted-foreground text-lg">Vamos transformar sua ideia em realidade</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#5221e6]/20 to-transparent rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
              <Image
                src={contactImage?.imageUrl || "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                alt="Contact"
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                width={500}
                height={500}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-3xl bg-card border border-border/50 shadow-xl backdrop-blur-sm"
          >
            <ContactForm userId={userId} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
