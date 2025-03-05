import { useFieldArray, Control, FieldValues } from "react-hook-form";
import { homeSchema, zodHomeSchema } from "../models/home"; // Added import for homeSchema


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";
import * as z from "zod"; // Importing zod

interface PricingSectionProps {
  control: Control<z.infer<typeof zodHomeSchema>>;
  /* control: Control<FieldValues>; */
  fields: FieldValues[];
  append: (data: z.infer<typeof zodHomeSchema>['pricingSection']['plans'][number]) => void;
  /* append: (data: FieldValues) => void; */
  remove: (index: number) => void;
}


export function PricingSection({ control, fields, append, remove }: PricingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Plans</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name: "",
                price: "",
                description: "",
                features: [],
                buttonText: "Start Now",
                popular: false,
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
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
                name={`pricingSection.plans.${index}.name`}
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
                name={`pricingSection.plans.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`pricingSection.plans.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`pricingSection.plans.${index}.buttonText`}
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
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
