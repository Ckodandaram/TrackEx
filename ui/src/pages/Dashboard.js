import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await expenseService.getAll();
      setExpenses(response.data);
      const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Dashboard</h2>
      
      <div className="summary">
        <div className="card">
          <h3>Total Spent</h3>
          <p className="amount">₹{totalSpent.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="amount">{expenses.length}</p>
        </div>
      </div>

      <div className="expenses-list">
        <h3>Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses yet. Start by adding one!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.category}</td>
                  <td>₹{expense.amount.toFixed(2)}</td>
                  <td>{expense.description}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
