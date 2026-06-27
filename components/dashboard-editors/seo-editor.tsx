"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/types/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEOData } from "@/hooks/use-seo-data";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

const seoSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters").max(160, "Description must not exceed 160 characters"),
  keywords: z.string().min(3, "Add at least one keyword"),
  ogImage: z.string().optional(),
});

interface SEOEditorProps {
  userId?: string;
  onSubmit: (data: Partial<SEO>) => void;
}

export function SEOEditor({
  userId = "",
  onSubmit,
}: SEOEditorProps) {
  const { seo, isLoading } = useSEOData(userId);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
    },
  });

  useEffect(() => {
    if (seo) {
      form.reset({
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords.join(", "),
        ogImage: seo.ogImage,
      });
    }
  }, [seo, form]);

  async function handleImageUpload(file: File) {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const baseName = file.name.split(".")[0].replace(/\s+/g, "");
    const ext = (file.type.split("/")[1] || "png").replace(/[^a-z0-9]/gi, "");
    const newFileName =
      userId + "-" + (baseName[0] || "img") + "-" + timestamp + "." + ext;
    const renamedFile = new File([file], newFileName, { type: file.type });

    const formData = new FormData();
    formData.append("file", renamedFile);
    formData.append("upload_preset", "user-projects-imgs");
    formData.append("folder", "/" + userId);

    try {
      setIsUploading(true);
      const res = await fetch("https://api.cloudinary.com/v1_1/dxqsqcw5p/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        form.setValue("ogImage", data.secure_url);

        toast({
          title: "Success",
          description: "Image uploaded successfully!",
          variant: "success",
        });
      } else {
        throw new Error("Error uploading the image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "An error occurred while uploading the image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleSubmit(values: z.infer<typeof seoSchema>) {
    onSubmit({
      ...values,
      keywords: values.keywords.split(",").map((k) => k.trim()),
    });
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Edit SEO Settings</h2>
      </div>

      {seo && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Current SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Title</h4>
              <p className="text-sm">{seo.title}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
              <p className="text-sm">{seo.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {seo.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Open Graph Image</h4>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={seo.ogImage}
                  alt="Open Graph preview"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome/Your name - Frontend Developer" {...field} />
                </FormControl>
                <FormDescription>
                  Optimal length: 50-60 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Expert Frontend Developer specializing in React.js and Vue.js, creating modern and efficient web applications."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optimal length: 150-160 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe, Frontend Reactjs, Frontend VueJS"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Add relevant keywords separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open Graph Image</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      disabled={isUploading}
                    />
                    {field.value && (
                      <Image
                        src={field.value}
                        alt="Open Graph preview"
                        className="w-full max-h-48 object-cover rounded-md"
                        height={120}
                        width={80}
                      />
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Recommended size: 1200x630 pixels
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isUploading}>Save SEO Settings</Button>
        </form>
      </Form>
    </div>
  );
}
