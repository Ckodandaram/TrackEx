import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgetLimit] = useState(58000);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await expenseService.getAll();
      setExpenses(response.data.slice(0, 10)); // Recent 10
      const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍔',
      'Transport': '🚕',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Bills': '💳',
      'Health': '💊',
      'Other': '📌'
    };
    return icons[category] || '💰';
  };

  const budgetLeft = budgetLimit - totalSpent;
  const budgetPercentage = (totalSpent / budgetLimit) * 100;

  if (loading) {
    return (
      <div className="container dashboard">
        <div className="skeleton" style={{ height: '100px', marginBottom: '16px' }}></div>
        <div className="skeleton" style={{ height: '200px' }}></div>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      {/* Header Greeting */}
      <div className="dashboard-header">
        <h1>Hi, there! 👋</h1>
        <p className="text-muted">Track and manage your spending wisely</p>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-2">
        <div className="stat-card">
          <div className="stat-label">Total Spent This Month</div>
          <div className="stat-value">₹{totalSpent.toFixed(0)}</div>
          <div className="stat-change">↗️ +12% from last month</div>
        </div>

        <div className="stat-card success">
          <div className="stat-label">Budget Remaining</div>
          <div className="stat-value">₹{Math.max(0, budgetLeft).toFixed(0)}</div>
          <div className="stat-change">Out of ₹{budgetLimit.toLocaleString()}</div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="card mt-4">
        <div className="flex-between">
          <h3>Budget Status</h3>
          <span className="text-muted">{Math.round(budgetPercentage)}% Used</span>
        </div>
        <div className="progress-bar" style={{ marginTop: '12px' }}>
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min(budgetPercentage, 100)}%`,
              backgroundColor: budgetPercentage > 90 ? '#EF4444' : budgetPercentage > 75 ? '#F59E0B' : '#10B981'
            }}
          ></div>
        </div>
        <small style={{ marginTop: '8px', display: 'block' }}>
          {budgetPercentage > 100 
            ? `❌ Over budget by ₹${Math.round(budgetLeft * -1)}`
            : `✓ Safe spending range`
          }
        </small>
      </div>

      {/* Recent Transactions */}
      <div className="card mt-4">
        <div className="flex-between mb-3">
          <h3>Recent Transactions</h3>
          <a href="/add-expense" className="text-primary" style={{ fontSize: '12px', fontWeight: '600' }}>
            + Add New
          </a>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💸</div>
            <div className="empty-state-title">No Expenses Yet</div>
            <div className="empty-state-description">
              Start tracking your spending by adding your first expense!
            </div>
            <a href="/add-expense" className="btn btn-primary mt-3">
              Add Expense
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {expenses.map((expense) => (
              <div key={expense._id} className="transaction-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div className="transaction-icon">
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-title">{expense.category}</div>
                    <div className="transaction-time">
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="transaction-amount">−₹{expense.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-3 mt-4">
        <div className="card">
          <small className="text-muted">Average Daily</small>
          <h3 style={{ marginTop: '4px' }}>₹{Math.round(totalSpent / 30)}</h3>
        </div>
        <div className="card">
          <small className="text-muted">Total Expenses</small>
          <h3 style={{ marginTop: '4px' }}>{expenses.length}</h3>
        </div>
        <div className="card">
          <small className="text-muted">Days Left</small>
          <h3 style={{ marginTop: '4px' }}>8</h3>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
