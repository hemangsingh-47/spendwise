/**
 * SpendWise Currency Utilities
 * 
 * Provides centralized currency symbols, formatting, and supported currency lists.
 * In accordance with Phase 11 rules:
 * - Stored amounts remain numeric in MongoDB.
 * - Changing the currency preference updates the display symbol,
 *   without falsely converting numerical transaction values.
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

/**
 * Returns the symbol corresponding to a 3-letter currency code.
 * Defaults to '₹' (INR).
 * 
 * @param {string} code - Currency code (e.g. 'INR', 'USD')
 * @returns {string} Symbol (e.g. '₹', '$')
 */
export const getCurrencySymbol = (code) => {
  if (!code) return '₹';
  const found = SUPPORTED_CURRENCIES.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );
  return found ? found.symbol : '₹';
};

/**
 * Formats a numeric amount with the appropriate currency symbol and commas.
 * 
 * @param {number} amount - Numeric value
 * @param {string} code - Currency code
 * @param {boolean} showDecimals - Whether to enforce 2 decimal places
 * @returns {string} Formatted string, e.g. "₹1,250" or "$45.50"
 */
export const formatCurrency = (amount, code = 'INR', showDecimals = false) => {
  const symbol = getCurrencySymbol(code);
  const num = Number(amount) || 0;
  
  const formattedNumber = showDecimals
    ? num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : num.toLocaleString('en-IN');

  return `${symbol}${formattedNumber}`;
};
