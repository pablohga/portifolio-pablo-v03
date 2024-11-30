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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Hero } from "@/types/hero";
import { useHeroData } from "@/hooks/use-hero-data";

const heroSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  backgroundImage: z.string().url("Must be a valid URL"),
});

interface HeroDialogProps {
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Hero>) => void;
}

export function HeroDialog({
  userId,
  open,
  onOpenChange,
  onSubmit,
}: HeroDialogProps) {
  const { hero, isLoading } = useHeroData(userId);
  
  const form = useForm<z.infer<typeof heroSchema>>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      backgroundImage: "",
    },
  });

  useEffect(() => {
    if (hero) {
      form.reset({
        title: hero.title || "",
        subtitle: hero.subtitle || "",
        backgroundImage: hero.backgroundImage,
      });
    }
  }, [hero, form]);

  function handleSubmit(values: z.infer<typeof heroSchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Hero Section</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Pablo Azevedo" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave empty to hide the title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full-stack Developer & Creative Problem Solver"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty to hide the subtitle
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backgroundImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://images.unsplash.com/photo-1579547621869-0ddb5f237392"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use a high-resolution image (recommended: 1920x1080 or larger)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}