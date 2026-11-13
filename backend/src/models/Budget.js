const mongoose = require('mongoose');

/**
 * Budget Schema & Model
 * Defines category spending limit budgets for SpendWise.
 * 
 * NOTE (Phase 6): The Mongoose model and index are established here.
 * Budget REST API routes and business logic will be implemented in Phase 9.
 */
const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for each budget'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required for budget target'],
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit amount is required'],
      min: [0, 'Budget limit cannot be negative'],
    },
    month: {
      type: Number,
      required: [true, 'Budget month is required (1-12)'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Budget year is required'],
      min: [2020, 'Year must be 2020 or later'],
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index: a user can only have ONE budget target per category per month/year
budgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
