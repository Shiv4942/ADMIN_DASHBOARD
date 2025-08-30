import { Router } from 'express';
import FinanceSnapshot from '../models/FinanceSnapshot.js';

const router = Router();

// Simple static conversion; option to override via env
const USD_TO_INR = Number(process.env.USD_TO_INR || 83.25);

const convert = (usd) => ({ usd, inr: Math.round(usd * USD_TO_INR * 100) / 100 });

const mapSummary = (summary) => ({
  currentBalance: convert(summary.currentBalance),
  monthlyIncome: convert(summary.monthlyIncome),
  monthlyExpenses: convert(summary.monthlyExpenses),
  savings: convert(summary.savings),
  investments: convert(summary.investments)
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
                amount, 
                category: category || 'General', 
                date: date || new Date().toISOString().split('T')[0], 
                type 
              }], 
              $position: 0 
            } 
          },
          $inc: {
            'summary.currentBalance': type === 'income' ? amount : -amount,
            'summary.monthlyIncome': type === 'income' ? amount : 0,
            'summary.monthlyExpenses': type === 'expense' ? amount : 0
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
      // Use findOneAndUpdate with atomic operations
      const result = await FinanceSnapshot.findOneAndUpdate(
        {}, // Find any document
        {
          $set: { 
            updatedAt: new Date(),
            $or: [
              // Update existing budget
              {
                'budgets': {
                  $elemMatch: { category: category.trim() }
                }
              },
              // Add new budget if category doesn't exist
              {
                $push: { 
                  budgets: { 
                    category: category.trim(), 
                    budget, 
                    spent: 0, 
                    remaining: budget 
                  } 
                } 
              }
            ]
          }
        },
        { 
          new: true, 
          upsert: true, // Create if doesn't exist
          runValidators: true,
          maxTimeMS: 15000
        }
      );
      
      // If category exists, update it atomically
      if (result.budgets.some(b => b.category === category.trim())) {
        await FinanceSnapshot.updateOne(
          { 'budgets.category': category.trim() },
          { 
            $set: { 
              'budgets.$.budget': budget,
              'budgets.$.remaining': Math.max(0, budget - (result.budgets.find(b => b.category === category.trim())?.spent || 0)),
              updatedAt: new Date()
            }
          },
          { maxTimeMS: 15000 }
        );
      }
      
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

router.get('/overview', async (req, res) => {
  try {
    const snap = await getOrCreateSnapshot();
    
    res.json({
      summary: mapSummary(snap.summary),
      expenses: snap.expenses.map(e => ({ ...e.toObject(), amount: convert(e.amount) })),
      transactions: snap.transactions.map(t => ({ ...t.toObject(), amount: convert(t.amount) })),
      budgets: snap.budgets.map(b => ({
        category: b.category,
        budget: convert(b.budget),
        spent: convert(b.spent),
        remaining: convert(b.remaining)
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
    await addTransactionAtomically({ description, amount, category, date, type });
    
    res.json({ ok: true, message: 'Transaction added successfully' });
  } catch (e) {
    console.error('Add transaction error:', e);
    res.status(500).json({ error: 'Failed to add transaction', details: e.message });
  }
});

router.post('/budgets', async (req, res) => {
  try {
    const { category, budget } = req.body;
    
    // Validate input
    if (!category || !budget) {
      return res.status(400).json({ error: 'Missing required fields: category, budget' });
    }
    
    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ error: 'Budget must be a positive number' });
    }
    
    // Use atomic operation to avoid version conflicts
    await setBudgetAtomically({ category, budget });
    
    res.json({ ok: true, message: 'Budget set successfully' });
  } catch (e) {
    console.error('Set budget error:', e);
    res.status(500).json({ error: 'Failed to set budget', details: e.message });
  }
});

export default router;


