"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

const CATEGORIES = [
  { value: "transport",  label: "🚗 Transporte" },
  { value: "food",       label: "🍽️ Alimentação" },
  { value: "internet",   label: "📶 Internet / Telefone" },
  { value: "rent",       label: "🏢 Aluguel / Coworking" },
  { value: "software",   label: "💻 Software / Ferramentas" },
  { value: "equipment",  label: "🖥️ Equipamentos" },
  { value: "marketing",  label: "📢 Marketing / Publicidade" },
  { value: "taxes",      label: "📋 Impostos / Contador" },
  { value: "education",  label: "📚 Cursos / Capacitação" },
  { value: "other",      label: "📦 Outros" },
];

const PAYMENT_METHODS = [
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "debit_card",  label: "Cartão de Débito" },
  { value: "pix",         label: "PIX" },
  { value: "cash",        label: "Dinheiro" },
  { value: "bank_slip",   label: "Boleto" },
  { value: "other",       label: "Outro" },
];

const expenseSchema = z.object({
  title:               z.string().min(2, "Mínimo 2 caracteres"),
  category:            z.string().min(1, "Selecione uma categoria"),
  amount:              z.string().min(1, "Informe o valor"),
  date:                z.date({ required_error: "Selecione a data" }),
  paymentMethod:       z.string().min(1, "Selecione a forma de pagamento"),
  paymentStatus:       z.string().min(1, "Selecione o status"),
  recurrent:           z.boolean().default(false),
  recurrenceFrequency: z.string().optional(),
  notes:               z.string().optional(),
});

interface ExpenseDialogProps {
  expense?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ExpenseDialog({ expense, open, onOpenChange, onSubmit }: ExpenseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      category: "",
      amount: "",
      date: new Date(),
      paymentMethod: "pix",
      paymentStatus: "paid",
      recurrent: false,
      recurrenceFrequency: undefined,
      notes: "",
    },
  });

  const isRecurrent = form.watch("recurrent");

  useEffect(() => {
    if (expense) {
      form.reset({
        title:               expense.title,
        category:            expense.category,
        amount:              expense.amount.toString(),
        date:                expense.date ? new Date(expense.date) : new Date(),
        paymentMethod:       expense.paymentMethod,
        paymentStatus:       expense.paymentStatus,
        recurrent:           expense.recurrent ?? false,
        recurrenceFrequency: expense.recurrenceFrequency ?? undefined,
        notes:               expense.notes ?? "",
      });
    } else {
      form.reset({
        title: "", category: "", amount: "", date: new Date(),
        paymentMethod: "pix", paymentStatus: "paid",
        recurrent: false, recurrenceFrequency: undefined, notes: "",
      });
    }
  }, [expense, open]);

  async function handleSubmit(values: z.infer<typeof expenseSchema>) {
    try {
      setIsLoading(true);
      const url    = expense?._id ? `/api/expenses/${expense._id}` : "/api/expenses";
      const method = expense?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          amount: parseFloat(values.amount),
          recurrenceFrequency: values.recurrent ? values.recurrenceFrequency : null,
        }),
      });

      if (!response.ok) throw new Error();
      const result = await response.json();

      toast({
        title: "Sucesso",
        description: `Despesa ${expense?._id ? "atualizada" : "registrada"} com sucesso`,
        variant: "success",
      });
      onSubmit(result);
      onOpenChange(false);
    } catch {
      toast({ title: "Erro", description: "Falha ao salvar a despesa", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? "Editar Despesa" : "Nova Despesa"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            {/* Título */}
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl><Input placeholder="Ex: Hospedagem do servidor" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Categoria + Valor */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="0,00" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Data + Forma de pagamento */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Despesa</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} locale={ptBR} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {PAYMENT_METHODS.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Status do pagamento */}
            <FormField control={form.control} name="paymentStatus" render={({ field }) => (
              <FormItem>
                <FormLabel>Status do Pagamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="paid">✅ Pago</SelectItem>
                    <SelectItem value="pending">⏳ Pendente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Recorrente */}
            <FormField control={form.control} name="recurrent" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel className="text-sm font-medium">Despesa Recorrente?</FormLabel>
                  <p className="text-xs text-muted-foreground">Ex: aluguel, internet, assinaturas</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            {/* Frequência (só aparece se recorrente) */}
            {isRecurrent && (
              <FormField control={form.control} name="recurrenceFrequency" render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Observações */}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Observações <span className="text-muted-foreground text-xs">(opcional)</span></FormLabel>
                <FormControl><Textarea placeholder="Detalhes adicionais..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Salvando..." : expense ? "Atualizar Despesa" : "Registrar Despesa"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}