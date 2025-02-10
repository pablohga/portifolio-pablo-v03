import { useFieldArray, Control, FieldValues } from "react-hook-form";
import { homeSchema } from "../models/home"; // Added import for homeSchema

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";

interface CTASectionProps {
  control: Control<FieldValues>;
  fields: FieldValues[];
  append: (data: FieldValues) => void;
  remove: (index: number) => void;
}


export function CTASection({ control, fields, append, remove }: CTASectionProps) {
  // Additional logic can be added here if needed
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call to Action Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Call to Action</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                text: "",
                link: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add CTA
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
                name={`ctaSection.ctas.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`ctaSection.ctas.${index}.link`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
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
