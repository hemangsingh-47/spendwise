/**
 * TEMPORARY MOCK TRANSACTION DATA
 * 
 * NOTE: This file is used STRICTLY for UI preview and Phase 4/5 frontend state initialization.
 * It will be replaced by real MongoDB backend REST API responses in Phase 8/10.
 * Do not connect or mix this file with backend services.
 */

export const INITIAL_MOCK_TRANSACTIONS = [
  {
    id: 'tx_1',
    type: 'income',
    amount: 35000,
    category: 'Salary',
    description: 'Monthly College Internship Stipend',
    date: '2026-11-01',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'tx_2',
    type: 'expense',
    amount: 450,
    category: 'Food',
    description: 'College Canteen Lunch & Chai',
    date: '2026-11-03',
    paymentMethod: 'UPI',
  },
  {
    id: 'tx_3',
    type: 'expense',
    amount: 1800,
    category: 'Education',
    description: 'React Native & Cloud Reference Books',
    date: '2026-11-05',
    paymentMethod: 'Debit Card',
  },
  {
    id: 'tx_4',
    type: 'income',
    amount: 8000,
    category: 'Freelance',
    description: 'Portfolio Website UI Design Gig',
    date: '2026-11-08',
    paymentMethod: 'UPI',
  },
  {
    id: 'tx_5',
    type: 'expense',
    amount: 1200,
    category: 'Transport',
    description: 'Monthly Metro Rail SmartCard Recharge',
    date: '2026-11-09',
    paymentMethod: 'UPI',
  },
  {
    id: 'tx_6',
    type: 'expense',
    amount: 999,
    category: 'Bills',
    description: 'Hostel Fiber Broadband Internet Bill',
    date: '2026-11-10',
    paymentMethod: 'Net Banking',
  },
  {
    id: 'tx_7',
    type: 'expense',
    amount: 1500,
    category: 'Shopping',
    description: 'Ergonomic Mouse for Coding',
    date: '2026-11-11',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx_8',
    type: 'expense',
    amount: 600,
    category: 'Entertainment',
    description: 'Weekend Movie with Batchmates',
    date: '2026-11-12',
    paymentMethod: 'UPI',
  },
];

export const MOCK_USER = {
  name: 'Hemang Singh',
  email: 'student@college.edu',
  role: 'Computer Science Student (2nd Year)',
  currency: 'INR',
  currencySymbol: '₹',
};

export default {
  INITIAL_MOCK_TRANSACTIONS,
  MOCK_USER,
};
