import { Router } from 'express';
import FinanceSnapshot from '../models/FinanceSnapshot.js';

const router = Router();

// Simple static conversion; option to override via env
const USD_TO_INR = Number(process.env.USD_TO_INR || 83.25);

// Convert USD to INR for display purposes only
const convertForDisplay = (amount) => ({ 
  usd: amount, 
  inr: Math.round(amount * USD_TO_INR * 100) / 100 
});

// For summary calculations, we'll use the original amounts
const mapSummary = (summary) => ({
  currentBalance: convertForDisplay(summary.currentBalance),
  monthlyIncome: convertForDisplay(summary.monthlyIncome),
  monthlyExpenses: convertForDisplay(summary.monthlyExpenses),
  savings: convertForDisplay(summary.savings),
  investments: convertForDisplay(summary.investments)
});

// Helper function to safely find or create snapshot
const getOrCreateSnapshot = async () => {
  try {
    let snap = await FinanceSnapshot.findOne({}, {}, { 
      sort: { updatedAt: -1 },
      maxTimeMS: 10000 // 10 second timeout
    });
    
    if (!snap) {
      snap = await FinanceSnapshot.create({
        summary: { currentBalance: 0, monthlyIncome: 0, monthlyExpenses: 0, savings: 0, investments: 0 },
        expenses: [],
        transactions: [],
        budgets: []
      });
    }
    return snap;
  } catch (error) {
    console.error('Error getting/creating snapshot:', error);
    throw new Error('Database operation failed');
  }
};

// Helper function to add transaction using atomic operations
const addTransactionAtomically = async (transactionData) => {
  const { description, amount, category, date, type } = transactionData;
  
  let retries = 3;
  while (retries > 0) {
    try {
      // Use findOneAndUpdate with atomic operations to avoid version conflicts
      const result = await FinanceSnapshot.findOneAndUpdate(
        {}, // Find any document
        {
          $push: { 
            transactions: { 
              $each: [{ 
                description: description.trim(), 
                amount: Number(amount), // Store amount as-is
                category: category || 'General', 
                date: date || new Date().toISOString().split('T')[0], 
                type 
              }], 
              $position: 0 
            } 
          },
          $inc: {
            'summary.currentBalance': type === 'income' ? Number(amount) : -Number(amount),
            'summary.monthlyIncome': type === 'income' ? Number(amount) : 0,
            'summary.monthlyExpenses': type === 'expense' ? Number(amount) : 0
          },
          $set: { updatedAt: new Date() }
        },
        { 
          new: true, 
          upsert: true, // Create if doesn't exist
          runValidators: true,
          maxTimeMS: 15000
        }
      );
      
      return result;
    } catch (error) {
      retries--;
      if (retries === 0) {
        throw error;
      }
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 100 * (3 - retries)));
    }
  }
};

// Helper function to set budget using atomic operations
const setBudgetAtomically = async (budgetData) => {
  const { category, budget } = budgetData;
  
  let retries = 3;
  while (retries > 0) {
    try {
      // First, try to update existing budget
      const updateResult = await FinanceSnapshot.updateOne(
        { 'budgets.category': category.trim() },
        { 
          $set: { 
            'budgets.$.budget': Number(budget), // Store budget as-is
            'budgets.$.remaining': Number(budget), // Reset remaining to budget amount
            updatedAt: new Date()
          }
        },
        { maxTimeMS: 15000 }
      );
      
      // If no budget was updated, create a new one
      if (updateResult.matchedCount === 0) {
        await FinanceSnapshot.findOneAndUpdate(
          {}, // Find any document
          {
            $push: { 
              budgets: { 
                category: category.trim(), 
                budget: Number(budget), // Store budget as-is
                spent: 0, 
                remaining: Number(budget) // Store remaining as-is
              } 
            },
            $set: { updatedAt: new Date() }
          },
          { 
            new: true, 
            upsert: true, // Create if doesn't exist
            runValidators: true,
            maxTimeMS: 15000
          }
        );
      }
      
      return { success: true };
    } catch (error) {
      retries--;
      if (retries === 0) {
        throw error;
      }
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 100 * (3 - retries)));
    }
  }
};

router.get('/overview', async (req, res) => {
  try {
    const snap = await getOrCreateSnapshot();
    
    res.json({
      summary: mapSummary(snap.summary),
      expenses: snap.expenses.map(e => ({ ...e.toObject(), amount: convertForDisplay(e.amount) })),
      transactions: snap.transactions.map(t => ({ ...t.toObject(), amount: convertForDisplay(t.amount) })),
      budgets: snap.budgets.map(b => ({
        category: b.category,
        budget: convertForDisplay(b.budget),
        spent: convertForDisplay(b.spent),
        remaining: convertForDisplay(b.remaining)
      }))
    });
  } catch (e) {
    console.error('Finance overview error:', e);
    res.status(500).json({ error: 'Failed to load finance overview', details: e.message });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const { description, amount, category, date, type } = req.body;
    
    console.log('Adding transaction:', { description, amount, category, date, type });
    
    // Validate input
    if (!description || !amount || !type) {
      return res.status(400).json({ error: 'Missing required fields: description, amount, type' });
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "income" or "expense"' });
    }
    
    // Use atomic operation to avoid version conflicts
    const result = await addTransactionAtomically({ description, amount, category, date, type });
    console.log('Transaction added successfully:', result);
    
    res.json({ ok: true, message: 'Transaction added successfully' });
  } catch (e) {
    console.error('Add transaction error:', e);
    res.status(500).json({ error: 'Failed to add transaction', details: e.message });
  }
});

router.post('/budgets', async (req, res) => {
  try {
    const { category, budget } = req.body;
    
    console.log('Setting budget:', { category, budget });
    
    // Validate input
    if (!category || !budget) {
      return res.status(400).json({ error: 'Missing required fields: category, budget' });
    }
    
    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ error: 'Budget must be a positive number' });
    }
    
    // Use atomic operation to avoid version conflicts
    const result = await setBudgetAtomically({ category, budget });
    console.log('Budget set successfully:', result);
    
    res.json({ ok: true, message: 'Budget set successfully' });
  } catch (e) {
    console.error('Set budget error:', e);
    res.status(500).json({ error: 'Failed to set budget', details: e.message });
  }
});

export default router;


