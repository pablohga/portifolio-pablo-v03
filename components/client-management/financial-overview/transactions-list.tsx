"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const transactions = [
  {
    id: "1",
    date: "2024-03-10",
    amount: 1500,
    client: "John Doe",
    status: "paid",
  },
  {
    id: "2",
    date: "2024-03-09",
    amount: 2000,
    client: "Jane Smith",
    status: "pending",
  },
  {
    id: "3",
    date: "2024-03-08",
    amount: 3000,
    client: "Bob Johnson",
    status: "cancelled",
  },
];

export function TransactionsList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {new Date(transaction.date).toLocaleDateString()}
            </TableCell>
            <TableCell>{transaction.client}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(transaction.amount)}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  transaction.status === "paid"
                    ? "default"
                    : transaction.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {transaction.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}