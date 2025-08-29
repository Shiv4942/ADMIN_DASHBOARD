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

router.get('/overview', async (req, res) => {
  try {
    let snap = await FinanceSnapshot.findOne({}, {}, { sort: { updatedAt: -1 } });
    if (!snap) {
      snap = await FinanceSnapshot.create({
        summary: { currentBalance: 0, monthlyIncome: 0, monthlyExpenses: 0, savings: 0, investments: 0 },
        expenses: [],
        transactions: [],
        budgets: []
      });
    }

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
    console.error(e);
    res.status(500).json({ error: 'Failed to load finance overview' });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const { description, amount, category, date, type } = req.body;
    if (!description || !amount || !type) return res.status(400).json({ error: 'Missing fields' });
    let snap = await FinanceSnapshot.findOne({}, {}, { sort: { updatedAt: -1 } });
    if (!snap) {
      snap = await FinanceSnapshot.create({
        summary: { currentBalance: 0, monthlyIncome: 0, monthlyExpenses: 0, savings: 0, investments: 0 },
        expenses: [],
        transactions: [],
        budgets: []
      });
    }
    snap.transactions.unshift({ description, amount, category, date, type });
    if (type === 'income') {
      snap.summary.currentBalance += amount;
      snap.summary.monthlyIncome += amount;
    } else {
      snap.summary.currentBalance -= amount;
      snap.summary.monthlyExpenses += amount;
    }
    snap.updatedAt = new Date();
    await snap.save();
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

router.post('/budgets', async (req, res) => {
  try {
    const { category, budget } = req.body; // USD
    if (!category || !budget) return res.status(400).json({ error: 'Missing fields' });
    let snap = await FinanceSnapshot.findOne({}, {}, { sort: { updatedAt: -1 } });
    if (!snap) {
      snap = await FinanceSnapshot.create({
        summary: { currentBalance: 0, monthlyIncome: 0, monthlyExpenses: 0, savings: 0, investments: 0 },
        expenses: [],
        transactions: [],
        budgets: []
      });
    }
    const existing = snap.budgets.find(b => b.category === category);
    if (existing) {
      existing.budget = budget;
      existing.remaining = Math.max(0, budget - existing.spent);
    } else {
      snap.budgets.push({ category, budget, spent: 0, remaining: budget });
    }
    snap.updatedAt = new Date();
    await snap.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to set budget' });
  }
});

export default router;


