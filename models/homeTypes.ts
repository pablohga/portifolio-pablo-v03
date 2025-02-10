export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface HomeSchema {
  heroSection: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  featuresSection: {
    title: string;
    subtitle: string;
    features: Feature[];
  };
  pricingSection: {
    title: string;
    subtitle: string;
    plans: Plan[];
  };
  testimonialsSection: {
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
  };
  faqSection: {
    title: string;
    subtitle: string;
    faqs: FAQ[];
  };
  ctaSection: {
    title: string;
    subtitle: string;
    buttonText: string;
    features: string[];
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
