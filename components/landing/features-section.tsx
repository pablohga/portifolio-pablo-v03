"use client";

import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Search, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: <Code2 className="h-8 w-8" />,
    title: "100% Free Forever",
    description: "Create and maintain your professional portfolio completely free. No hidden costs or premium features.",
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "SEO Optimized",
    description: "Get discovered by clients with our built-in SEO tools. Rank higher in search results naturally.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Built with Next.js for blazing-fast performance that impresses visitors and search engines alike.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure & Reliable",
    description: "Your portfolio is protected with enterprise-grade security and hosted on reliable infrastructure.",
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Beautiful Templates",
    description: "Choose from our collection of professionally designed templates that make your work shine.",
  },
  {
    icon: <Rocket className="h-8 w-8" />,
    title: "Quick Setup",
    description: "Get your portfolio online in minutes with our intuitive setup process. No technical skills needed.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background/50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Everything You Need, For Free</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We believe every freelancer deserves a professional online presence. That's why we made our portfolio builder completely free.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-card hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300"
            >
              <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}