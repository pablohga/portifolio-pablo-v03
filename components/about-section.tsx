"use client";

import { motion } from "framer-motion";
import { Code2, Palette, Rocket } from "lucide-react";

const features = [
  {
    icon: <Code2 className="h-10 w-10" />,
    title: "Full-Stack Development",
    description: "Experienced in building complete web applications from front to back.",
  },
  {
    icon: <Palette className="h-10 w-10" />,
    title: "UI/UX Design",
    description: "Creating beautiful and intuitive user interfaces.",
  },
  {
    icon: <Rocket className="h-10 w-10" />,
    title: "Performance Optimization",
    description: "Ensuring applications run smoothly and efficiently.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background/50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I'm a passionate full-stack developer with a keen eye for design and a
            commitment to creating exceptional web experiences. My approach combines
            technical expertise with creative problem-solving.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg bg-card hover:shadow-lg hover:shadow-[#5221e6]/10 transition-shadow duration-300"
            >
              <div className="mb-4 inline-block p-4 rounded-full bg-[#5221e6]/10 text-[#5221e6]">
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