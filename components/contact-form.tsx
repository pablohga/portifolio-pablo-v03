"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
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
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Send } from "lucide-react";



interface ContactFormProps {
  userId?: string;
}


export function ContactForm({ userId }: ContactFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactFormSchema = z.object({
    name: z.string().min(2, t("ContactForm.validation.name")),
    email: z.string().email(t("ContactForm.validation.email")),
    message: z.string().min(10, t("ContactForm.validation.message")),
  });

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });


  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    try {
      setIsSubmitting(true);
      const url = userId ? `/api/contact?userId=${userId}` : "/api/contact";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      toast({
        title: t("ContactForm.successTitle"),
        description: t("ContactForm.successDesc"),
        variant: "success",
      });

      form.reset();
    } catch (error) {
      toast({
        title: t("ContactForm.errorTitle"),
        description: t("ContactForm.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div id="contact-form">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ContactForm.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ContactForm.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ContactForm.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ContactForm.emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ContactForm.message")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("ContactForm.messagePlaceholder")}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                t("ContactForm.sending")
              ) : (
                <>
                  {t("ContactForm.submit")}
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
      
    </motion.div>
  );
}