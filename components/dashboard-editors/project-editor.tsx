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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  year: z.string().min(1, "Year is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Must be a valid URL"),
  tech: z.string(),
  category: z.string().min(1, "Please select a category"),
  isFeatured: z.boolean().default(false),
});

interface ProjectEditorProps {
  project?: Project;
  onSubmit: (data: Project) => void;
  categories: Category[];
}

export function ProjectEditor({
  project,
  onSubmit,
  categories,
}: ProjectEditorProps) {
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      year: project?.year || "",
      description: project?.description || "",
      image: project?.image || "",
      tech: project?.tech.join(", ") || "",
      category: project?.category || "",
      isFeatured: project?.isFeatured || false,
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        year: project.year,
        description: project.description,
        image: project.image,
        tech: project.tech.join(", "),
        category: project.category,
        isFeatured: project.isFeatured,
      });
    }
  }, [project, form]);

  function handleSubmit(values: z.infer<typeof projectSchema>) {
    onSubmit({
      ...project,
      ...values,
      tech: values.tech.split(",").map((t) => t.trim()),
    } as Project);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">{project ? "Edit Project" : "Create Project"}</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Awesome Project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your project..."
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
                <FormLabel>Upload Image</FormLabel>
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
                        const timestamp = currentDate
                          .toISOString()
                          .replace(/[-:.TZ]/g, "");
                        const fileNameWithoutExt = file.name
                          .split(".")
                          .slice(0, -1)
                          .join(".");
                        const sanitizedFileName = fileNameWithoutExt
                          .replace(/\s+/g, "-")
                          .replace(/[^a-zA-Z0-9-_]/g, "");
                        const extension = file.type.split("/")[1] || file.name.split(".").pop();
                        const newFileName = `${userId}-${sanitizedFileName}-${timestamp}.${extension}`;
                        const renamedFile = new File([file], newFileName, {
                          type: file.type,
                        });

                        const formData = new FormData();
                        formData.append("file", renamedFile);
                        formData.append("upload_preset", "user-projects-imgs");
                        formData.append("folder", `user_uploads/user-projects/${userId}`);

                        try {
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });

                          const data = await res.json();
                          if (data.secure_url) {
                            field.onChange(data.secure_url);
                            toast({
                              title: "Success",
                              description: "Image uploaded successfully!",
                              variant: "success",
                            });
                          } else {
                            toast({
                              title: "Error",
                              description: "Failed to upload image.",
                              variant: "destructive",
                            });
                          }
                        } catch (error) {
                          console.error("Upload error:", error);
                          toast({
                            title: "Error",
                            description: "An error occurred while uploading the image.",
                            variant: "destructive",
                          });
                        }
                      }}
                    />
                    {field.value && (
                      <Image
                        src={field.value}
                        alt="Uploaded Preview"
                        className="w-full max-h-48 object-cover rounded-md"
                        height={120}
                        width={80}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tech"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="React, TypeScript, Tailwind" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marcar como Destaque</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit">Save Project</Button>
        </form>
      </Form>
    </div>
  );
}
