import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_MOCK_TRANSACTIONS } from '../data/mockTransactions';

/**
 * SpendWise Transaction Context
 * Beginner-friendly React Context API for managing client-side transaction state across
 * the Dashboard, Transaction List, and Form Screens (Phases 4-5).
 * 
 * In Phase 8/10, this context will connect to the Express/MongoDB REST API.
 */
const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  // Local state initialized with temporary mock transactions
  const [transactions, setTransactions] = useState(INITIAL_MOCK_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Add a new transaction (Income or Expense)
   * @param {object} newTx
   */
  const addTransaction = (newTx) => {
    const item = {
      ...newTx,
      id: newTx.id || `tx_${Date.now()}`,
      amount: Number(newTx.amount),
      date: newTx.date || new Date().toISOString().split('T')[0],
    };
    setTransactions((prev) => [item, ...prev]);
  };

  /**
   * Edit an existing transaction
   * @param {string} id
   * @param {object} updatedFields
   */
  const editTransaction = (id, updatedFields) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedFields,
              amount: Number(updatedFields.amount ?? item.amount),
            }
          : item
      )
    );
  };

  /**
   * Delete a transaction by ID
   * @param {string} id
   */
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Get single transaction by ID
   * @param {string} id
   */
  const getTransactionById = (id) => {
    return transactions.find((item) => item.id === id) || null;
  };

  /**
   * Calculate summary metrics efficiently using useMemo
   */
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      const val = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        income += val;
      } else {
        expense += val;
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expense,
      totalBalance: income - expense,
      incomeCount: transactions.filter((t) => t.type === 'income').length,
      expenseCount: transactions.filter((t) => t.type === 'expense').length,
      recentTransactions: transactions.slice(0, 5),
    };
  }, [transactions]);

  const value = {
    transactions,
    isLoading,
    error,
    addTransaction,
    editTransaction,
    deleteTransaction,
    getTransactionById,
    totalIncome: summary.totalIncome,
    totalExpenses: summary.totalExpenses,
    totalBalance: summary.totalBalance,
    incomeCount: summary.incomeCount,
    expenseCount: summary.expenseCount,
    recentTransactions: summary.recentTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

/**
 * Custom Hook for accessing transaction state and methods
 */
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export default TransactionContext;
