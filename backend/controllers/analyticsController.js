const Expense = require('../models/Expense');

// @desc    Get analytics dashboard
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Get all expenses for the user
    const allExpenses = await Expense.find({ user: userId });

    // Calculate total expenses
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Get this month's expenses
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthExpenses = allExpenses.filter(exp => exp.date >= startOfMonth);
    const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Get last month's expenses for comparison
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthExpenses = allExpenses.filter(
      exp => exp.date >= startOfLastMonth && exp.date <= endOfLastMonth
    );
    const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate percentage change
    const percentageChange = lastMonthTotal > 0 
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
      : 0;

    // Generate insight
    let insight = '';
    if (percentageChange > 0) {
      insight = `You spent ${Math.abs(percentageChange).toFixed(1)}% more this month compared to last month.`;
    } else if (percentageChange < 0) {
      insight = `Great! You spent ${Math.abs(percentageChange).toFixed(1)}% less this month compared to last month.`;
    } else {
      insight = 'Your spending this month is similar to last month.';
    }

    res.json({
      totalExpenses,
      thisMonthTotal,
      lastMonthTotal,
      percentageChange: percentageChange.toFixed(2),
      insight,
      expenseCount: allExpenses.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category-wise expenses
// @route   GET /api/analytics/by-category
// @access  Private
const getByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = { user: req.user._id };
    
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const categoryData = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weekly expenses
// @route   GET /api/analytics/weekly
// @access  Private
const getWeekly = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly expenses
// @route   GET /api/analytics/monthly
// @access  Private
const getMonthly = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    
    const startOfYear = new Date(targetYear, 0, 1);
    const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59);

    const monthlyData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get yearly expenses
// @route   GET /api/analytics/yearly
// @access  Private
const getYearly = async (req, res) => {
  try {
    const yearlyData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id
        }
      },
      {
        $group: {
          _id: { $year: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json(yearlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment mode distribution
// @route   GET /api/analytics/by-payment-mode
// @access  Private
const getByPaymentMode = async (req, res) => {
  try {
    const paymentModeData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id
        }
      },
      {
        $group: {
          _id: '$paymentMode',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(paymentModeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getByCategory,
  getWeekly,
  getMonthly,
  getYearly,
  getByPaymentMode
};
