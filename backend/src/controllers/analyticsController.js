const Expense = require('../models/Expense');

// Get analytics summary (GET /api/analytics)
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const expenses = await Expense.find({ userId });

    if (expenses.length === 0) {
      return res.status(200).json({
        totalSpending: 0,
        expenseCount: 0,
        averageExpense: 0,
        categoryBreakdown: {},
      });
    }

    const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseCount = expenses.length;
    const averageExpense = totalSpending / expenseCount;

    const categoryBreakdown = {};
    expenses.forEach((expense) => {
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = { count: 0, total: 0 };
      }
      categoryBreakdown[expense.category].count += 1;
      categoryBreakdown[expense.category].total += expense.amount;
    });

    res.status(200).json({
      totalSpending: parseFloat(totalSpending.toFixed(2)),
      expenseCount,
      averageExpense: parseFloat(averageExpense.toFixed(2)),
      categoryBreakdown,
    });
  } catch (error) {
    console.error('[ANALYTICS_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// Get category breakdown (GET /api/analytics/category)
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const expenses = await Expense.find({ userId });

    const breakdown = {};
    expenses.forEach((expense) => {
      if (!breakdown[expense.category]) {
        breakdown[expense.category] = 0;
      }
      breakdown[expense.category] += expense.amount;
    });

    const result = Object.entries(breakdown).map(([category, amount]) => ({
      name: category,
      value: parseFloat(amount.toFixed(2)),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('[CATEGORY_BREAKDOWN_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// Get monthly trends (GET /api/analytics/monthly)
exports.getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const expenses = await Expense.find({ userId });

    const monthly = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[month]) {
        monthly[month] = 0;
      }
      monthly[month] += expense.amount;
    });

    const result = Object.entries(monthly)
      .map(([month, total]) => ({
        month,
        total: parseFloat(total.toFixed(2)),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.status(200).json(result);
  } catch (error) {
    console.error('[MONTHLY_TRENDS_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};
