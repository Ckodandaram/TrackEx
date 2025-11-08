import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashData, catData, monthData] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getByCategory(),
        analyticsService.getMonthly()
      ]);
      setDashboard(dashData);
      setCategoryData(catData.map(item => ({
        name: item._id,
        value: item.total,
        count: item.count
      })));
      setMonthlyData(monthData.map(item => ({
        month: getMonthName(item._id),
        total: item.total
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1];
  };

  if (loading) {
    return <div className="dashboard">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {dashboard && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Expenses</h3>
              <div className="value">₹{dashboard.totalExpenses.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <h3>This Month</h3>
              <div className="value">₹{dashboard.thisMonthTotal.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <h3>Last Month</h3>
              <div className="value">₹{dashboard.lastMonthTotal.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <h3>Total Transactions</h3>
              <div className="value">{dashboard.expenseCount}</div>
            </div>
          </div>

          {dashboard.insight && (
            <div className="insight-card">
              <h3>💡 Insight</h3>
              <p>{dashboard.insight}</p>
            </div>
          )}
        </>
      )}

      {categoryData.length > 0 && (
        <div className="card">
          <h3>Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ₹${entry.value.toFixed(0)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {monthlyData.length > 0 && (
        <div className="card">
          <h3>Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3498db" name="Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
