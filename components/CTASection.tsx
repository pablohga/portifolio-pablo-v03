import { Control } from "react-hook-form";
import { HomeSchema } from "../models/home"; // Importa a tipagem correta

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";

interface CTASectionProps {
  control: Control<HomeSchema>; 
  fields: HomeSchema["ctaSection"]["features"];
  append: (data: HomeSchema["ctaSection"]["features"][number]) => void;
  remove: (index: number) => void;
}

export function CTASection({ control, fields, append, remove }: CTASectionProps) {
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
              append({ // ✅ Correção aqui: Agora está usando os campos corretos do esquema
                icon: "",
                title: "",
                description: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add CTA
          </Button>
        </div>
        {fields.map((field, index) => (
          <Card key={field.icon + index}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <FormField
                control={control}
                name={`ctaSection.features.${index}.icon`}
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
                name={`ctaSection.features.${index}.title`}
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
                name={`ctaSection.features.${index}.description`}
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
