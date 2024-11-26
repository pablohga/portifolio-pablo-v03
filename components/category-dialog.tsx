"use client";

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
import { Category } from "@/types/category";
import { RichTextEditor } from "./rich-text-editor";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

interface CategoryDialogProps {
  category?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Category>) => void;
}

export function CategoryDialog({
  category,
  open,
  onOpenChange,
  onSubmit,
}: CategoryDialogProps) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  function handleSubmit(values: z.infer<typeof categorySchema>) {
    onSubmit(values);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Applications" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Add a description for this category..."
                    />
                  </FormControl>
                  <FormDescription>
                    This text will appear above the projects in this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Category</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}