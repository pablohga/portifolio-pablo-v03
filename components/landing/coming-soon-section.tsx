"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, DollarSign, Users, FileText, PieChart, Calendar } from "lucide-react";

const features = [
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Income Tracking",
    description: "Track your earnings, expenses, and profit margins in real-time.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Client Management",
    description: "Manage client information, projects, and communication in one place.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Invoice Generation",
    description: "Create and send professional invoices with automated reminders.",
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "Financial Reports",
    description: "Get insights into your business with detailed financial analytics.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Project Planning",
    description: "Schedule projects, set milestones, and track deadlines efficiently.",
  },
];

export function ComingSoonSection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Bell className="h-4 w-4" />
            Coming Soon
          </span>
          <h2 className="text-4xl font-bold mb-4">
            Supercharge Your Freelance Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get early access to our upcoming premium features designed to help you manage your freelance business like a pro.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4 p-6 rounded-lg bg-card"
            >
              <div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            Get Notified When We Launch
            <Bell className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}