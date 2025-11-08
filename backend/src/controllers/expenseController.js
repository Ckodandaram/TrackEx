const Expense = require('../models/Expense');

// Create new expense (POST /api/expenses)
exports.createExpense = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({ error: 'Category and amount are required' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    const dummyUserId = 'tempuser';

    const expense = await Expense.create({
      userId: dummyUserId,
      category,
      amount: Number(amount),
      description: description || '',
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('[POST /api/expenses] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all expenses (GET /api/expenses)
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single expense (GET /api/expenses/:id)
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update expense (PUT /api/expenses/:id)
exports.updateExpense = async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount !== undefined && Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete expense (DELETE /api/expenses/:id)
exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expenses grouped by category (GET /api/expenses/category)
exports.getByCategory = async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id', totalAmount: 1, count: 1 } },
      { $sort: { totalAmount: -1 } }
    ];
    const results = await Expense.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get monthly spending summary (GET /api/expenses/monthly)
exports.getMonthlySummary = async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $project: { month: { $concat: [ { $toString: '$_id.y' }, '-', { $toString: '$_id.m' } ] }, total: 1, _id: 0 } },
      { $sort: { month: 1 } }
    ];
    const results = await Expense.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
