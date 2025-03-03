"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: { password: string; confirmPassword: string }) {
    console.log("📩 Enviando requisição para redefinir senha...");
  
    if (!token) {
      console.error("❌ Erro: Token ausente na URL!");
      toast({ title: "Error", description: "Invalid or missing token.", variant: "destructive" });
      return;
    }
  
    console.log("🆔 Token sendo enviado:", token);
    console.log("🔐 Nova senha:", values.password);
  
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password, token }),
      });
  
      const data = await response.json();
      console.log("📨 Resposta da API:", data);
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }
  
      toast({ title: "Success", description: "Password has been reset successfully!", variant: "success" });
      router.push("/auth/signin");
    } catch (error: any) {
      console.error("🔥 Erro na requisição:", error.message);
      toast({ title: "Error", description: error.message || "Something went wrong", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl text-center">Reset Password</h2>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
