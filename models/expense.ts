import mongoose, { Schema, Document } from "mongoose";

export interface Expense extends Document {
  userId: string;
  clientId?: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  paymentStatus: "pending" | "partial" | "paid";
  date: Date;
  dueDate?: Date;
  paymentMethod?: string;
  currency?: string;
  paymentHistory?: {
    amount: number;
    date: Date;
    description?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ExpenseSchema = new Schema<Expense>(
  {
    userId: { type: String, required: true },
    clientId: { type: String, default: null },
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    date: { type: Date, required: true }, // Data da despesa
    dueDate: { type: Date, default: null }, // Data de vencimento
    paymentMethod: { type: String, default: "Cartão de Crédito" },
    currency: { type: String, default: "BRL" },
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        description: String,
      },
    ],
  },
  { timestamps: true } // Garante createdAt e updatedAt automáticos
);

export const Expense =
  mongoose.models.Expense || mongoose.model<Expense>("Expense", ExpenseSchema);
