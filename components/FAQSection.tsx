import { useFieldArray, Control, FieldValues } from "react-hook-form";
import { homeSchema } from "../models/home"; // Added import for homeSchema


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";

interface FAQSectionProps {
  control: Control<FieldValues>;
  fields: FieldValues[];
  append: (data: FieldValues) => void;
  remove: (index: number) => void;
}


export function FAQSection({ control, fields, append, remove }: FAQSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">FAQs</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                question: "",
                answer: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
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
                name={`faqSection.faqs.${index}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`faqSection.faqs.${index}.answer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
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
