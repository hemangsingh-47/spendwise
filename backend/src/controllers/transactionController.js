const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const { uploadReceiptImage, deleteReceiptImage } = require('../utils/receiptUploader');

/**
 * @desc    Create a new transaction
 * @route   POST /api/v1/transactions
 * @access  Private (JWT Protected)
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

    // Authenticated user ID strictly from verified JWT
    const userId = req.user._id;

    // 2. Create document in MongoDB
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
 * @desc    Get all transactions for the authenticated user with filtering & pagination
 * @route   GET /api/v1/transactions
 * @access  Private (JWT Protected)
 */
const getTransactions = async (req, res, next) => {
  try {
    // Authenticated user ID strictly from verified JWT
    const userId = req.user._id;
    const { type, category, search, page = 1, limit = 20 } = req.query;

    // Build user-isolated query filter
    const query = { userId };

    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      query.$or = [
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Execute queries in parallel
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limitNum),
      Transaction.countDocuments(query),
    ]);

    // Compute user-specific financial summary across all their transactions
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
 * @desc    Get a single transaction by ID (belonging strictly to authenticated user)
 * @route   GET /api/v1/transactions/:id
 * @access  Private (JWT Protected)
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

    // Strict ownership verification: query by ID AND userId
    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
    });

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
 * @desc    Update an existing transaction (belonging strictly to authenticated user)
 * @route   PUT /api/v1/transactions/:id
 * @access  Private (JWT Protected)
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

    // Prevent overriding ownership
    delete req.body.userId;

    // Strict ownership verification: find and update only if belongs to req.user._id
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user._id },
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
 * @desc    Delete a transaction (belonging strictly to authenticated user)
 * @route   DELETE /api/v1/transactions/:id
 * @access  Private (JWT Protected)
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

    // Strict ownership verification: find and delete only if belongs to req.user._id
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id: ${id}`,
      });
    }

    // Clean up attached receipt file if one exists
    if (transaction.receiptPublicId) {
      await deleteReceiptImage(transaction.receiptPublicId);
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

/**
 * @desc    Upload or replace receipt photo for a transaction
 * @route   POST /api/v1/transactions/:id/receipt
 * @access  Private (JWT)
 */
const uploadReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for transaction: '${id}'`,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No receipt image file provided. Please attach an image under the "receipt" field.',
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id: ${id}`,
      });
    }

    // Remove old receipt if exists
    if (transaction.receiptPublicId) {
      await deleteReceiptImage(transaction.receiptPublicId);
    }

    // Upload new receipt photo
    const result = await uploadReceiptImage(req.file, req);

    transaction.receiptUrl = result.receiptUrl;
    transaction.receiptPublicId = result.receiptPublicId;
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: 'Receipt photo uploaded successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove receipt photo from a transaction
 * @route   DELETE /api/v1/transactions/:id/receipt
 * @access  Private (JWT)
 */
const removeReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for transaction: '${id}'`,
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id: ${id}`,
      });
    }

    if (transaction.receiptPublicId) {
      await deleteReceiptImage(transaction.receiptPublicId);
    }

    transaction.receiptUrl = null;
    transaction.receiptPublicId = null;
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: 'Receipt photo removed successfully',
      data: transaction,
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
  uploadReceipt,
  removeReceipt,
};
