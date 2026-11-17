import api from './api';

/**
 * SpendWise Budget Service (Phase 9)
 * Handles all budget network operations against the Express REST API.
 * Bearer JWT is attached automatically by the Axios interceptor.
 */
export const budgetService = {
  /**
   * Fetch all budgets for a given month and year
   * @param {number} [month] 1-12
   * @param {number} [year] e.g. 2026
   */
  async getBudgets(month, year) {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await api.get('/budgets', { params });
    return response.data;
  },

  /**
   * Fetch monthly budget overview summary
   * @param {number} [month]
   * @param {number} [year]
   */
  async getBudgetSummary(month, year) {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await api.get('/budgets/summary', { params });
    return response.data.data;
  },

  /**
   * Fetch single budget by ID
   * @param {string} id
   */
  async getBudgetById(id) {
    const response = await api.get(`/budgets/${id}`);
    return response.data.data;
  },

  /**
   * Create a new budget
   * @param {{ category: string, limit: number, month?: number, year?: number }} budgetData
   */
  async createBudget(budgetData) {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  /**
   * Update an existing budget limit
   * @param {string} id
   * @param {{ limit: number }} updateData
   */
  async updateBudget(id, updateData) {
    const response = await api.put(`/budgets/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete a budget
   * @param {string} id
   */
  async deleteBudget(id) {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

export default budgetService;
