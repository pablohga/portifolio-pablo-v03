"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "9",
    description: "Perfect for freelancers just starting out",
    features: [
      "1 Portfolio Website",
      "Basic Analytics",
      "Custom Domain",
      "SEO Tools",
      "24/7 Support",
    ],
  },
  {
    name: "Professional",
    price: "19",
    description: "For established freelancers who need more",
    features: [
      "Everything in Starter",
      "Multiple Portfolios",
      "Advanced Analytics",
      "Priority Support",
      "Client Management",
      "Custom Branding",
    ],
    popular: true,
  },
  {
    name: "Agency",
    price: "49",
    description: "For agencies and teams",
    features: [
      "Everything in Professional",
      "Team Collaboration",
      "White Label Solution",
      "API Access",
      "Custom Integration",
      "Dedicated Account Manager",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-lg bg-card border ${
                plan.popular ? "border-primary" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Start Free Trial
                </Button>
              </div>
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}