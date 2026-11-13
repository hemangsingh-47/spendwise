const mongoose = require('mongoose');

/**
 * User Schema & Model
 * Defines account credentials and user profile for SpendWise.
 * 
 * NOTE (Phase 6): Password hashing and JWT authentication tokens will be
 * introduced in Phase 7. The password field is defined now to establish
 * the database schema blueprint.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      // Password will be hashed with bcrypt in Phase 7
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
