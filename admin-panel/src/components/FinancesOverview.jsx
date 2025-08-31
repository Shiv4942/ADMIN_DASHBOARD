import React, { useEffect, useState, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinancesOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState({ summary: null, expenses: [], budgets: [], transactions: [] });
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', budget: 0 });
  const [showTxnForm, setShowTxnForm] = useState(false);
  const [newTxn, setNewTxn] = useState({ description: '', amount: 0, category: 'General', type: 'expense' });
  const [showBothCurrencies, setShowBothCurrencies] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const API_BASE = API_ENDPOINTS.FINANCE;

  const fetchOverview = async () => {
    try {
      const res = await fetch(`${API_BASE}/overview`);
      const data = await res.json();
      setOverview({
        summary: data.summary || null,
        expenses: data.expenses || [],
        budgets: data.budgets || [],
        transactions: data.transactions || []
      });
    } catch (e) {
      console.error('Failed to load finance overview', e);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const financialData = overview.summary;

  // Get combined monthly expenses and transactions
  const getCombinedMonthlyData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const combined = [];

    // Process expenses
    if (overview.expenses && overview.expenses.length) {
      overview.expenses.forEach(expense => {
        const expenseDate = new Date(expense.date || expense.timestamp);
        if (expenseDate.getMonth() === currentMonth && 
            expenseDate.getFullYear() === currentYear) {
          combined.push({
            ...expense,
            type: 'expense',
            amount: expense.amount || { original: 0, usd: 0 },
            date: expenseDate
          });
        }
      });
    }

    // Process transactions (only expense type)
    if (overview.transactions && overview.transactions.length) {
      overview.transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
          const txnDate = new Date(transaction.date || transaction.timestamp);
          if (txnDate.getMonth() === currentMonth && 
              txnDate.getFullYear() === currentYear) {
            combined.push({
              ...transaction,
              type: 'transaction',
              amount: {
                original: transaction.amount?.original || transaction.amount?.inr || 0,
                usd: transaction.amount?.usd || 0
              },
              date: txnDate,
              category: transaction.category || 'Uncategorized',
              description: transaction.description || 'No description'
            });
          }
        }
      });
    }

    return combined;
  };

  const monthlyData = getCombinedMonthlyData();
  
  // Prepare chart data
  const prepareChartData = (expenses) => {
    const categories = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'Uncategorized';
      const amount = expense.amount?.original || expense.amount?.inr || 0;
      
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += amount;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);
    
    // Generate colors based on category names
    const backgroundColors = labels.map((_, i) => {
      const hue = (i * 137.508) % 360; // Golden angle approximation for distinct colors
      return `hsl(${hue}, 70%, 60%)`;
    });

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        borderWidth: 1
      }]
    };
  };

  // Initialize or update chart
  useEffect(() => {
    if (chartRef.current && monthlyData.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const chartData = prepareChartData(monthlyData);
      
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${fmtINR(value)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
    
    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyData]);


  
  // Calculate total expenses for current month
  const currentMonthTotal = monthlyData.reduce((sum, item) => {
    const amount = item.amount?.original || item.amount?.inr || 0;
    return sum + amount;
  }, 0);

  // Get recent transactions for the transactions tab
  const recentTransactions = (overview.transactions || [])
    .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp))
    .slice(0, 10);  // Show only 10 most recent transactions

  const budgets = overview.budgets;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'budgets', label: 'Budgets', icon: '🎯' },
    { id: 'transactions', label: 'Transactions', icon: '📝' },
  ];

  const fmtUSD = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
  
  // Show amount in appropriate currency/currencies based on showBothCurrencies state
  const show = (amountObj) => {
    if (!amountObj) return '-';
    
    // Handle different amount object structures
    const inrAmount = amountObj.original !== undefined ? amountObj.original : 
                     amountObj.inr !== undefined ? amountObj.inr : 0;
    const usdAmount = amountObj.usd !== undefined ? amountObj.usd : 
                     amountObj.original !== undefined ? (amountObj.original / 83.25).toFixed(2) : 0;
    
    if (showBothCurrencies) {
      return `${fmtINR(inrAmount)} / ${fmtUSD(usdAmount)}`;
    }
    return fmtINR(inrAmount);
  };
  
  // Helper function to calculate net amount in both currencies
  const calculateNetAmount = (income, expense) => {
    if (!income || !expense) return { inr: 0, usd: 0 };
    
    const inrNet = (income.original || income.inr || 0) - (expense.original || expense.inr || 0);
    const usdNet = (income.usd || (income.original / 83.25) || 0) - 
                  (expense.usd || (expense.original / 83.25) || 0);
    
    return { inr: inrNet, usd: usdNet };
  };

  const renderOverview = () => {
    if (!financialData) {
      return (
        <div className="space-y-6">
          <div className="card p-4">
            <p className="text-gray-600">Loading finance overview…</p>
          </div>
        </div>
      );
    }
    return (
    <div className="space-y-6">
      {/* Currency Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
        <button 
          onClick={() => setShowBothCurrencies(!showBothCurrencies)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showBothCurrencies ? 'Show INR Only' : 'Show Both Currencies'}
        </button>
      </div>
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="text-sm text-gray-600">{show(financialData?.currentBalance)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-sm font-medium text-green-700">{show(financialData?.monthlyIncome)}</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-sm font-medium text-red-700">{show(financialData?.monthlyExpenses)}</p>
            </div>
            <div className="text-3xl">📉</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Savings</p>
              <p className="text-sm font-medium text-blue-700">
                {financialData ? show(calculateNetAmount(financialData.monthlyIncome, financialData.monthlyExpenses)) : '-'}
              </p>
            </div>
            <div className="text-3xl">💎</div>
          </div>
        </div>
      </div>

      {/* Savings & Investments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Current Savings</span>
                <span>{show(financialData?.savings)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((financialData?.savings?.usd || 0) / 10000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Goal: {fmtINR(10000 * 83.25)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Portfolio</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total Investments</span>
                <span>{show(financialData?.investments)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((financialData?.investments?.usd || 0) / 20000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: {fmtINR(20000 * 83.25)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderExpenses = () => {
    // Group combined data by category for the current month
    const dataByCategory = monthlyData.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      const amount = item.amount?.original || item.amount?.inr || 0;
      
      if (!acc[category]) {
        acc[category] = { 
          amount: 0, 
          color: item.color || 'bg-blue-500',
          items: []
        };
      }
      acc[category].amount += amount;
      acc[category].items.push(item);
      return acc;
    }, {});
    
    // Convert to array, calculate percentages, and sort by amount
    const expensesList = Object.entries(dataByCategory)
      .map(([category, data]) => {
        const percentage = currentMonthTotal > 0 ? (data.amount / currentMonthTotal) * 100 : 0;
        return {
          category,
          amount: { original: data.amount, usd: data.amount / 83.25 },
          percentage: percentage.toFixed(1),
          color: data.color,
          items: data.items.sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort items by date
        };
      })
      .sort((a, b) => b.amount.original - a.amount.original);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Breakdown */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Month's Expenses</h3>
              <span className="text-sm font-medium text-blue-700">
                {show({ original: currentMonthTotal, usd: currentMonthTotal / 83.25 })}
              </span>
            </div>
            <div className="space-y-3">
              {expensesList.length > 0 ? (
                expensesList.map((expense, index) => (
                  <div key={`${expense.category}-${index}`} className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${expense.color}`}></div>
                          <span className="text-sm font-medium text-gray-900">{expense.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{show(expense.amount)}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${Math.min(expense.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{expense.percentage}% of total</span>
                        <span>{show(expense.amount)}</span>
                      </div>
                    </div>
                    
                    {/* Transaction/Expense items */}
                    <div className="ml-6 space-y-2">
                      {expense.items.map((item, itemIdx) => (
                        <div key={`${expense.category}-item-${itemIdx}`} 
                             className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 truncate max-w-[180px]">
                            {item.description || 'Expense'}
                            <span className="ml-2 text-xs text-gray-400">
                              {item.date.toLocaleDateString()}
                            </span>
                          </span>
                          <span className="font-medium">
                            {show(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No expenses recorded for this month</p>
              )}
            </div>
          </div>

        {/* Expense Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h3>
          <div className="h-64">
            {monthlyData.length > 0 ? (
              <canvas ref={chartRef} />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No expense data available for this month</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  };
  const renderBudgets = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Budget Tracking</h3>
        <button className="btn-primary" onClick={() => setShowBudgetForm(true)}>Set Budget</button>
      </div>
      {showBudgetForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              className="input-field" 
              placeholder="Category" 
              value={newBudget.category} 
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
            />
            <input 
              className="input-field" 
              placeholder="Monthly budget" 
              type="number" 
              value={newBudget.budget} 
              onChange={(e) => setNewBudget({ ...newBudget, budget: parseFloat(e.target.value || 0) })}
            />
            <div className="flex space-x-2">
              <button 
                className="btn-primary"
                onClick={async () => {
                  if (!newBudget.category || newBudget.budget <= 0) { alert('Enter category and amount'); return; }
                  try {
                    await fetch(`${API_BASE}/budgets`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: newBudget.category, budget: Number(newBudget.budget) }) });
                    setNewBudget({ category: '', budget: 0 });
                    setShowBudgetForm(false);
                    fetchOverview();
                  } catch (e) { console.error(e); }
                }}
              >Save</button>
              <button className="btn-secondary" onClick={() => setShowBudgetForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4">
        {budgets.map((budget, index) => (
          <div key={index} className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-900">{budget.category}</h4>
              <div className="text-right">
                <p className="text-sm text-gray-600">Budget: {show(budget.budget)}</p>
                <p className="text-sm text-gray-600">Remaining: {show(budget.remaining)}</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Spent: {show(budget.spent)}</span>
                <span>{Math.round((budget.spent.original / Math.max(budget.budget.original, 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (budget.spent.original / Math.max(budget.budget.original, 1)) > 0.9 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((budget.spent.original / Math.max(budget.budget.original, 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button className="btn-primary" onClick={() => setShowTxnForm(true)}>Add Transaction</button>
      </div>
      {showTxnForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input className="input-field" placeholder="Description" value={newTxn.description} onChange={(e) => setNewTxn({ ...newTxn, description: e.target.value })} />
            <input className="input-field" type="number" placeholder="Amount" value={newTxn.amount} onChange={(e) => setNewTxn({ ...newTxn, amount: parseFloat(e.target.value || 0) })} />
            <input className="input-field" placeholder="Category" value={newTxn.category} onChange={(e) => setNewTxn({ ...newTxn, category: e.target.value })} />
            <select className="input-field" value={newTxn.type} onChange={(e) => setNewTxn({ ...newTxn, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <div className="flex space-x-2">
              <button 
                className="btn-primary"
                onClick={async () => {
                  if (!newTxn.description || !newTxn.amount) { alert('Enter description and amount'); return; }
                  try {
                    await fetch(`${API_BASE}/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: newTxn.description, amount: Number(newTxn.amount), category: newTxn.category, date: new Date().toISOString().slice(0,10), type: newTxn.type }) });
                    setNewTxn({ description: '', amount: 0, category: 'General', type: 'expense' });
                    setShowTxnForm(false);
                    fetchOverview();
                  } catch (e) { console.error(e); }
                }}
              >Save</button>
              <button className="btn-secondary" onClick={() => setShowTxnForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4">
        {recentTransactions.map((transaction, idx) => (
          <div key={`${transaction.description}-${transaction.date || idx}`} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                transaction.type === 'income' ? 'text-green-700' : 'text-red-700'
              }`}>
                {transaction.type === 'income' ? '+' : ''}{show(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finances Overview</h1>
        <p className="text-gray-600 mt-2">Track your income, expenses, and financial goals.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'expenses' && renderExpenses()}
        {activeTab === 'budgets' && renderBudgets()}
        {activeTab === 'transactions' && renderTransactions()}
      </div>
    </div>
  );
};

export default FinancesOverview;
