const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const insightController = require('../controllers/insightController');

// All routes require authentication
router.use(auth);

// Get user's insight preferences
router.get('/', insightController.getPreferences);

// Save an insight
router.post('/save', insightController.saveInsight);

// Unsave an insight
router.delete('/save', insightController.unsaveInsight);

// Dismiss an insight
router.post('/dismiss', insightController.dismissInsight);

// Restore all dismissed insights
router.post('/restore', insightController.restoreDismissed);

module.exports = router;
