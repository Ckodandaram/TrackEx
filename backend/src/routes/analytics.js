const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// Protect all analytics routes with JWT auth
router.use(authMiddleware);

// Get analytics summary
router.get('/', analyticsController.getAnalytics);

// Get category breakdown
router.get('/category', analyticsController.getCategoryBreakdown);

// Get monthly trends
router.get('/monthly', analyticsController.getMonthlyTrends);

module.exports = router;
