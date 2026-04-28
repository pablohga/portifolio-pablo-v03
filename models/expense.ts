import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  title:       { type: String, required: true },
  category:    {
    type: String,
    required: true,
    enum: [
      'transport',      // Transporte
      'food',           // Alimentação
      'internet',       // Internet / Telefone
      'rent',           // Aluguel / Coworking
      'software',       // Software / Ferramentas
      'equipment',      // Equipamentos
      'marketing',      // Marketing / Publicidade
      'taxes',          // Impostos / Contador
      'education',      // Cursos / Capacitação
      'other',          // Outros
    ],
  },
  amount:        { type: Number, required: true },
  date:          { type: Date, required: true },         // Data em que ocorreu
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'pix', 'cash', 'bank_slip', 'other'],
    default: 'pix',
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending'],
    default: 'paid',
  },
  recurrent:           { type: Boolean, default: false },
  recurrenceFrequency: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    default: null,
  },
  notes: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Expense =
  mongoose.models.Expense || mongoose.model('Expense', expenseSchema);