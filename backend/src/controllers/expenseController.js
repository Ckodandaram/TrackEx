const Expense = require('../models/Expense');

// Create new expense (POST /api/expenses)
exports.createExpense = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    const userId = req.userId; // From auth middleware

    if (!category || amount === undefined) {
      return res.status(400).json({ error: 'Category and amount are required' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const expense = await Expense.create({
      userId,
      category,
      amount: Number(amount),
      description: description || '',
      date: date ? new Date(date) : new Date()
    });

    console.log(`[EXPENSE_CREATE] User ${userId} created expense: ${expense._id}`);
    res.status(201).json(expense);
  } catch (error) {
    console.error('[POST /api/expenses] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all expenses for logged-in user (GET /api/expenses)
exports.getAllExpenses = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single expense (GET /api/expenses/:id)
exports.getExpenseById = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Verify ownership
    if (expense.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to access this expense' });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update expense (PUT /api/expenses/:id)
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { amount } = req.body;

    if (amount !== undefined && Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Verify ownership
    if (expense.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this expense' });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    console.log(`[EXPENSE_UPDATE] User ${userId} updated expense: ${updated._id}`);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete expense (DELETE /api/expenses/:id)
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Verify ownership
    if (expense.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this expense' });
    }

    const deleted = await Expense.findByIdAndDelete(req.params.id);
    console.log(`[EXPENSE_DELETE] User ${userId} deleted expense: ${deleted._id}`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expenses grouped by category for logged-in user (GET /api/expenses/category)
exports.getByCategory = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const pipeline = [
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id', totalAmount: 1, count: 1 } },
      { $sort: { totalAmount: -1 } }
    ];
    const results = await Expense.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    console.error('[CATEGORY_BREAKDOWN_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// Get monthly spending summary for logged-in user (GET /api/expenses/monthly)
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const pipeline = [
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $project: { month: { $concat: [ { $toString: '$_id.y' }, '-', { $toString: '$_id.m' } ] }, total: 1, _id: 0 } },
      { $sort: { month: 1 } }
    ];
    const results = await Expense.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    console.error('[MONTHLY_TRENDS_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};
