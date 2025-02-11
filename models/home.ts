import mongoose from 'mongoose';
import * as z from 'zod';

export const homeSchema = new mongoose.Schema({
  heroSection: {
    title: String,
    subtitle: String,
    description: String,
    buttonText: String,
    buttonLink: String,
  },
  featuresSection: {
    title: String,
    subtitle: String,
    features: [
      {
        icon: String,
        title: String,
        description: String,
      },
    ],
  },
  pricingSection: {
    title: String,
    subtitle: String,
    plans: [
      {
        name: String,
        price: String,
        description: String,
        features: [String],
        buttonText: String,
        popular: Boolean,
      },
    ],
  },
  testimonialsSection: {
    title: String,
    subtitle: String,
    testimonials: [
      {
        name: String,
        role: String,
        content: String,
        image: String,
      },
    ],
  },
  faqSection: {
    title: String,
    subtitle: String,
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  ctaSection: {
    title: String,
    subtitle: String,
    buttonText: String,
    features: [
      {
        icon: String,
        title: String,
        description: String,
      },
    ],
  },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Home = mongoose.models.Home || mongoose.model('Home', homeSchema);

// Definição do Zod Schema baseado no homeSchema do Mongoose
export const zodHomeSchema = z.object({
  heroSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    buttonText: z.string(),
    buttonLink: z.string(),
  }),
  featuresSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    features: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
  pricingSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    plans: z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        description: z.string(),
        features: z.array(z.string()), // Correção: array de strings
        buttonText: z.string(),
        popular: z.boolean(),
      })
    ),
  }),
  testimonialsSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        role: z.string(),
        content: z.string(),
        image: z.string().url(),
      })
    ),
  }),
  faqSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
  ctaSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    buttonText: z.string(),
    features: z.array( // Correção: features deve ser um array de objetos
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
  userId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type HomeSchema = z.infer<typeof zodHomeSchema>;
