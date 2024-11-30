"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4 text-primary-foreground">
            Start Building Your Free Portfolio Today
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Join thousands of freelancers who are showcasing their work and attracting better clients with our platform.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            Create Your Portfolio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-primary-foreground/80">
            100% Free • No Credit Card Required • Setup in Minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}