"use client";

import { useState } from "react";
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
import { Star } from "lucide-react";
import { Testimonial } from "@/types/testimonial";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  image: z.string().url("Must be a valid URL"),
  stars: z.number().min(1).max(5),
  text: z.string().min(10, "Testimonial must be at least 10 characters"),
});

interface TestimonialDialogProps {
  testimonial?: Testimonial;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Testimonial) => void;
}

export function TestimonialDialog({
  testimonial,
  open,
  onOpenChange,
  onSubmit,
}: TestimonialDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: testimonial?.name || "",
      role: testimonial?.role || "",
      image: testimonial?.image || "",
      stars: testimonial?.stars || 5,
      text: testimonial?.text || "",
    },
  });

  function handleSubmit(values: z.infer<typeof testimonialSchema>) {
    onSubmit({
      ...testimonial,
      ...values,
    } as Testimonial);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "Edit Testimonial" : "Create Testimonial"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / Company</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO at Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1" style={{ cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 transition-colors ${
                            star <= field.value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testimonial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const userId = session?.user?.id;
                          const currentDate = new Date();
                          const timestamp = currentDate.toISOString().replace(/[-:.TZ]/g, "");
                          const newFileName = `${userId}-testimonial-${timestamp}.${file.type.split("/")[1]}`;
                          const renamedFile = new File([file], newFileName, { type: file.type });

                          const formData = new FormData();
                          formData.append("file", renamedFile);
                          formData.append("upload_preset", "user-projects-imgs");
                          formData.append("folder", `user_uploads/testimonials/${userId}`);

                          try {
                            const res = await fetch("/api/upload", { method: "POST", body: formData });
                            const data = await res.json();
                            if (data.secure_url) {
                              field.onChange(data.secure_url);
                              toast({ title: "Success", description: "Image uploaded successfully!", variant: "success" });
                            } else {
                              toast({ title: "Error", description: "Failed to upload image.", variant: "destructive" });
                            }
                          } catch (error) {
                            console.error("Upload error:", error);
                            toast({ title: "Error", description: "An error occurred while uploading the image.", variant: "destructive" });
                          }
                        }}
                      />
                      {field.value && (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                           <Image src={field.value} alt="Preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Testimonial</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
