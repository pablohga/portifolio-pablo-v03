"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "./rich-text-editor";
import { Plus, Trash2 } from "lucide-react";

const featureSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

const planSchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  buttonText: z.string(),
  popular: z.boolean().optional(),
});

const testimonialSchema = z.object({
  name: z.string(),
  role: z.string(),
  content: z.string(),
  image: z.string().url(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const homeSchema = z.object({
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
    features: z.array(featureSchema),
  }),
  pricingSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    plans: z.array(planSchema),
  }),
  testimonialsSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    testimonials: z.array(testimonialSchema),
  }),
  faqSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    faqs: z.array(faqSchema),
  }),
  ctaSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    buttonText: z.string(),
    features: z.array(z.string()),
  }),
});

interface HomeEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function HomeEditorDialog({
  open,
  onOpenChange,
  onSubmit,
}: HomeEditorDialogProps) {
  const form = useForm<z.infer<typeof homeSchema>>({
    resolver: zodResolver(homeSchema),
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

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const response = await fetch("/api/home");
        const data = await response.json();
        if (data._id) {
          form.reset(data);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    }

    if (open) {
      fetchHomeData();
    }
  }, [open, form]);

  function handleSubmit(values: z.infer<typeof homeSchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Home Page</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="heroSection.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heroSection.subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heroSection.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heroSection.buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heroSection.buttonLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card>
              <CardHeader>
                <CardTitle>Features Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add fields for features section */}
              </CardContent>
            </Card>

            {/* Pricing Section */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add fields for pricing section */}
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle>Testimonials Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add fields for testimonials section */}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>FAQ Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add fields for FAQ section */}
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card>
              <CardHeader>
                <CardTitle>CTA Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add fields for CTA section */}
              </CardContent>
            </Card>

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}