import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { analyticsService } from '../services/api';
import '../styles/Analytics.css';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [chartType, setChartType] = useState('pie'); // pie, bar, line, area
  const [timeRange, setTimeRange] = useState('all'); // all, 3months, 6months, 1year
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all analytics data in parallel
      const [analyticsRes, categoryRes, monthlyRes] = await Promise.all([
        analyticsService.getAnalytics(),
        analyticsService.getByCategory(),
        analyticsService.getMonthly(),
      ]);

      setAnalytics(analyticsRes.data);
      setCategoryData(categoryRes.data || []);
      setMonthlyData(monthlyRes.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate additional insights
  const getInsights = () => {
    if (!analytics || !monthlyData || monthlyData.length === 0) return null;

    const monthlyValues = monthlyData.map(m => m.total);
    const maxMonth = Math.max(...monthlyValues);
    const minMonth = Math.min(...monthlyValues);
    const avgMonth = monthlyValues.reduce((a, b) => a + b, 0) / monthlyValues.length;
    const trend = monthlyValues.length > 1 
      ? monthlyValues[monthlyValues.length - 1] > monthlyValues[0] ? 'up' : 'down'
      : 'stable';

    return { maxMonth, minMonth, avgMonth, trend };
  };

  // Get top categories
  const getTopCategories = () => {
    if (!categoryData || categoryData.length === 0) return [];
    return categoryData.slice(0, 5);
  };

  // Get spending insights
  const getSpendingByDay = () => {
    if (!analytics || analytics.expenseCount === 0) return 0;
    return (analytics.totalSpending / analytics.expenseCount).toFixed(2);
  };

  const insights = getInsights();
  const topCategories = getTopCategories();
  const avgPerExpense = getSpendingByDay();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#a4de6c', '#d084d0'];
  const GRADIENT_COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  // Render different chart types
  const renderCategoryChart = () => {
    if (!categoryData || categoryData.length === 0) {
      return <div className="empty-state"><p>No category data</p></div>;
    }

    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis stroke="#666" />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis stroke="#666" />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={categoryData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis stroke="#666" />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  if (loading) {
    return (
      <div className="container analytics">
        <div className="skeleton" style={{ height: '300px', marginBottom: '24px' }}></div>
        <div className="skeleton" style={{ height: '400px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container analytics">
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button className="btn btn-primary btn-sm" onClick={fetchAllAnalytics} style={{ marginTop: '12px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <button className="btn btn-primary btn-sm" onClick={fetchAllAnalytics}>
          🔄 Refresh
        </button>
      </div>

      {/* Summary Stats */}
      {analytics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Spending</div>
            <div className="stat-value">₹{analytics.totalSpending?.toFixed(2) || '0.00'}</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">{analytics.expenseCount || 0}</div>
            <div className="stat-icon">📝</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Expense</div>
            <div className="stat-value">₹{analytics.averageExpense?.toFixed(2) || '0.00'}</div>
            <div className="stat-icon">📊</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Categories</div>
            <div className="stat-value">{Object.keys(analytics.categoryBreakdown || {}).length}</div>
            <div className="stat-icon">🏷️</div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Category Breakdown */}
        <div className="chart-container card">
          <h3 className="chart-title">Expenses by Category</h3>
          {categoryData && categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <p>No category data available</p>
              <span style={{ fontSize: '40px' }}>📭</span>
            </div>
          )}
        </div>

        {/* Monthly Spending Trend */}
        <div className="chart-container card">
          <h3 className="chart-title">Monthly Spending Trend</h3>
          {monthlyData && monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <Legend />
                <Bar 
                  dataKey="total" 
                  fill="#2563eb" 
                  name="Total Spending"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <p>No monthly data available</p>
              <span style={{ fontSize: '40px' }}>📭</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      {analytics && analytics.categoryBreakdown && Object.keys(analytics.categoryBreakdown).length > 0 && (
        <div className="card mt-4">
          <h3 className="chart-title">Category Breakdown</h3>
          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>Total Amount</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.categoryBreakdown).map(([category, data], index) => {
                  const percentage = ((data.total / analytics.totalSpending) * 100).toFixed(1);
                  return (
                    <tr key={index}>
                      <td>
                        <span className="category-badge" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                          {category}
                        </span>
                      </td>
                      <td>{data.count}</td>
                      <td className="amount">₹{data.total.toFixed(2)}</td>
                      <td>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                        <span className="percentage-text">{percentage}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {(!analytics || analytics.expenseCount === 0) && !loading && (
        <div className="empty-state card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>📊</div>
          <h3>No Expenses Yet</h3>
          <p>Start tracking your expenses to see analytics</p>
        </div>
      )}
    </div>
  );
}

export default Analytics;
