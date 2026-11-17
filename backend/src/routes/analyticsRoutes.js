const express = require('express');
const router = express.Router();
const {
  getSummary,
  getMonthlyTrend,
  getCategoryBreakdown,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Analytics & Reports Routes (Phase 10)
 * All endpoints are protected by verified JWT authentication middleware.
 * All computations are dynamically aggregated from the authenticated user's MongoDB records.
 */
router.use(protect);

router.get('/summary', getSummary);
router.get('/monthly', getMonthlyTrend);
router.get('/categories', getCategoryBreakdown);

module.exports = router;
