import { useFieldArray, Control, FieldValues } from "react-hook-form";
import { homeSchema } from "../models/home"; // Added import for homeSchema


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";

interface TestimonialsSectionProps {
  control: Control<FieldValues>;
  fields: FieldValues[];
  append: (data: FieldValues) => void;
  remove: (index: number) => void;
}


export function TestimonialsSection({ control, fields, append, remove }: TestimonialsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonials Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Testimonials</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name: "",
                role: "",
                content: "",
                image: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
        {fields.map((field: FieldValues, index: number) => (

          <Card key={field.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <FormField
                control={control}
                name={`testimonialsSection.testimonials.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`testimonialsSection.testimonials.${index}.role`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`testimonialsSection.testimonials.${index}.content`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`testimonialsSection.testimonials.${index}.image`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
