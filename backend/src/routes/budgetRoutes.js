const express = require('express');
const router = express.Router();
const {
  createBudget,
  getBudgets,
  getBudgetSummary,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Budget Management Routes (Phase 9)
 * All endpoints are protected by verified JWT authentication middleware.
 * Clients cannot supply or override userId.
 */
router.use(protect);

router.route('/')
  .post(createBudget)
  .get(getBudgets);

router.get('/summary', getBudgetSummary);

router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;
