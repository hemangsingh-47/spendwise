import api from './api';

/**
 * Transaction Service
 * Communicates with backend endpoints (/api/v1/transactions) using the centralized Axios client.
 * All requests automatically include Bearer JWT authentication.
 */
export const transactionService = {
  /**
   * Fetch transactions with optional filters and pagination
   * @param {object} params { type, category, search, page, limit }
   */
  getTransactions: async (params = {}) => {
    const cleanParams = {};
    if (params.type && params.type !== 'all') cleanParams.type = params.type;
    if (params.category && params.category !== 'All') cleanParams.category = params.category;
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;

    const response = await api.get('/transactions', { params: cleanParams });
    return response.data;
  },

  /**
   * Fetch single transaction by ID
   * @param {string} id
   */
  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  /**
   * Create a new transaction in MongoDB
   * @param {object} data { type, amount, category, description, date, paymentMethod }
   */
  createTransaction: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  /**
   * Update an existing transaction in MongoDB
   * @param {string} id
   * @param {object} data
   */
  updateTransaction: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a transaction from MongoDB
   * @param {string} id
   */
  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

export default transactionService;

