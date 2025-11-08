import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { storyService } from '../services/storyService';

const CATEGORIES = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Bills', 'Travel', 'Other'];
const PAYMENT_MODES = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Other'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    paymentMode: 'Cash',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    story: ''
  });

  useEffect(() => {
    fetchExpenses();
    fetchStories();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAll(filters);
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const data = await storyService.getAll();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense._id, formData);
      } else {
        await expenseService.create(formData);
      }
      setShowModal(false);
      setEditingExpense(null);
      resetForm();
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount,
      category: expense.category,
      paymentMode: expense.paymentMode,
      date: new Date(expense.date).toISOString().split('T')[0],
      notes: expense.notes || '',
      story: expense.story?._id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: 'Food',
      paymentMode: 'Cash',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      story: ''
    });
  };

  const handleNewExpense = () => {
    setEditingExpense(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Expenses</h2>
        <button className="btn-primary" onClick={handleNewExpense}>
          Add Expense
        </button>
      </div>

      <div className="filters">
        <div className="filters-grid">
          <div className="form-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="card">No expenses found</div>
        ) : (
          expenses.map((expense) => (
            <div key={expense._id} className="expense-item">
              <div className="expense-info">
                <h4>₹{expense.amount}</h4>
                <p><strong>{expense.category}</strong> - {expense.paymentMode}</p>
                <p>{new Date(expense.date).toLocaleDateString()}</p>
                {expense.notes && <p><em>{expense.notes}</em></p>}
                {expense.story && <p>Story: {expense.story.name}</p>}
              </div>
              <div className="expense-actions">
                <button className="btn-small btn-edit" onClick={() => handleEdit(expense)}>
                  Edit
                </button>
                <button className="btn-small btn-delete" onClick={() => handleDelete(expense._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  required
                >
                  {PAYMENT_MODES.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Story (Optional)</label>
                <select
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                >
                  <option value="">No Story</option>
                  {stories.map(story => (
                    <option key={story._id} value={story._id}>{story.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingExpense ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
