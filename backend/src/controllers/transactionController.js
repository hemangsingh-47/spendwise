const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

/**
 * Temporary default development User ObjectId for Phase 6 API testing.
 * 
 * IMPORTANT ARCHITECTURAL RESTRICTION:
 * Real JWT authentication middleware has not been integrated yet (scheduled for Phase 7).
 * In Phase 7, 'userId' will be extracted securely from the verified JWT token:
 *   const userId = req.user.id;
 * Do NOT use client-provided userId in production.
 */
const DEFAULT_DEV_USER_ID = new mongoose.Types.ObjectId('673456789abcdef012345678');

const getEffectiveUserId = (req) => {
  // When JWT authentication is added in Phase 7, req.user will be populated
  if (req.user && req.user._id) {
    return req.user._id;
  }
  if (req.body.userId && mongoose.Types.ObjectId.isValid(req.body.userId)) {
    return new mongoose.Types.ObjectId(req.body.userId);
  }
  return DEFAULT_DEV_USER_ID;
};

/**
 * @desc    Create a new transaction
 * @route   POST /api/v1/transactions
 * @access  Public (Phase 6 dev) -> Protected (Phase 7 JWT)
 */
const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, description, date, paymentMethod } = req.body;

    // 1. Validation checks
    if (!type || !['income', 'expense'].includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction type. Must be 'income' or 'expense'.",
      });
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be a positive number greater than 0.',
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required.',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description is required.',
      });
    }

    const userId = getEffectiveUserId(req);

    // 2. Create in MongoDB
    const transaction = await Transaction.create({
      userId,
      type: type.toLowerCase(),
      amount: numAmount,
      category: category.trim(),
      description: description.trim(),
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI',
    });

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all transactions with filtering and pagination
 * @route   GET /api/v1/transactions
 * @access  Public (Phase 6 dev) -> Protected (Phase 7 JWT)
 */
const getTransactions = async (req, res, next) => {
  try {
    const userId = getEffectiveUserId(req);
    const { type, category, page = 1, limit = 20 } = req.query;

    // Build query filter
    const query = { userId };

    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Execute query with sorting
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limitNum),
      Transaction.countDocuments(query),
    ]);

    // Compute summary metrics across user's records
    const allUserTransactions = await Transaction.find({ userId }).select('type amount');
    let totalIncome = 0;
    let totalExpenses = 0;
    allUserTransactions.forEach((tx) => {
      if (tx.type === 'income') totalIncome += tx.amount;
      else totalExpenses += tx.amount;
    });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      summary: {
        totalIncome,
        totalExpenses,
        totalBalance: totalIncome - totalExpenses,
      },
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single transaction by ID
 * @route   GET /api/v1/transactions/:id
 * @access  Public (Phase 6 dev) -> Protected (Phase 7 JWT)
 */
const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for transaction: '${id}'`,
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing transaction
 * @route   PUT /api/v1/transactions/:id
 * @access  Public (Phase 6 dev) -> Protected (Phase 7 JWT)
 */
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for transaction: '${id}'`,
      });
    }

    // Validate type if provided
    if (req.body.type && !['income', 'expense'].includes(req.body.type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Transaction type must be 'income' or 'expense'.",
      });
    }

    // Validate amount if provided
    if (req.body.amount !== undefined) {
      const numAmount = parseFloat(req.body.amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number greater than 0.',
        });
      }
      req.body.amount = numAmount;
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/v1/transactions/:id
 * @access  Public (Phase 6 dev) -> Protected (Phase 7 JWT)
 */
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for transaction: '${id}'`,
      });
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
