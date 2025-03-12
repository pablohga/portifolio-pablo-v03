import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const expenseSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

interface ExpenseDialogProps {
  setShowExpenseDialog: (show: boolean) => void;
  open: boolean;
}

export function ExpenseDialog({ setShowExpenseDialog, open }: ExpenseDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: "",
      date: "",
      category: "",
      description: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof expenseSchema>) {
    try {
      console.log("Expense submitted:", values);
      toast({
        title: "Success",
        description: "Expense submitted successfully",
        variant: "success",
      });
      setShowExpenseDialog(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit expense",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setShowExpenseDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
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

            <Button type="submit" className="w-full">Submit</Button>
            <Button type="button" className="w-full" onClick={() => setShowExpenseDialog(false)}>Cancel</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
