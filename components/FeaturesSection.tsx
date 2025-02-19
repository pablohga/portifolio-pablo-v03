import { useFieldArray, Control, FieldValues } from "react-hook-form";
import { z } from "zod"; // Importing zod
<<<<<<< HEAD
import { zodHomeSchema } from "../models/home"; // Importing zodHomeSchema
=======
import { homeSchema } from "../models/home"; // Added import for homeSchema
import { featureSchema } from "../models/home"; // Importing featureSchema
>>>>>>> d8d51fa5b5ececd53280b784d5ec2ecaf7bfd4af

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";

interface FeaturesSectionProps<TFieldValues extends FieldValues> {
<<<<<<< HEAD
  control: Control<z.infer<typeof zodHomeSchema>>;
  fields: FieldValues[];
  append: (data: z.infer<typeof zodHomeSchema>['featuresSection']['features'][number]) => void; // Ensure the type matches the schema
=======
  control: Control<z.infer<typeof homeSchema>>;
  fields: FieldValues[];
  append: (data: z.infer<typeof featureSchema>) => void;
>>>>>>> d8d51fa5b5ececd53280b784d5ec2ecaf7bfd4af
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
<<<<<<< HEAD
              } as z.infer<typeof zodHomeSchema>['featuresSection']['features'][number]) // Ensure the type matches the schema
=======
              })
>>>>>>> d8d51fa5b5ececd53280b784d5ec2ecaf7bfd4af
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
              <FormField
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
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
