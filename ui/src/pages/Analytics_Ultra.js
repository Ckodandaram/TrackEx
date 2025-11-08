import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, ComposedChart, ScatterChart,
  Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap,
  Sankey, Sink, Source, Link, Node
} from 'recharts';
import { analyticsService, expenseService } from '../services/api';
import '../styles/Analytics.css';

function AnalyticsAdvanced() {
  // State
  const [analytics, setAnalytics] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View controls
  const [activeView, setActiveView] = useState('overview'); // overview, patterns, trends, comparison, heatmap
  const [chartType, setChartType] = useState('pie');
  const [sortBy, setSortBy] = useState('value');
  const [timeRange, setTimeRange] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [analyticsRes, categoryRes, monthlyRes, expensesRes] = await Promise.all([
        analyticsService.getAnalytics(),
        analyticsService.getByCategory(),
        analyticsService.getMonthly(),
        expenseService.getAll(),
      ]);

      setAnalytics(analyticsRes.data);
      setCategoryData(categoryRes.data || []);
      setMonthlyData(monthlyRes.data || []);
      setAllExpenses(expensesRes.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============ TIME RANGE FILTERING ============

  const getAvailableTimeRanges = () => {
    if (!monthlyData || monthlyData.length === 0) return [];
    
    const ranges = [];
    const length = monthlyData.length;
    
    // Determine available filters based on data length
    if (length >= 1) ranges.push({ value: 'all', label: 'All Time' });
    if (length >= 12) ranges.push({ value: 'yearly', label: 'Last Year' });
    if (length >= 6) ranges.push({ value: 'half-year', label: 'Last 6 Months' });
    if (length >= 3) ranges.push({ value: 'quarterly', label: 'Last 3 Months' });
    if (length >= 1) ranges.push({ value: 'monthly', label: 'Last Month' });
    
    return ranges;
  };

  const getDateRangeFilter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch(timeRange) {
      case 'monthly':
        // Last 30 days
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return last30Days;
      case 'quarterly':
        // Last 90 days
        const last90Days = new Date(today);
        last90Days.setDate(last90Days.getDate() - 90);
        return last90Days;
      case 'half-year':
        // Last 180 days
        const last180Days = new Date(today);
        last180Days.setDate(last180Days.getDate() - 180);
        return last180Days;
      case 'yearly':
        // Last 365 days
        const last365Days = new Date(today);
        last365Days.setDate(last365Days.getDate() - 365);
        return last365Days;
      case 'all':
      default:
        return new Date(0); // All time
    }
  };

  const getFilteredExpenses = () => {
    if (!allExpenses || allExpenses.length === 0) return [];
    const cutoffDate = getDateRangeFilter();
    return allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= cutoffDate;
    });
  };

  const buildFilteredMonthlyData = () => {
    const filtered = getFilteredExpenses();
    const monthlyMap = {};
    
    filtered.forEach(expense => {
      const date = new Date(expense.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[month]) {
        monthlyMap[month] = 0;
      }
      monthlyMap[month] += expense.amount;
    });
    
    return Object.entries(monthlyMap)
      .map(([month, total]) => ({
        month,
        total: parseFloat(total.toFixed(2))
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const buildFilteredCategoryData = () => {
    const filtered = getFilteredExpenses();
    const categoryMap = {};
    
    filtered.forEach(expense => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = 0;
      }
      categoryMap[expense.category] += expense.amount;
    });
    
    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
      }))
      .sort((a, b) => b.value - a.value);
  };

  const filterDataByTimeRange = (data) => {
    if (!data || data.length === 0) return data;
    
    switch(timeRange) {
      case 'monthly':
        return data.slice(-1);
      case 'quarterly':
        return data.slice(-3);
      case 'half-year':
        return data.slice(-6);
      case 'yearly':
        return data.slice(-12);
      case 'all':
      default:
        return data;
    }
  };

  const getFilteredMonthlyData = () => {
    return buildFilteredMonthlyData();
  };

  const getFilteredCategoryData = () => {
    return buildFilteredCategoryData();
  };

  // ============ CALCULATIONS ============

  const getSpendingPatterns = () => {
    const filtered = getFilteredMonthlyData();
    if (!filtered || filtered.length === 0) return [];
    
    return filtered.map((item, idx) => {
      const prevMonth = idx > 0 ? filtered[idx - 1].total : item.total;
      const change = prevMonth !== 0 ? ((item.total - prevMonth) / prevMonth * 100).toFixed(1) : 0;
      return {
        month: item.month,
        total: item.total,
        change: parseFloat(change),
        trend: change > 0 ? 'up' : 'down'
      };
    });
  };

  const getDailyAverages = () => {
    if (!monthlyData || !analytics) return [];
    
    return monthlyData.map(item => ({
      month: item.month,
      daily: (item.total / 30).toFixed(2), // Approximate days
      average: analytics.averageExpense
    }));
  };

  const getCategoryTrends = () => {
    const cats = getFilteredCategoryData();
    if (!cats || cats.length === 0) return [];

    const total = cats.reduce((a, b) => a + b.value, 0) || 1;
    return cats.map((cat, idx) => ({
      name: cat.name,
      value: cat.value,
      index: idx + 1,
      percentage: ((cat.value / total) * 100).toFixed(1)
    }));
  };

  const getRadarData = () => {
    const cats = getFilteredCategoryData();
    if (!cats || cats.length === 0) return [];

    const maxValue = Math.max(...cats.map(c => c.value)) || 1;
    return cats.map(cat => ({
      name: cat.name,
      value: ((cat.value / maxValue) * 100).toFixed(0),
      fullValue: cat.value
    }));
  };

  const getSpendingStats = () => {
    const filtered = getFilteredMonthlyData();
    if (!filtered || filtered.length === 0) return null;
    
    const values = filtered.map(m => m.total);
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    
    const variance = values.reduce((sum, val) => sum + Math.pow(val - (values.reduce((a, b) => a + b) / values.length), 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      avg: (values.reduce((a, b) => a + b) / values.length).toFixed(2),
      median: median.toFixed(2),
      stdDev: stdDev.toFixed(2),
      range: (Math.max(...values) - Math.min(...values)).toFixed(2)
    };
  };

  const getSpendingDistribution = () => {
    const filtered = getFilteredMonthlyData();
    if (!filtered) return { low: 0, medium: 0, high: 0, veryHigh: 0 };
    
    const avg = filtered.reduce((a, b) => a + b.total, 0) / filtered.length;
    const stdDev = Math.sqrt(filtered.reduce((sum, item) => sum + Math.pow(item.total - avg, 2), 0) / filtered.length);
    
    const distribution = { low: 0, medium: 0, high: 0, veryHigh: 0 };
    
    filtered.forEach(item => {
      if (item.total < avg - stdDev) distribution.low++;
      else if (item.total < avg) distribution.medium++;
      else if (item.total < avg + stdDev) distribution.high++;
      else distribution.veryHigh++;
    });
    
    return distribution;
  };

  const getCategoryPerformance = () => {
    const cats = getFilteredCategoryData();
    if (!cats || cats.length === 0) return [];

    const total = cats.reduce((sum, cat) => sum + cat.value, 0) || 1;
    return cats.map((cat, idx) => ({
      name: cat.name,
      value: cat.value,
      percentage: (cat.value / total * 100).toFixed(1),
      efficiency: ((cat.value / analytics?.averageExpense) || 0).toFixed(2)
    }));
  };

  const getMonthlyComparison = () => {
    const filtered = getFilteredMonthlyData();
    if (!filtered || filtered.length < 2) return [];
    
    return filtered.map((item, idx) => ({
      month: item.month,
      current: item.total,
      average: filtered.reduce((a, b) => a + b.total, 0) / filtered.length,
      variance: (item.total - (filtered.reduce((a, b) => a + b.total, 0) / filtered.length)).toFixed(2)
    }));
  };

  const getInsights = () => {
    if (!analytics) return {};

    const cats = getFilteredCategoryData();
    const filteredMonths = getFilteredMonthlyData();
    const totalSpendingInRange = filteredMonths && filteredMonths.length ? filteredMonths.reduce((s, m) => s + (m.total || 0), 0) : analytics.totalSpending;
    const topCategory = cats && cats.length > 0 ? cats[0] : null;
    const trends = getSpendingPatterns();
    const lastTrend = trends.length > 0 ? trends[trends.length - 1] : null;
    
    const observations = [];
    
    if (topCategory) {
      const percent = (topCategory.value / (totalSpendingInRange || 1) * 100).toFixed(1);
      observations.push(`${topCategory.name} dominates spending at ${percent}% of selected range`);
    }
    
    if (lastTrend && lastTrend.change > 0) {
      observations.push(`📈 Spending trending UP by ${lastTrend.change}% month-over-month`);
    } else if (lastTrend && lastTrend.change < 0) {
      observations.push(`📉 Spending trending DOWN by ${Math.abs(lastTrend.change)}% month-over-month`);
    }
    
    if (analytics.averageExpense > 1000) {
      observations.push(`⚠️ High average expense per transaction: ₹${analytics.averageExpense.toFixed(2)}`);
    }
    
    return observations;
  };

  const getFilteredSummaryStats = () => {
    const filtered = getFilteredMonthlyData();
    if (!filtered || filtered.length === 0) {
      return {
        totalSpending: 0,
        expenseCount: 0,
        averageExpense: 0,
        categoryCount: 0,
        monthCount: 0
      };
    }

    const totalSpending = filtered.reduce((sum, m) => sum + (m.total || 0), 0);
    const monthCount = filtered.length;
    const cats = getFilteredCategoryData();
    
    return {
      totalSpending,
      expenseCount: monthCount, // Number of months in selected range
      averageExpense: monthCount > 0 ? (totalSpending / monthCount).toFixed(2) : 0,
      categoryCount: cats ? cats.length : 0,
      monthCount
    };
  };

  const getSortedCategoryData = () => {
    const cats = getFilteredCategoryData();
    if (!cats) return [];
    const sorted = [...cats];
    if (sortBy === 'value') {
      sorted.sort((a, b) => b.value - a.value);
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  };

  // ============ RENDERING FUNCTIONS ============

  const renderCategoryChart = () => {
    const data = getSortedCategoryData();
    if (!data || data.length === 0) {
      return <div className="empty-state"><span style={{ fontSize: '40px' }}>📭</span><p>No data</p></div>;
    }

    switch(chartType) {
      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={340}>
            <Treemap data={data} dataKey="value" stroke="#fff" fill="#2563eb">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Treemap>
          </ResponsiveContainer>
        );
      
      case 'radar':
        const radarData = getRadarData();
        return (
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Spending %" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px' }}
                cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        const scatterData = data.map((item, idx) => ({
          name: item.name,
          x: idx,
          y: item.value,
          z: item.value * 2
        }));
        return (
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" dataKey="x" name="Index" />
              <YAxis type="number" dataKey="y" name="Amount" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px' }}
              />
              <Scatter name="Categories" data={scatterData} fill="#2563eb" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#666" style={{ fontSize: '12px' }} />
              <YAxis dataKey="name" type="category" stroke="#666" style={{ fontSize: '11px' }} width={80} />
              <Tooltip 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px' }}
                cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
              />
              <Bar dataKey="value" fill="#2563eb" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px' }}
                cursor={{ stroke: 'rgba(37, 99, 235, 0.3)' }}
              />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px' }}
                cursor={{ stroke: 'rgba(37, 99, 235, 0.3)' }}
              />
              <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        );

      default: // pie
        return (
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px' }}
                cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderView = () => {
    switch(activeView) {
      case 'patterns':
        const patterns = getSpendingPatterns();
        return (
          <div className="analysis-view">
            <h3>Spending Patterns & Trends</h3>
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={patterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" stroke="#2563eb" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip 
                  formatter={(value) => `${typeof value === 'number' ? value.toFixed(2) : value}`}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px' }}
                  cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="total" fill="#2563eb" name="Total Spending" radius={[8, 8, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="change" stroke="#10b981" name="Month-over-Month %" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      case 'heatmap':
        const stats = getSpendingStats();
        const distribution = getSpendingDistribution();
        return (
          <div className="analysis-view">
            <h3>Statistical Analysis</h3>
            <div className="stats-matrix">
              <div className="matrix-card">
                <div className="matrix-label">Maximum</div>
                <div className="matrix-value">₹{stats?.max.toFixed(2)}</div>
              </div>
              <div className="matrix-card">
                <div className="matrix-label">Minimum</div>
                <div className="matrix-value">₹{stats?.min.toFixed(2)}</div>
              </div>
              <div className="matrix-card">
                <div className="matrix-label">Mean Average</div>
                <div className="matrix-value">₹{stats?.avg}</div>
              </div>
              <div className="matrix-card">
                <div className="matrix-label">Median</div>
                <div className="matrix-value">₹{stats?.median}</div>
              </div>
              <div className="matrix-card">
                <div className="matrix-label">Std Deviation</div>
                <div className="matrix-value">₹{stats?.stdDev}</div>
              </div>
              <div className="matrix-card">
                <div className="matrix-label">Range</div>
                <div className="matrix-value">₹{stats?.range}</div>
              </div>
            </div>

            <h4 style={{ marginTop: '32px' }}>Distribution Analysis</h4>
            <div className="distribution-grid">
              <div className="dist-card">
                <div className="dist-label">Very Low</div>
                <div className="dist-count">{distribution.low} months</div>
              </div>
              <div className="dist-card">
                <div className="dist-label">Low</div>
                <div className="dist-count">{distribution.medium} months</div>
              </div>
              <div className="dist-card">
                <div className="dist-label">High</div>
                <div className="dist-count">{distribution.high} months</div>
              </div>
              <div className="dist-card">
                <div className="dist-label">Very High</div>
                <div className="dist-count">{distribution.veryHigh} months</div>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        const comparison = getMonthlyComparison();
        return (
          <div className="analysis-view">
            <h3>Month vs Average Analysis</h3>
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={comparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value) => `₹${parseFloat(value).toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px' }}
                  cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="current" fill="#2563eb" name="Current" radius={[8, 8, 0, 0]} />
                <Line type="monotone" dataKey="average" stroke="#10b981" name="Average" strokeWidth={2} strokeDasharray="5 5" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      default: // overview
        return (
          <div className="analysis-view">
            <h3>Category Analysis</h3>
            <div className="chart-controls">
              <div className="control-group">
                <label>Chart Type</label>
                <div className="button-group">
                  {['pie', 'bar', 'line', 'area', 'radar', 'scatter', 'treemap'].map(type => (
                    <button
                      key={type}
                      className={`btn btn-sm ${chartType === type ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setChartType(type)}
                      title={`${type.charAt(0).toUpperCase() + type.slice(1)} Chart`}
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
            <div className="chart-container" style={{ marginTop: '24px' }}>
              {renderCategoryChart()}
            </div>
          </div>
        );
    }
  };

  // ============ COLORS & CONSTANTS ============
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#a4de6c', '#d084d0'];

  // ============ RENDER ============

  if (loading) {
    return (
      <div className="container analytics">
        <div className="skeleton" style={{ height: '100px', marginBottom: '24px' }}></div>
        <div className="skeleton" style={{ height: '400px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container analytics">
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button className="btn btn-primary btn-sm" onClick={fetchAllAnalytics}>Retry</button>
        </div>
      </div>
    );
  }

  const insights = getInsights();

  return (
    <div className="container analytics">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h2>Advanced Analytics</h2>
          <p className="subtitle">Comprehensive spending analysis with multiple perspectives</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchAllAnalytics}>🔄 Refresh</button>
      </div>

      {/* Summary Stats */}
      {analytics && (
        <div className="stats-grid">
          {(() => {
            const filtered = getFilteredSummaryStats();
            return (
              <>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-label">Total</div>
                    <div className="stat-value">₹{filtered.totalSpending?.toFixed(2)}</div>
                    <div className="stat-subtext">{filtered.monthCount} months</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-label">Average</div>
                    <div className="stat-value">₹{filtered.averageExpense}</div>
                    <div className="stat-subtext">per month</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏷️</div>
                  <div className="stat-content">
                    <div className="stat-label">Categories</div>
                    <div className="stat-value">{filtered.categoryCount}</div>
                    <div className="stat-subtext">active</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <div className="stat-label">Months</div>
                    <div className="stat-value">{filtered.monthCount}</div>
                    <div className="stat-subtext">in range</div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="card mt-4">
          <h3 className="card-title">🔍 Key Insights</h3>
          <div className="insights-list">
            {insights.map((insight, idx) => (
              <div key={idx} className="insight-item">
                <span className="insight-bullet">→</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Selector */}
      <div className="card mt-4">
        <div className="view-tabs">
          {[
            { id: 'overview', label: '📊 Overview', icon: 'overview' },
            { id: 'patterns', label: '📈 Patterns', icon: 'trends' },
            { id: 'heatmap', label: '🔥 Statistics', icon: 'stats' },
            { id: 'comparison', label: '⚖️ Comparison', icon: 'compare' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`view-tab ${activeView === tab.id ? 'active' : ''}`}
              onClick={() => setActiveView(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="card mt-4">
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #333)' }}>
            ⏱️ Time Range
          </h4>
          <div className="button-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {getAvailableTimeRanges().map(range => (
              <button
                key={range.value}
                className={`btn btn-sm ${timeRange === range.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTimeRange(range.value)}
                style={{ flex: 'none' }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis View */}
      <div className="card mt-4" style={{ minHeight: '450px' }}>
        {renderView()}
      </div>

      {/* Category Details Table */}
      {categoryData && categoryData.length > 0 && (
        <div className="card mt-4">
          <h3 className="card-title">Category Performance Metrics</h3>
          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                  <th>Efficiency</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {getCategoryPerformance().map((cat, idx) => (
                  <tr key={idx}>
                    <td><span className="category-badge" style={{ borderLeftColor: COLORS[idx % COLORS.length] }}>{cat.name}</span></td>
                    <td>₹{cat.value.toFixed(2)}</td>
                    <td><div className="progress-bar"><div className="progress-fill" style={{ width: `${cat.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}></div></div>{cat.percentage}%</td>
                    <td>{cat.efficiency}x</td>
                    <td>📊</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!analytics || analytics.expenseCount === 0) && !loading && (
        <div className="empty-state card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>📊</div>
          <h3>No Expenses</h3>
          <p>Start tracking expenses to see advanced analytics</p>
        </div>
      )}
    </div>
  );
}

export default AnalyticsAdvanced;
