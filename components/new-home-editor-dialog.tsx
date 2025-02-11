"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Form } from './ui/form';
import { HeroSection } from './HeroSection';
import { CTASection } from './CTASection';
import { FAQSection } from './FAQSection';
import { FeaturesSection } from './FeaturesSection';
import { PricingSection } from './PricingSection';
import { zodHomeSchema } from "../models/home"; 

export type HomeSchema = z.infer<typeof zodHomeSchema>;

export function NewHomeEditorDialog({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (data: HomeSchema) => void; }) {

  const form = useForm<HomeSchema>({
    resolver: zodResolver(zodHomeSchema),
    defaultValues: {
      heroSection: {
        title: "",
        subtitle: "",
        description: "",
        buttonText: "",
        buttonLink: "",
      },
      featuresSection: {
        title: "",
        subtitle: "",
        features: [],
      },
      pricingSection: {
        title: "",
        subtitle: "",
        plans: [],
      },
      testimonialsSection: {
        title: "",
        subtitle: "",
        testimonials: [],
      },
      faqSection: {
        title: "",
        subtitle: "",
        faqs: [],
      },
      ctaSection: {
        title: "",
        subtitle: "",
        buttonText: "",
        features: [],
      },
    },
  });

  const { fields: featureFields, append: featureAppend, remove: featureRemove } = useFieldArray({
    control: form.control,
    name: "featuresSection.features",
  });

  const { fields: planFields, append: planAppend, remove: planRemove } = useFieldArray({
    control: form.control,
    name: "pricingSection.plans",
  });

  const { fields: faqFields, append: faqAppend, remove: faqRemove } = useFieldArray({
    control: form.control,
    name: "faqSection.faqs",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Home Page</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <HeroSection control={form.control} />
            <CTASection control={form.control} fields={form.getValues("ctaSection.features")} append={featureAppend} remove={featureRemove} />
            <FAQSection control={form.control} fields={faqFields} append={faqAppend} remove={faqRemove} />
            <FeaturesSection control={form.control} fields={featureFields} append={featureAppend} remove={featureRemove} />
            <PricingSection control={form.control} fields={planFields} append={planAppend} remove={planRemove} />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
