"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ExpenseDialog } from "./expense-dialog";

// ✅ Interface alinhada com o novo modelo
interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
  recurrent: boolean;
  recurrenceFrequency?: string;
  notes?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  transport:  "🚗 Transporte",
  food:       "🍽️ Alimentação",
  internet:   "📶 Internet / Telefone",
  rent:       "🏢 Aluguel / Coworking",
  software:   "💻 Software / Ferramentas",
  equipment:  "🖥️ Equipamentos",
  marketing:  "📢 Marketing",
  taxes:      "📋 Impostos / Contador",
  education:  "📚 Cursos",
  other:      "📦 Outros",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card: "Cartão de Crédito",
  debit_card:  "Cartão de Débito",
  pix:         "PIX",
  cash:        "Dinheiro",
  bank_slip:   "Boleto",
  other:       "Outro",
};

interface ExpenseListProps {
  userId: string;
}

export function ExpenseList({ userId }: ExpenseListProps) {
  const [expenses, setExpenses]           = useState<Expense[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [isDialogOpen, setIsDialogOpen]   = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpenses().finally(() => setIsLoading(false));
  }, []);

  async function fetchExpenses() {
    try {
      const res = await fetch(`/api/expenses?userId=${userId}`);
      if (!res.ok) throw new Error();
      setExpenses(await res.json());
    } catch {
      toast({ title: "Erro", description: "Falha ao carregar despesas", variant: "destructive" });
    }
  }

  function handleAdd() {
    setSelectedExpense(null);
    setIsDialogOpen(true);
  }

  function handleEdit(expense: Expense) {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setExpenses(prev => prev.filter(e => e._id !== id));
      toast({ title: "Sucesso", description: "Despesa removida", variant: "success" });
    } catch {
      toast({ title: "Erro", description: "Falha ao remover despesa", variant: "destructive" });
    }
  }

  function handleSubmit(updated: Expense) {
    setExpenses(prev =>
      selectedExpense
        ? prev.map(e => (e._id === updated._id ? updated : e))
        : [updated, ...prev]
    );
  }

  // Totalizadores do cabeçalho
  const totalPago    = expenses.filter(e => e.paymentStatus === "paid").reduce((s, e) => s + e.amount, 0);
  const totalPendente = expenses.filter(e => e.paymentStatus === "pending").reduce((s, e) => s + e.amount, 0);
  const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Despesas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pago: <span className="text-green-500 font-medium">{fmt(totalPago)}</span>
            {" · "}
            Pendente: <span className="text-yellow-500 font-medium">{fmt(totalPendente)}</span>
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Despesa
        </Button>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Forma de Pgto</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recorrente</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhuma despesa registrada ainda.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense._id}>

                  <TableCell className="font-medium">{expense.title}</TableCell>

                  <TableCell>
                    {CATEGORY_LABELS[expense.category] ?? expense.category}
                  </TableCell>

                  <TableCell>
                    {expense.date
                      ? format(new Date(expense.date), "dd/MM/yyyy", { locale: ptBR })
                      : "—"}
                  </TableCell>

                  <TableCell>
                    {PAYMENT_METHOD_LABELS[expense.paymentMethod] ?? expense.paymentMethod}
                  </TableCell>

                  {/* ✅ usa amount, não value */}
                  <TableCell className="font-medium">
                    {fmt(expense.amount)}
                  </TableCell>

                  <TableCell className="p-0 align-middle [&:has([role=checkbox])]:pr-1">
                    <Badge variant={expense.paymentStatus === "paid" ? "default" : "destructive"}>
                      {expense.paymentStatus === "paid" ? "✅ Pago" : "⏳ Pendente"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {expense.recurrent ? (
                      <Badge variant="secondary">
                        {expense.recurrenceFrequency === "monthly" ? "Mensal"
                          : expense.recurrenceFrequency === "weekly" ? "Semanal"
                          : expense.recurrenceFrequency === "yearly" ? "Anual"
                          : "Sim"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">Não</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(expense)}>
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Excluir</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir despesa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(expense._id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ExpenseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        expense={selectedExpense}
        onSubmit={handleSubmit}
      />
    </div>
  );
}