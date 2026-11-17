const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  uploadReceipt,
  removeReceipt,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * Transaction Routes
 * Base URL: /api/v1/transactions
 * All transaction routes are strictly protected by JWT authMiddleware.
 */
router.use(protect);

router.route('/')
  .post(createTransaction)
  .get(getTransactions);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

// Receipt photo upload & delete (Phase 10)
router.route('/:id/receipt')
  .post(upload.single('receipt'), uploadReceipt)
  .delete(removeReceipt);

module.exports = router;
