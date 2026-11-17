const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

/**
 * Helper to compute month boundaries
 */
const getMonthRange = (month, year) => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  const startDate = new Date(y, m - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

/**
 * @desc    Get financial summary (income, expense, net savings, savings rate, prev month comparison)
 * @route   GET /api/v1/analytics/summary?month=11&year=2026
 * @access  Private (JWT)
 */
const getSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month, 10) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();

    if (isNaN(month) || month < 1 || month > 12 || isNaN(year) || year < 2020) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month or year parameter',
      });
    }

    // 1. Current Month Aggregation
    const { startDate, endDate } = getMonthRange(month, year);
    const currentMonthData = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    currentMonthData.forEach((item) => {
      if (item._id === 'income') {
        totalIncome = item.total;
        incomeCount = item.count;
      } else if (item._id === 'expense') {
        totalExpenses = item.total;
        expenseCount = item.count;
      }
    });

    const netSavings = Number((totalIncome - totalExpenses).toFixed(2));
    const savingsPercentage = totalIncome > 0
      ? Number((((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1))
      : 0;

    // 2. Previous Month Comparison
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const { startDate: prevStart, endDate: prevEnd } = getMonthRange(prevMonth, prevYear);

    const prevMonthData = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: prevStart, $lte: prevEnd },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let prevIncome = 0;
    let prevExpenses = 0;
    prevMonthData.forEach((item) => {
      if (item._id === 'income') prevIncome = item.total;
      if (item._id === 'expense') prevExpenses = item.total;
    });

    const prevNetSavings = Number((prevIncome - prevExpenses).toFixed(2));
    const hasPreviousData = prevMonthData.length > 0;

    return res.status(200).json({
      success: true,
      data: {
        month,
        year,
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        netSavings,
        savingsPercentage,
        incomeCount,
        expenseCount,
        totalTransactions: incomeCount + expenseCount,
        comparison: {
          hasPreviousData,
          previousMonth: prevMonth,
          previousYear: prevYear,
          prevIncome: Number(prevIncome.toFixed(2)),
          prevExpenses: Number(prevExpenses.toFixed(2)),
          prevNetSavings,
          expenseChange: hasPreviousData
            ? Number((totalExpenses - prevExpenses).toFixed(2))
            : null,
          incomeChange: hasPreviousData
            ? Number((totalIncome - prevIncome).toFixed(2))
            : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly income vs expense trends (last N months, default 6)
 * @route   GET /api/v1/analytics/monthly?months=6
 * @access  Private (JWT)
 */
const getMonthlyTrend = async (req, res, next) => {
  try {
    const count = req.query.months ? Math.min(12, Math.max(2, parseInt(req.query.months, 10))) : 6;
    const now = new Date();

    // Generate list of the last N months chronologically
    const monthsList = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsList.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: d.toLocaleString('en-US', { month: 'short' }),
        fullLabel: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
      });
    }

    const firstMonth = monthsList[0];
    const startDate = new Date(firstMonth.year, firstMonth.month - 1, 1, 0, 0, 0, 0);

    const tz = req.query.timezone || '+05:30';

    const aggregated = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { date: '$date', timezone: tz } },
            month: { $month: { date: '$date', timezone: tz } },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Map aggregated results into monthsList template
    const trend = monthsList.map((m) => {
      let income = 0;
      let expense = 0;

      aggregated.forEach((item) => {
        if (item._id.year === m.year && item._id.month === m.month) {
          if (item._id.type === 'income') income = item.total;
          if (item._id.type === 'expense') expense = item.total;
        }
      });

      return {
        month: m.month,
        year: m.year,
        label: m.label,
        fullLabel: m.fullLabel,
        income: Number(income.toFixed(2)),
        expense: Number(expense.toFixed(2)),
        net: Number((income - expense).toFixed(2)),
      };
    });

    return res.status(200).json({
      success: true,
      monthsCount: trend.length,
      data: trend,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category-wise expense breakdown with percentages
 * @route   GET /api/v1/analytics/categories?month=11&year=2026
 * @access  Private (JWT)
 */
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month, 10) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();

    const { startDate, endDate } = getMonthRange(month, year);

    const categoriesData = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    const totalExpenseAmount = categoriesData.reduce((acc, cat) => acc + cat.totalAmount, 0);

    const categories = categoriesData.map((cat) => {
      const percentage = totalExpenseAmount > 0
        ? Number(((cat.totalAmount / totalExpenseAmount) * 100).toFixed(1))
        : 0;
      return {
        category: cat._id,
        amount: Number(cat.totalAmount.toFixed(2)),
        count: cat.count,
        percentage,
      };
    });

    return res.status(200).json({
      success: true,
      month,
      year,
      totalExpenses: Number(totalExpenseAmount.toFixed(2)),
      categoriesCount: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getMonthlyTrend,
  getCategoryBreakdown,
};
