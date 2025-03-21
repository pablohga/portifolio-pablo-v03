"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ExpenseDialog } from "./expense-dialog";

interface Expense {
  _id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  value: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  startDate?: Date;
  endDate?: Date;
}

interface Client {
  _id: string;
  name: string;
  email: string;
}

interface ExpenseListProps {
  userId: string;
}

export function ExpenseList({ userId }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpenExpense, setIsDialogOpenExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    Promise.all([fetchExpenses(), fetchClients()]).finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchExpenses() {
    try {
      const response = await fetch(`/api/expenses?userId=${userId}`);
      
      if (!response.ok) throw new Error();
      const data = await response.json();
      console.log('data exense', data)
      setExpenses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch expenses",
        variant: "destructive",
      });
    }
  }

  async function fetchClients() {
    try {
      const response = await fetch(`/api/clients?userId=${userId}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
    }
  }

  function handleAddExpense() {
    setSelectedExpense(null);
    setIsDialogOpenExpense(true);
  }

  function handleEditExpense(expense: Expense) {
    setSelectedExpense(expense);
    setIsDialogOpenExpense(true);
  }

async function handleDeleteExpense(id: string) {
  try {
    const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`Erro ao deletar despesa. Status: ${response.status}`);
    }

    setExpenses(expenses.filter(expense => expense._id !== id));
    toast({ title: "Success", description: "Expense deleted successfully", variant: "success" });
  } catch (error) {
    console.error("Erro ao deletar a despesa:", error); // ✅ Logando erro no console
    toast({ title: "Error", description: "Failed to delete expense", variant: "destructive" });
  }
}

  function handleExpenseSubmit(updatedExpense: Expense) {
    if (selectedExpense) {
      setExpenses(expenses.map(expense => (expense._id === updatedExpense._id ? updatedExpense : expense)));
    } else {
      setExpenses([...expenses, updatedExpense]);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("ExpenseList.title")}</h2>
        <Button onClick={handleAddExpense}>
          <Plus className="w-4 h-4 mr-2" />
          {t("ExpenseList.addExpense")}
        </Button>
        <Button onClick={handleAddExpense}>
          <Plus className="w-4 h-4 mr-2" />
          {t("ExpenseList.addExpense")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t("ExpenseList.noExpensesFound")}
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>
                    {clients.find(c => c._id === expense.clientId)?.name || 'Unknown Client'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(expense.value)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        expense.paymentStatus === 'paid' 
                          ? 'default' 
                          : expense.paymentStatus === 'partial' 
                          ? 'secondary' 
                          : 'destructive'
                      }
                    >
                      {expense.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExpense(expense)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("ExpenseList.deleteExpense")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("ExpenseList.deleteConfirmation")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteExpense(expense._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
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

      <ExpenseDialog clients={clients} expense={selectedExpense} open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleExpenseSubmit} />

      <ExpenseDialog clients={clients} expense={selectedExpense} open={isDialogOpenExpense} onOpenChange={setIsDialogOpenExpense} onSubmit={handleExpenseSubmit} />
    </div>
  );
}
