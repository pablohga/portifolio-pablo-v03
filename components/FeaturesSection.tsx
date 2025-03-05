import { useFieldArray, Control, FieldValues } from "react-hook-form";
import { z } from "zod"; // Importing zod
import { homeSchema, zodHomeSchema } from "../models/home"; // Importing zodHomeSchema

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";

const featureSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
interface FeaturesSectionProps<TFieldValues extends FieldValues> {
  control: Control<z.infer<typeof featureSchema>>;
  fields: FieldValues[];
  append: (data: z.infer<typeof featureSchema>) => void;
  remove: (index: number) => void;
}

export function FeaturesSection({ control, fields, append, remove }: FeaturesSectionProps<FieldValues>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Features Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Features</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                icon: "Star",
                title: "",
                description: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
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
              {/* <FormField
                control={control}
                name={`featuresSection.features.${index}.icon`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`featuresSection.features.${index}.title`}
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
                name={`featuresSection.features.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
