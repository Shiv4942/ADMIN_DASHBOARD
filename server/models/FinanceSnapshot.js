import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true }, // USD
  category: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true }
}, { _id: true });

const ExpenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true }, // USD
  percentage: { type: Number, required: true },
  color: { type: String, required: true }
}, { _id: false });

const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  budget: { type: Number, required: true }, // USD
  spent: { type: Number, required: true }, // USD
  remaining: { type: Number, required: true } // USD
}, { _id: false });

const SummarySchema = new mongoose.Schema({
  currentBalance: { type: Number, required: true },
  monthlyIncome: { type: Number, required: true },
  monthlyExpenses: { type: Number, required: true },
  savings: { type: Number, required: true },
  investments: { type: Number, required: true }
}, { _id: false });

const FinanceSnapshotSchema = new mongoose.Schema({
  summary: { type: SummarySchema, required: true },
  expenses: { type: [ExpenseSchema], default: [] },
  transactions: { type: [TransactionSchema], default: [] },
  budgets: { type: [BudgetSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.FinanceSnapshot || mongoose.model('FinanceSnapshot', FinanceSnapshotSchema);


