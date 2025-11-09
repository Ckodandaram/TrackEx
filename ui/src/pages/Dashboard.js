import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgetLimit] = useState(58000);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await expenseService.getAll();
      setAllExpenses(response.data);
      const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  // Filter, search & sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...allExpenses];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(exp =>
        exp.category.toLowerCase().includes(query) ||
        (exp.description && exp.description.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(exp => exp.category === filterCategory);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [allExpenses, searchQuery, filterCategory, sortBy]);

  // Paginate
  const totalPages = Math.ceil(filteredAndSortedExpenses.length / itemsPerPage);
  const paginatedExpenses = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedExpenses.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedExpenses, currentPage]);

  // Group expenses by date
  const groupedByDate = useMemo(() => {
    const grouped = {};
    paginatedExpenses.forEach(expense => {
      const dateKey = new Date(expense.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(expense);
    });
    return grouped;
  }, [paginatedExpenses]);

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

  const handleDeleteClick = (expenseId) => {
    setDeleteConfirm(expenseId);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await expenseService.delete(deleteConfirm);
      const updated = allExpenses.filter(e => e._id !== deleteConfirm);
      setAllExpenses(updated);
      const total = updated.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
      setDeleteConfirm(null);
      // Reset to page 1 if current page is now empty
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    } finally {
      setDeleting(false);
    }
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

      {/* All Transactions with Filters */}
      <div className="card mt-4">
        <div className="flex-between mb-3">
          <h3>All Transactions ({filteredAndSortedExpenses.length})</h3>
          <a href="/add-expense" className="text-primary" style={{ fontSize: '12px', fontWeight: '600' }}>
            + Add New
          </a>
        </div>

        {/* Search & Filter Controls */}
        {allExpenses.length > 0 && (
          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search by category or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                flex: '1',
                minWidth: '200px',
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Categories</option>
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚕 Transport</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💳 Bills</option>
              <option value="Health">💊 Health</option>
              <option value="Other">📌 Other</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        )}

        {allExpenses.length === 0 ? (
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
        ) : filteredAndSortedExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No Results</div>
            <div className="empty-state-description">
              No expenses match your search or filter criteria.
            </div>
          </div>
        ) : (
          <>
            {/* Grouped Transaction Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(groupedByDate).map(([dateKey, dayExpenses]) => (
                <div key={dateKey}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#999',
                    marginBottom: '8px',
                    paddingLeft: '0px'
                  }}>
                    {dateKey}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {dayExpenses.map((expense) => (
                      <div key={expense._id} className="transaction-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <div className="transaction-icon">
                            {getCategoryIcon(expense.category)}
                          </div>
                          <div className="transaction-details">
                            <div className="transaction-title">
                              {expense.category}
                              {expense.description && <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>({expense.description})</span>}
                            </div>
                            <div className="transaction-time">
                              {new Date(expense.date).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="transaction-amount">−₹{expense.amount.toFixed(2)}</div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => navigate(`/edit-expense/${expense._id}`)}
                              className="btn-icon"
                              title="Edit"
                              style={{ fontSize: '16px', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteClick(expense._id)}
                              className="btn-icon"
                              title="Delete"
                              style={{ fontSize: '16px', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: currentPage === page ? '#3498db' : '#f0f0f0',
                      color: currentPage === page ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Summary */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f9f9f9',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666',
              textAlign: 'center'
            }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedExpenses.length)} of {filteredAndSortedExpenses.length} transactions
            </div>
          </>
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
          <h3 style={{ marginTop: '4px' }}>{allExpenses.length}</h3>
        </div>
        <div className="card">
          <small className="text-muted">Days Left</small>
          <h3 style={{ marginTop: '4px' }}>8</h3>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ marginBottom: '12px' }}>Delete Expense?</h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Are you sure you want to delete this expense? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="btn"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="btn btn-danger"
                style={{ background: '#EF4444', color: 'white' }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;