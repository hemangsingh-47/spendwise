const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

/**
 * Helper to compute date range for a given month and year
 * @param {number} month 1-12
 * @param {number} year 4-digit year (e.g. 2026)
 * @returns {{ startDate: Date, endDate: Date }}
 */
const getMonthDateRange = (month, year) => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  // Month in JS Date is 0-indexed: 0 = January, 11 = December
  const startDate = new Date(y, m - 1, 1, 0, 0, 0, 0);
  // Passing 0 as day to next month gives the last day of target month
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

/**
 * Helper to compute spending metrics for a category in a month/year
 * @param {mongoose.Types.ObjectId} userId
 * @param {string} category
 * @param {number} month
 * @param {number} year
 * @param {number} limit
 * @returns {Promise<{ spent: number, remaining: number, percentage: number, status: string }>}
 */
const calculateCategorySpending = async (userId, category, month, year, limit) => {
  const { startDate, endDate } = getMonthDateRange(month, year);

  const transactions = await Transaction.find({
    userId,
    type: 'expense',
    category: { $regex: new RegExp(`^${category.trim()}$`, 'i') },
    date: { $gte: startDate, $lte: endDate },
  });

  const spent = transactions.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
  const remaining = Number((limit - spent).toFixed(2));
  const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;

  let status = 'normal';
  if (percentage >= 100) {
    status = 'exceeded';
  } else if (percentage >= 80) {
    status = 'warning';
  }

  return {
    spent: Number(spent.toFixed(2)),
    remaining,
    percentage,
    status,
    transactionCount: transactions.length,
  };
};

/**
 * @desc    Create a new budget target
 * @route   POST /api/v1/budgets
 * @access  Private (JWT)
 */
const createBudget = async (req, res, next) => {
  try {
    const { category, limit, month, year } = req.body;

    // 1. Validation
    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required for budget target.',
      });
    }

    const numericLimit = Number(limit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget limit must be a positive number greater than 0.',
      });
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const bMonth = month !== undefined ? parseInt(month, 10) : currentMonth;
    const bYear = year !== undefined ? parseInt(year, 10) : currentYear;

    if (isNaN(bMonth) || bMonth < 1 || bMonth > 12) {
      return res.status(400).json({
        success: false,
        message: 'Month must be an integer between 1 and 12.',
      });
    }

    if (isNaN(bYear) || bYear < 2020 || bYear > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid 4-digit year (2020-2100).',
      });
    }

    // 2. Prevent duplicate budget for same category/month/year for this user
    const normalizedCategory = category.trim();
    const existing = await Budget.findOne({
      userId: req.user._id,
      category: { $regex: new RegExp(`^${normalizedCategory}$`, 'i') },
      month: bMonth,
      year: bYear,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A budget for category "${normalizedCategory}" already exists for ${bMonth}/${bYear}. You can edit the existing budget limit instead.`,
      });
    }

    // 3. Create budget document
    const budget = await Budget.create({
      userId: req.user._id,
      category: normalizedCategory,
      limit: numericLimit,
      month: bMonth,
      year: bYear,
    });

    // 4. Calculate live spending for the newly created budget
    const spending = await calculateCategorySpending(
      req.user._id,
      budget.category,
      budget.month,
      budget.year,
      budget.limit
    );

    return res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: {
        ...budget.toObject(),
        id: budget._id,
        ...spending,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all budgets for the authenticated user (with optional month/year query)
 * @route   GET /api/v1/budgets?month=11&year=2026
 * @access  Private (JWT)
 */
const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const filter = { userId: req.user._id };

    if (month) {
      const m = parseInt(month, 10);
      if (!isNaN(m) && m >= 1 && m <= 12) {
        filter.month = m;
      }
    } else {
      // Default to current month if no filter provided
      filter.month = currentMonth;
    }

    if (year) {
      const y = parseInt(year, 10);
      if (!isNaN(y) && y >= 2020) {
        filter.year = y;
      }
    } else {
      // Default to current year if no filter provided
      filter.year = currentYear;
    }

    const budgets = await Budget.find(filter).sort({ category: 1 });

    // Calculate real-time spending metrics for each budget
    const enrichedBudgets = await Promise.all(
      budgets.map(async (b) => {
        const spending = await calculateCategorySpending(
          req.user._id,
          b.category,
          b.month,
          b.year,
          b.limit
        );
        return {
          ...b.toObject(),
          id: b._id,
          ...spending,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: enrichedBudgets.length,
      filter: {
        month: filter.month,
        year: filter.year,
      },
      data: enrichedBudgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly budget summary overview
 * @route   GET /api/v1/budgets/summary?month=11&year=2026
 * @access  Private (JWT)
 */
const getBudgetSummary = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const month = req.query.month ? parseInt(req.query.month, 10) : currentMonth;
    const year = req.query.year ? parseInt(req.query.year, 10) : currentYear;

    const budgets = await Budget.find({
      userId: req.user._id,
      month,
      year,
    });

    const totalBudget = budgets.reduce((acc, b) => acc + (b.limit || 0), 0);

    // Calculate total expenses for the entire month
    const { startDate, endDate } = getMonthDateRange(month, year);
    const monthExpenses = await Transaction.find({
      userId: req.user._id,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate },
    });

    const totalSpent = monthExpenses.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
    const remainingBudget = Number((totalBudget - totalSpent).toFixed(2));
    const spendingPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    let overallStatus = 'normal';
    if (spendingPercentage >= 100) {
      overallStatus = 'exceeded';
    } else if (spendingPercentage >= 80) {
      overallStatus = 'warning';
    }

    return res.status(200).json({
      success: true,
      data: {
        month,
        year,
        budgetCount: budgets.length,
        totalBudget: Number(totalBudget.toFixed(2)),
        totalSpent: Number(totalSpent.toFixed(2)),
        remainingBudget,
        spendingPercentage,
        overallStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single budget by ID
 * @route   GET /api/v1/budgets/:id
 * @access  Private (JWT)
 */
const getBudgetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for budget: '${id}'`,
      });
    }

    const budget = await Budget.findOne({ _id: id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: `Budget not found with id: ${id}`,
      });
    }

    const spending = await calculateCategorySpending(
      req.user._id,
      budget.category,
      budget.month,
      budget.year,
      budget.limit
    );

    return res.status(200).json({
      success: true,
      data: {
        ...budget.toObject(),
        id: budget._id,
        ...spending,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update budget limit
 * @route   PUT /api/v1/budgets/:id
 * @access  Private (JWT)
 */
const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for budget: '${id}'`,
      });
    }

    const numericLimit = Number(limit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget limit must be a positive number greater than 0.',
      });
    }

    const budget = await Budget.findOne({ _id: id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: `Budget not found with id: ${id}`,
      });
    }

    budget.limit = numericLimit;
    await budget.save();

    const spending = await calculateCategorySpending(
      req.user._id,
      budget.category,
      budget.month,
      budget.year,
      budget.limit
    );

    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: {
        ...budget.toObject(),
        id: budget._id,
        ...spending,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete budget
 * @route   DELETE /api/v1/budgets/:id
 * @access  Private (JWT)
 */
const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for budget: '${id}'`,
      });
    }

    const budget = await Budget.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: `Budget not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
      data: {
        id: budget._id,
        category: budget.category,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetSummary,
  getBudgetById,
  updateBudget,
  deleteBudget,
};
