"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const expenseSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  value: z.string().min(1, "Value is required"),
  status: z.string().min(1, "Status is required"),
  paymentStatus: z.string().min(1, "Payment status is required"),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
});

interface ExpenseDialogProps {
  clients: any[];
  expense?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ExpenseDialog({
  clients,
  expense,
  open,
  onOpenChange,
  onSubmit,
}: ExpenseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      clientId: "",
      title: "",
      description: "",
      value: "",
      status: "pending",
      paymentStatus: "pending",
      startDate: undefined,
      dueDate: undefined,
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        clientId: expense.clientId,
        title: expense.title,
        description: expense.description,
        value: expense.value.toString(),
        status: expense.status,
        paymentStatus: expense.paymentStatus,
        startDate: expense.startDate ? new Date(expense.startDate) : undefined,
        dueDate: expense.dueDate ? new Date(expense.dueDate) : undefined,
      });
    } else {
      form.reset({
        clientId: "",
        title: "",
        description: "",
        value: "",
        status: "pending",
        paymentStatus: "pending",
        startDate: undefined,
        dueDate: undefined,
      });
    }
  }, [expense, form]);

  async function handleSubmit(values: z.infer<typeof expenseSchema>) {
    try {
      setIsLoading(true);
      const url = expense?._id ? `/api/expenses/${expense._id}` : "/api/expenses";
      const method = expense?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          value: parseFloat(values.value),
        }),
      });

      if (!response.ok) throw new Error();

      const updatedExpense = await response.json();
      
      toast({
        title: "Success",
        description: `Expense ${expense?._id ? "updated" : "created"} successfully`,
        variant: "success",
      });

      onSubmit(updatedExpense);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${expense?._id ? "update" : "create"} expense`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {expense ? "Edit Expense" : "Create Expense"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
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

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : expense ? "Update Expense" : "Create Expense"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
