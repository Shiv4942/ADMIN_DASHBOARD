import React, { useState } from 'react';

const FinancesOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [customBudgets, setCustomBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', budget: 0 });
  const [showTxnForm, setShowTxnForm] = useState(false);
  const [newTxn, setNewTxn] = useState({ description: '', amount: 0, category: 'General', type: 'expense' });

  const financialData = {
    currentBalance: 15420.50,
    monthlyIncome: 8500.00,
    monthlyExpenses: 6230.75,
    savings: 4560.25,
    investments: 12500.00
  };

  const monthlyExpenses = [
    { category: 'Housing', amount: 2200.00, percentage: 35.3, color: 'bg-blue-500' },
    { category: 'Transportation', amount: 450.00, percentage: 7.2, color: 'bg-green-500' },
    { category: 'Food & Dining', amount: 680.00, percentage: 10.9, color: 'bg-yellow-500' },
    { category: 'Entertainment', amount: 320.00, percentage: 5.1, color: 'bg-purple-500' },
    { category: 'Utilities', amount: 280.00, percentage: 4.5, color: 'bg-red-500' },
    { category: 'Healthcare', amount: 420.00, percentage: 6.7, color: 'bg-indigo-500' },
    { category: 'Other', amount: 1880.75, percentage: 30.2, color: 'bg-gray-500' },
  ];

  const recentTransactions = [
    { id: 1, description: 'Grocery Shopping', amount: -85.50, category: 'Food', date: '2024-01-15', type: 'expense' },
    { id: 2, description: 'Salary Deposit', amount: 4250.00, category: 'Income', date: '2024-01-15', type: 'income' },
    { id: 3, description: 'Gas Station', amount: -45.00, category: 'Transportation', date: '2024-01-14', type: 'expense' },
    { id: 4, description: 'Freelance Project', amount: 1200.00, category: 'Income', date: '2024-01-14', type: 'income' },
    { id: 5, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2024-01-13', type: 'expense' },
  ];

  const budgets = [
    { category: 'Housing', budget: 2500.00, spent: 2200.00, remaining: 300.00 },
    { category: 'Food & Dining', budget: 800.00, spent: 680.00, remaining: 120.00 },
    { category: 'Transportation', budget: 500.00, spent: 450.00, remaining: 50.00 },
    { category: 'Entertainment', budget: 400.00, spent: 320.00, remaining: 80.00 },
  ].concat(customBudgets);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'budgets', label: 'Budgets', icon: '🎯' },
    { id: 'transactions', label: 'Transactions', icon: '📝' },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.currentBalance)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.monthlyIncome)}</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(financialData.monthlyExpenses)}</p>
            </div>
            <div className="text-3xl">📉</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Savings</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(financialData.monthlyIncome - financialData.monthlyExpenses)}</p>
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
                <span>{formatCurrency(financialData.savings)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(financialData.savings / 10000) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Goal: $10,000</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Portfolio</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total Investments</span>
                <span>{formatCurrency(financialData.investments)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(financialData.investments / 20000) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: $20,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Breakdown</h3>
          <div className="space-y-3">
            {monthlyExpenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${expense.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{expense.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</p>
                  <p className="text-xs text-gray-500">{expense.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Chart Placeholder */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Chart</h3>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </div>
  );

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
                onClick={() => {
                  if (!newBudget.category || newBudget.budget <= 0) { alert('Enter category and amount'); return; }
                  setCustomBudgets(prev => [...prev, { category: newBudget.category, budget: newBudget.budget, spent: 0, remaining: newBudget.budget }]);
                  setNewBudget({ category: '', budget: 0 });
                  setShowBudgetForm(false);
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
                <p className="text-sm text-gray-600">Budget: {formatCurrency(budget.budget)}</p>
                <p className="text-sm text-gray-600">Remaining: {formatCurrency(budget.remaining)}</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Spent: {formatCurrency(budget.spent)}</span>
                <span>{Math.round((budget.spent / budget.budget) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (budget.spent / budget.budget) > 0.9 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((budget.spent / budget.budget) * 100, 100)}%` }}
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
                onClick={() => {
                  if (!newTxn.description || !newTxn.amount) { alert('Enter description and amount'); return; }
                  setTransactions(prev => [{ id: Date.now(), date: new Date().toISOString().slice(0,10), ...newTxn }, ...prev]);
                  setNewTxn({ description: '', amount: 0, category: 'General', type: 'expense' });
                  setShowTxnForm(false);
                }}
              >Save</button>
              <button className="btn-secondary" onClick={() => setShowTxnForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4">
        {[...transactions, ...recentTransactions].map((transaction) => (
          <div key={transaction.id} className="card p-4">
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
              <span className={`text-lg font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
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
