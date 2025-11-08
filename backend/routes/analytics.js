const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getByCategory,
  getWeekly,
  getMonthly,
  getYearly,
  getByPaymentMode
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboard);
router.get('/by-category', protect, getByCategory);
router.get('/weekly', protect, getWeekly);
router.get('/monthly', protect, getMonthly);
router.get('/yearly', protect, getYearly);
router.get('/by-payment-mode', protect, getByPaymentMode);

module.exports = router;
