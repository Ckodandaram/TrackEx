import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseService } from '../services/api';
import '../styles/AddExpense.css';

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'];

  const fetchExpense = async () => {
    try {
      const response = await expenseService.getById(id);
      const expense = response.data;
      setFormData({
        category: expense.category,
        amount: expense.amount,
        description: expense.description || '',
        date: new Date(expense.date).toISOString().split('T')[0],
      });
      setLoading(false);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to load expense';
      setError(`❌ ${errorMsg}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount || formData.amount === '') {
      newErrors.amount = 'Amount is required';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (Number(formData.amount) > 1000000) {
      newErrors.amount = 'Amount cannot exceed ₹10,00,000';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }
    
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
    }

    setUpdating(true);
    setError('');
    setMessage('');

    try {
      await expenseService.update(id, formData);
      setMessage('✅ Expense updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update expense';
      setError(`❌ ${errorMsg}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="skeleton" style={{ height: '100px' }}></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Edit Expense</h2>
      
      {error && <div className="message error">{error}</div>}
      {message && <div className="message success">{message}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category <span className="required">*</span></label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'input-error' : ''}
            disabled={updating}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Amount <span className="required">*</span></label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            className={errors.amount ? 'input-error' : ''}
            disabled={updating}
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description"
            maxLength="200"
            className={errors.description ? 'input-error' : ''}
            disabled={updating}
          />
          <span className="char-count">{formData.description.length}/200</span>
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Date <span className="required">*</span></label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'input-error' : ''}
            disabled={updating}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={updating} className="btn btn-primary">
            {updating ? 'Updating...' : 'Update Expense'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn" disabled={updating}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditExpense;
