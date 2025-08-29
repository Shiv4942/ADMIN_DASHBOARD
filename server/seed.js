import dotenv from 'dotenv';
import { connectToDatabase } from './db.js';
import FinanceSnapshot from './models/FinanceSnapshot.js';

dotenv.config();

const seed = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI);
    const existing = await FinanceSnapshot.findOne();
    if (existing) {
      console.log('Finance snapshot already exists. Skipping seed.');
      process.exit(0);
    }
    await FinanceSnapshot.create({
      summary: {
        currentBalance: 15420.5,
        monthlyIncome: 8500,
        monthlyExpenses: 6230.75,
        savings: 4560.25,
        investments: 12500
      },
      expenses: [
        { category: 'Housing', amount: 2200, percentage: 35.3, color: 'bg-blue-500' },
        { category: 'Transportation', amount: 450, percentage: 7.2, color: 'bg-green-500' },
        { category: 'Food & Dining', amount: 680, percentage: 10.9, color: 'bg-yellow-500' },
        { category: 'Entertainment', amount: 320, percentage: 5.1, color: 'bg-purple-500' },
        { category: 'Utilities', amount: 280, percentage: 4.5, color: 'bg-red-500' },
        { category: 'Healthcare', amount: 420, percentage: 6.7, color: 'bg-indigo-500' },
        { category: 'Other', amount: 1880.75, percentage: 30.2, color: 'bg-gray-500' }
      ],
      transactions: [
        { description: 'Grocery Shopping', amount: 85.5, category: 'Food', date: '2024-01-15', type: 'expense' },
        { description: 'Salary Deposit', amount: 4250, category: 'Income', date: '2024-01-15', type: 'income' },
        { description: 'Gas Station', amount: 45, category: 'Transportation', date: '2024-01-14', type: 'expense' },
        { description: 'Freelance Project', amount: 1200, category: 'Income', date: '2024-01-14', type: 'income' },
        { description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '2024-01-13', type: 'expense' }
      ],
      budgets: [
        { category: 'Housing', budget: 2500, spent: 2200, remaining: 300 },
        { category: 'Food & Dining', budget: 800, spent: 680, remaining: 120 },
        { category: 'Transportation', budget: 500, spent: 450, remaining: 50 },
        { category: 'Entertainment', budget: 400, spent: 320, remaining: 80 }
      ]
    });
    console.log('Seeded finance snapshot.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

seed();


