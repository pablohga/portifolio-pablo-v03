"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { About } from "@/types/about";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { RichTextEditor } from "../rich-text-editor";
import { useAboutData } from "@/hooks/use-about-data";

const featureSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  projectsDelivered: z.string().optional(),
  satisfiedClients: z.string().optional(),
  experienceTime: z.string().optional(),
  features: z.array(featureSchema).min(1, "At least one feature is required"),
});

interface AboutEditorProps {
  userId?: string;
  onSubmit: (data: Partial<About>) => void;
}

const defaultFeatures = [
  { icon: "Code2", title: "", description: "" },
  { icon: "Palette", title: "", description: "" },
  { icon: "Rocket", title: "", description: "" },
];

export function AboutEditor({
  userId,
  onSubmit,
}: AboutEditorProps) {
  const { about, isLoading } = useAboutData(userId);

  const form = useForm<z.infer<typeof aboutSchema>>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: "",
      description: "",
      projectsDelivered: "",
      satisfiedClients: "",
      experienceTime: "",
      features: defaultFeatures,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  useEffect(() => {
    if (about) {
      form.reset({
        title: about.title,
        description: about.description,
        projectsDelivered: about.projectsDelivered || "",
        satisfiedClients: about.satisfiedClients || "",
        experienceTime: about.experienceTime || "",
        features: about.features,
      });
    }
  }, [about, form]);

  function handleSubmit(values: z.infer<typeof aboutSchema>) {
    onSubmit(values);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Edit section About You</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section title</FormLabel>
                <FormControl>
                  <Input placeholder="About Me" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Write about yourself..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="projectsDelivered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projects Delivered</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 100+" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="satisfiedClients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satisfied Clients</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 50+" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experienceTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Time</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 5 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Features</h3>
              {fields.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({ icon: "Star", title: "", description: "" })
                  }
                >
                  Add Features
                </Button>
              )}
            </div>

            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h4 className="text-sm font-medium">Feature {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`features.${index}.icon`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon name</FormLabel>
                        <FormControl>
                          <Input placeholder="Code2, Palette, Rocket, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`features.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Feature title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`features.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Feature description..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <Button type="submit">Save changes</Button>
        </form>
      </Form>
    </div>
  );
}
