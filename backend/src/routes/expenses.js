const express = require('express');
const router = express.Router();

// Import controller functions
const {
	getAllExpenses,
	createExpense,
	getExpenseById,
	updateExpense,
	deleteExpense,
	getByCategory,
	getMonthlySummary,
} = require('../controllers/expenseController');

// Order matters: specific subpaths before dynamic :id
router.get('/', getAllExpenses);
router.post('/', createExpense);
router.get('/category', getByCategory);
router.get('/monthly', getMonthlySummary);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
