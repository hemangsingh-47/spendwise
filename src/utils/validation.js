/**
 * Client-Side Form Validation Utilities
 * Beginner-friendly pure JavaScript validation functions for SpendWise authentication
 */

// Basic email regex pattern: username@domain.extension
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email string
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email address is required.';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address (e.g., student@college.edu).';
  }
  return null;
};

/**
 * Validates a password string
 * @param {string} password
 * @param {number} minLength Minimum characters required (default: 6)
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password || password.length === 0) {
    return 'Password is required.';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  return null;
};

/**
 * Validates password confirmation match
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string|null} Error message or null if valid
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.length === 0) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
};

/**
 * Validates a user's full name
 * @param {string} name
 * @returns {string|null} Error message or null if valid
 */
export const validateFullName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters long.';
  }
  return null;
};

/**
 * Validates terms and conditions checkbox
 * @param {boolean} isAccepted
 * @returns {string|null} Error message or null if valid
 */
export const validateTerms = (isAccepted) => {
  if (!isAccepted) {
    return 'You must accept the Terms and Conditions to register.';
  }
  return null;
};
