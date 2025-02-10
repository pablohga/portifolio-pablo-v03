import { useForm, FormProvider, Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { RichTextEditor } from "./rich-text-editor";
import * as z from "zod"; // Importing zod
import { homeSchema } from "@/models/home"; // Corrected import path

interface HeroSectionProps {
  control: Control<z.infer<typeof homeSchema>>;
}

export function HeroSection({ control }: HeroSectionProps) {
  return (
    <div>
      <h2>Hero Section</h2>
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </div>
  );
}
