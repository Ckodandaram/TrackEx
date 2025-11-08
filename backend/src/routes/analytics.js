const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Get analytics summary
router.get('/', analyticsController.getAnalytics);

// Get category breakdown
router.get('/category', analyticsController.getCategoryBreakdown);

// Get monthly trends
router.get('/monthly', analyticsController.getMonthlyTrends);

module.exports = router;
