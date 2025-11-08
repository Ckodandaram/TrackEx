import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  ComposedChart
} from 'recharts';
import { analyticsService } from '../services/api';
import '../styles/Analytics.css';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [chartType, setChartType] = useState('pie'); // pie, bar, line, area
  const [sortBy, setSortBy] = useState('value'); // value, name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
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

  // Calculate insights
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

  // Sort category data
  const getSortedCategoryData = () => {
    if (!categoryData) return [];
    const sorted = [...categoryData];
    if (sortBy === 'value') {
      sorted.sort((a, b) => b.value - a.value);
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  };

  // Get top 3 categories
  const getTopCategories = () => {
    return getSortedCategoryData().slice(0, 3);
  };

  // Get spending statistics
  const getSpendingStats = () => {
    if (!monthlyData || monthlyData.length === 0) return null;
    const values = monthlyData.map(m => m.total);
    return {
      highest: Math.max(...values),
      lowest: Math.min(...values),
      average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
    };
  };

  const insights = getInsights();
  const spendingStats = getSpendingStats();
  const sortedCategoryData = getSortedCategoryData();
  const topCategories = getTopCategories();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#a4de6c', '#d084d0'];

  // Render category chart based on type
  const renderCategoryChart = () => {
    if (!sortedCategoryData || sortedCategoryData.length === 0) {
      return <div className="empty-state"><span style={{ fontSize: '40px' }}>📭</span><p>No data</p></div>;
    }

    const chartHeight = 340;

    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={sortedCategoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#666" style={{ fontSize: '12px' }} />
              <YAxis dataKey="name" type="category" stroke="#666" style={{ fontSize: '11px' }} width={80} />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#2563eb" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={sortedCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis stroke="#666" />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 6 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={sortedCategoryData}>
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
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={sortedCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sortedCategoryData.map((entry, index) => (
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
        <div className="analytics-header"><h2>Analytics Dashboard</h2></div>
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
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h2>Analytics Dashboard</h2>
          <p className="subtitle">Track and analyze your spending patterns</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchAllAnalytics}>
          🔄 Refresh
        </button>
      </div>

      {/* Summary Stats Cards */}
      {analytics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Total Spending</div>
              <div className="stat-value">₹{analytics.totalSpending?.toFixed(2) || '0.00'}</div>
              <div className="stat-subtext">{analytics.expenseCount || 0} transactions</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Average per Transaction</div>
              <div className="stat-value">₹{analytics.averageExpense?.toFixed(2) || '0.00'}</div>
              <div className="stat-subtext">Across all categories</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <div className="stat-label">Active Categories</div>
              <div className="stat-value">{Object.keys(analytics.categoryBreakdown || {}).length}</div>
              <div className="stat-subtext">Tracked categories</div>
            </div>
          </div>

          {spendingStats && (
            <div className="stat-card">
              <div className="stat-icon">{insights?.trend === 'up' ? '📈' : '📉'}</div>
              <div className="stat-content">
                <div className="stat-label">Monthly Trend</div>
                <div className="stat-value">{insights?.trend.toUpperCase()}</div>
                <div className="stat-subtext">Avg: ₹{spendingStats.average}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Categories Cards */}
      {topCategories.length > 0 && (
        <div className="card mt-4">
          <h3 className="card-title">Top 3 Categories</h3>
          <div className="top-categories-grid">
            {topCategories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <div className="category-rank">#{idx + 1}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-amount">₹{cat.value.toFixed(2)}</div>
                <div 
                  className="category-bar"
                  style={{
                    width: `${(cat.value / topCategories[0].value) * 100}%`,
                    backgroundColor: COLORS[idx % COLORS.length]
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="card mt-4">
        <div className="chart-controls">
          <div className="control-group">
            <label>Category Chart Type</label>
            <div className="button-group">
              {['pie', 'bar', 'line', 'area'].map(type => (
                <button
                  key={type}
                  className={`btn btn-sm ${chartType === type ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setChartType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Sort By</label>
            <div className="button-group">
              {['value', 'name'].map(sort => (
                <button
                  key={sort}
                  className={`btn btn-sm ${sortBy === sort ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSortBy(sort)}
                >
                  {sort === 'value' ? 'Amount' : 'Name'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="charts-grid">
          {/* Category Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Expenses by Category</h3>
            {renderCategoryChart()}
          </div>

          {/* Monthly Trend */}
          <div className="chart-container">
            <h3 className="chart-title">Monthly Spending Trend</h3>
            {monthlyData && monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={340}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#666"
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={(value) => `₹${value.toFixed(2)}`}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} name="Spending" />
                  <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Trend" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><span style={{ fontSize: '40px' }}>📭</span><p>No monthly data</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Category Table */}
      {analytics && analytics.categoryBreakdown && Object.keys(analytics.categoryBreakdown).length > 0 && (
        <div className="card mt-4">
          <h3 className="card-title">Category Breakdown - Detailed View</h3>
          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>Total Amount</th>
                  <th>Per Transaction</th>
                  <th>Percentage</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategoryData.map((category, index) => {
                  const data = analytics.categoryBreakdown[category.name];
                  const percentage = ((data.total / analytics.totalSpending) * 100).toFixed(1);
                  const perTransaction = (data.total / data.count).toFixed(2);

                  return (
                    <tr key={index}>
                      <td>
                        <span 
                          className="category-badge" 
                          style={{ borderLeftColor: COLORS[index % COLORS.length] }}
                        >
                          {category.name}
                        </span>
                      </td>
                      <td className="text-center">{data.count}</td>
                      <td className="amount">₹{data.total.toFixed(2)}</td>
                      <td className="amount">₹{perTransaction}</td>
                      <td className="text-center font-weight-bold">{percentage}%</td>
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spending Summary */}
      {spendingStats && monthlyData.length > 0 && (
        <div className="card mt-4">
          <h3 className="card-title">Spending Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Highest Month</div>
              <div className="summary-value">₹{spendingStats.highest.toFixed(2)}</div>
              <div className="summary-description">Peak spending</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Lowest Month</div>
              <div className="summary-value">₹{spendingStats.lowest.toFixed(2)}</div>
              <div className="summary-description">Lowest spending</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Monthly Average</div>
              <div className="summary-value">₹{spendingStats.average}</div>
              <div className="summary-description">Average per month</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Variation</div>
              <div className="summary-value">
                {(((spendingStats.highest - spendingStats.lowest) / spendingStats.average) * 100).toFixed(0)}%
              </div>
              <div className="summary-description">Month-to-month variance</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!analytics || analytics.expenseCount === 0) && !loading && (
        <div className="empty-state card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>📊</div>
          <h3>No Expenses Yet</h3>
          <p>Start tracking your expenses to see analytics and insights</p>
        </div>
      )}
    </div>
  );
}

export default Analytics;
