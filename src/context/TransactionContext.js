import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import transactionService from '../services/transactionService';
import { useAuth } from './AuthContext';

/**
 * SpendWise Transaction Context (Phase 8 Integration)
 * Directly connects the React Native frontend to the Express/MongoDB backend REST APIs.
 * Automatically synchronizes whenever the authenticated user creates, edits, or deletes records.
 */
const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Normalize backend MongoDB document into uniform frontend transaction structure
   */
  const normalizeTx = (doc) => ({
    ...doc,
    id: doc._id || doc.id,
    date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    amount: Number(doc.amount),
  });

  /**
   * Fetch all transactions from the backend REST API
   */
  const fetchTransactions = useCallback(async (isRefresh = false) => {
    if (!isAuthenticated) {
      setTransactions([]);
      return;
    }

    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const result = await transactionService.getTransactions({ limit: 100 });
      if (result.success && Array.isArray(result.data)) {
        setTransactions(result.data.map(normalizeTx));
      }
    } catch (err) {
      console.warn('[TransactionContext] Fetch failed:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isAuthenticated]);

  // Load transactions whenever authentication status changes to true
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [isAuthenticated, fetchTransactions]);

  /**
   * Add a new transaction (POST /api/v1/transactions)
   */
  const addTransaction = async (newTxData) => {
    setIsLoading(true);
    try {
      setError(null);
      const result = await transactionService.createTransaction({
        type: newTxData.type,
        amount: Number(newTxData.amount),
        category: newTxData.category,
        description: newTxData.description,
        date: newTxData.date,
        paymentMethod: newTxData.paymentMethod || 'UPI',
      });

      if (result.success && result.data) {
        const normalized = normalizeTx(result.data);
        setTransactions((prev) => [normalized, ...prev]);
        return normalized;
      }
    } catch (err) {
      console.error('[TransactionContext] Add transaction failed:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Edit an existing transaction (PUT /api/v1/transactions/:id)
   */
  const editTransaction = async (id, updatedFields) => {
    setIsLoading(true);
    try {
      setError(null);
      const result = await transactionService.updateTransaction(id, updatedFields);
      if (result.success && result.data) {
        const normalized = normalizeTx(result.data);
        setTransactions((prev) =>
          prev.map((item) => (item.id === id ? normalized : item))
        );
        return normalized;
      }
    } catch (err) {
      console.error('[TransactionContext] Edit transaction failed:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a transaction (DELETE /api/v1/transactions/:id)
   */
  const deleteTransaction = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      await transactionService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('[TransactionContext] Delete transaction failed:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get single transaction by ID from current local state
   */
  const getTransactionById = (id) => {
    return transactions.find((item) => item.id === id) || null;
  };

  /**
   * Derived Financial Summary (useMemo)
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
    isRefreshing,
    error,
    refreshTransactions: () => fetchTransactions(true),
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

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export default TransactionContext;
