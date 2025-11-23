import React, { useState, useEffect } from 'react';
import { expenseService, analyticsService, insightService } from '../services/api';
import '../styles/Stories.css';

function Stories() {
  const [insights, setInsights] = useState([]);
  const [dismissedInsights, setDismissedInsights] = useState(new Set());
  const [savedInsights, setSavedInsights] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch insights data
      const [expensesRes, analyticsRes] = await Promise.all([
        expenseService.getAll(),
        analyticsService.getAnalytics()
      ]);
      
      setExpenses(expensesRes.data || []);
      setAnalytics(analyticsRes.data);
      
      const generatedInsights = generateInsights(expensesRes.data || [], analyticsRes.data);
      setInsights(generatedInsights);
      
      // Load user preferences
      try {
        const preferencesRes = await insightService.getPreferences();
        setPreferences(preferencesRes.data);
        setDismissedInsights(new Set(preferencesRes.data.dismissedInsights || []));
        setSavedInsights(new Set(preferencesRes.data.savedInsights || []));
      } catch (error) {
        console.warn('Could not load preferences:', error);
        // Continue without preferences if error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (allExpenses, analyticsData) => {
    const insights = [];

    if (!allExpenses || allExpenses.length === 0) {
      return insights;
    }

    // 1. Highest Spending Category
    const categoryTotals = {};
    allExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      insights.push({
        id: 'top-category',
        type: 'spending',
        icon: '🏆',
        title: 'Top Spending Category',
        description: `Your highest spending is on ${topCategory[0]} with ₹${topCategory[1].toFixed(0)}.`,
        amount: topCategory[1],
        severity: 'info'
      });
    }

    // 2. Recent Spending Trend
    if (allExpenses.length >= 2) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const last30 = allExpenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
      const prev30End = new Date(thirtyDaysAgo);
      const prev30Start = new Date(prev30End);
      prev30Start.setDate(prev30Start.getDate() - 30);
      const prev30 = allExpenses.filter(e => {
        const d = new Date(e.date);
        return d >= prev30Start && d < prev30End;
      });

      const last30Total = last30.reduce((sum, e) => sum + e.amount, 0);
      const prev30Total = prev30.reduce((sum, e) => sum + e.amount, 0);

      if (prev30Total > 0) {
        const percentChange = ((last30Total - prev30Total) / prev30Total * 100).toFixed(1);
        const trend = percentChange > 0 ? 'up' : 'down';
        const severity = percentChange > 20 ? 'warning' : 'info';
        
        insights.push({
          id: 'spending-trend',
          type: 'trend',
          icon: trend === 'up' ? '📈' : '📉',
          title: `Spending is ${trend === 'up' ? 'increasing' : 'decreasing'}`,
          description: `Your spending ${trend === 'up' ? 'increased' : 'decreased'} by ${Math.abs(percentChange)}% compared to last month. Last 30 days: ₹${last30Total.toFixed(0)}, Previous 30 days: ₹${prev30Total.toFixed(0)}.`,
          amount: Math.abs(percentChange),
          severity
        });
      }
    }

    // 3. Daily Average Spending
    if (analyticsData) {
      const dailyAvg = analyticsData.averageExpense || 0;
      insights.push({
        id: 'daily-average',
        type: 'metric',
        icon: '💰',
        title: 'Daily Average Spending',
        description: `Your average daily spending is ₹${dailyAvg.toFixed(0)}.`,
        amount: dailyAvg,
        severity: dailyAvg > 1000 ? 'warning' : 'info'
      });
    }

    // 4. Budget Alert (if spending looks high)
    const totalSpent = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgPerExpense = totalSpent / allExpenses.length;
    if (avgPerExpense > 2000) {
      insights.push({
        id: 'high-spending',
        type: 'alert',
        icon: '⚠️',
        title: 'High Average Expense Alert',
        description: `Your average expense amount is ₹${avgPerExpense.toFixed(0)}, which is higher than typical. Consider reviewing your spending.`,
        amount: avgPerExpense,
        severity: 'warning'
      });
    }

    // 5. Most Expensive Transaction
    const maxExpense = allExpenses.reduce((max, e) => e.amount > max.amount ? e : max);
    if (maxExpense) {
      insights.push({
        id: 'max-expense',
        type: 'transaction',
        icon: '💸',
        title: 'Largest Transaction',
        description: `Your highest single expense was ₹${maxExpense.amount.toFixed(0)} for ${maxExpense.category}${maxExpense.description ? ` (${maxExpense.description})` : ''}.`,
        amount: maxExpense.amount,
        severity: 'info'
      });
    }

    // 6. Category Diversity
    const uniqueCategories = new Set(allExpenses.map(e => e.category)).size;
    insights.push({
      id: 'diversity',
      type: 'metric',
      icon: '🎯',
      title: 'Spending Diversity',
      description: `You spend across ${uniqueCategories} different categories, showing balanced spending distribution.`,
      amount: uniqueCategories,
      severity: 'info'
    });

    // 7. Most Expensive Day of Week
    const dayTotals = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    allExpenses.forEach(expense => {
      const day = days[new Date(expense.date).getDay()];
      dayTotals[day] = (dayTotals[day] || 0) + expense.amount;
    });
    const mostExpensiveDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];
    if (mostExpensiveDay) {
      insights.push({
        id: 'expensive-day',
        type: 'pattern',
        icon: '📅',
        title: `${mostExpensiveDay[0]} is Your Most Expensive Day`,
        description: `On average, ${mostExpensiveDay[0]}s have the highest spending at ₹${(mostExpensiveDay[1] / (allExpenses.filter(e => days[new Date(e.date).getDay()] === mostExpensiveDay[0]).length || 1)).toFixed(0)} per expense.`,
        amount: mostExpensiveDay[1],
        severity: 'info'
      });
    }

    // 8. Savings Opportunity
    const avgCategory = Object.entries(categoryTotals).map(([cat, total]) => ({
      category: cat,
      avg: total / allExpenses.filter(e => e.category === cat).length
    })).sort((a, b) => b.avg - a.avg)[0];
    
    if (avgCategory) {
      insights.push({
        id: 'savings-opportunity',
        type: 'opportunity',
        icon: '💡',
        title: 'Savings Opportunity',
        description: `${avgCategory.category} has high average expense per transaction (₹${avgCategory.avg.toFixed(0)}). Look for ways to reduce spending here.`,
        amount: avgCategory.avg,
        severity: 'info'
      });
    }

    return insights.sort((a, b) => {
      const severityOrder = { warning: 0, alert: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  };

  const dismissInsight = async (insightId) => {
    try {
      setSaving(true);
      await insightService.dismissInsight(insightId);
      setDismissedInsights(new Set([...dismissedInsights, insightId]));
    } catch (error) {
      console.error('Error dismissing insight:', error);
      alert('Failed to dismiss insight');
    } finally {
      setSaving(false);
    }
  };

  const saveInsight = async (insightId) => {
    try {
      setSaving(true);
      await insightService.saveInsight(insightId);
      setSavedInsights(new Set([...savedInsights, insightId]));
    } catch (error) {
      console.error('Error saving insight:', error);
      alert('Failed to save insight');
    } finally {
      setSaving(false);
    }
  };

  const undoSave = async (insightId) => {
    try {
      setSaving(true);
      await insightService.unsaveInsight(insightId);
      const newSaved = new Set(savedInsights);
      newSaved.delete(insightId);
      setSavedInsights(newSaved);
    } catch (error) {
      console.error('Error unsaving insight:', error);
      alert('Failed to unsave insight');
    } finally {
      setSaving(false);
    }
  };

  const restoreAllDismissed = async () => {
    try {
      setSaving(true);
      await insightService.restoreAll();
      setDismissedInsights(new Set());
    } catch (error) {
      console.error('Error restoring insights:', error);
      alert('Failed to restore insights');
    } finally {
      setSaving(false);
    }
  };

  const visibleInsights = insights.filter(i => !dismissedInsights.has(i.id));

  if (loading) {
    return (
      <div className="container stories">
        <div className="skeleton" style={{ height: '100px', marginBottom: '24px' }}></div>
        <div className="skeleton" style={{ height: '300px' }}></div>
      </div>
    );
  }

  return (
    <div className="container stories">
      <div className="stories-header">
        <h1>💡 Spending Insights</h1>
        <p className="text-muted">AI-powered insights about your spending patterns</p>
      </div>

      {visibleInsights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No Insights Yet</div>
          <div className="empty-state-description">
            Start adding expenses to get personalized spending insights!
          </div>
        </div>
      ) : (
        <div className="insights-grid">
          {visibleInsights.map(insight => (
            <div key={insight.id} className={`insight-card insight-${insight.severity}`}>
              <div className="insight-header">
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-info">
                  <h3 className="insight-title">{insight.title}</h3>
                  <p className="insight-type">{insight.type.toUpperCase()}</p>
                </div>
                <div className="insight-actions">
                  <button
                    onClick={() => saveInsight(insight.id)}
                    className={`btn-icon ${savedInsights.has(insight.id) ? 'saved' : ''}`}
                    title={savedInsights.has(insight.id) ? 'Unsave' : 'Save'}
                  >
                    {savedInsights.has(insight.id) ? '⭐' : '☆'}
                  </button>
                  <button
                    onClick={() => dismissInsight(insight.id)}
                    className="btn-icon dismiss"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <p className="insight-description">{insight.description}</p>

              <div className="insight-footer">
                <div className="insight-metric">
                  <span className="metric-label">Amount:</span>
                  <span className="metric-value">
                    {insight.type === 'metric' || insight.type === 'pattern' 
                      ? (typeof insight.amount === 'number' && insight.amount < 100 ? insight.amount.toFixed(1) : insight.amount.toFixed(0))
                      : `₹${insight.amount.toFixed(0)}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Saved Insights Section */}
      {savedInsights.size > 0 && (
        <div className="card mt-4">
          <h3 className="card-title">⭐ Saved Insights ({savedInsights.size})</h3>
          <div className="saved-insights-list">
            {visibleInsights
              .filter(i => savedInsights.has(i.id))
              .map(insight => (
                <div key={insight.id} className="saved-insight-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <span style={{ fontSize: '20px' }}>{insight.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>{insight.title}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{insight.description.substring(0, 60)}...</div>
                    </div>
                  </div>
                  <button
                    onClick={() => undoSave(insight.id)}
                    className="btn-icon"
                    title="Unsave"
                  >
                    ⭐
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Dismissed Insights Recovery */}
      {dismissedInsights.size > 0 && (
        <div className="card mt-4">
          <button
            onClick={restoreAllDismissed}
            disabled={saving}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            🔄 Restore All Dismissed Insights ({dismissedInsights.size})
          </button>
        </div>
      )}
    </div>
  );
}

export default Stories;
