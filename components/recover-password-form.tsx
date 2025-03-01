"use client";

import { useState } from "react";
import { useFormContext, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function RecoverPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { control, getValues } = useFormContext();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = getValues(); // Extract values from the form context

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/recover-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send recovery email");
      }

      toast({
        title: "Success",
        description: "Recovery email sent successfully!",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-2xl text-center">Recover Password</h2>
        <FormField
          control={control}
          name="email"
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Recovery Email"}
        </Button>
      </form>
    </div>
  );
}
