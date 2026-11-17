import api from './api';

/**
 * SpendWise Analytics Service (Phase 10)
 * Communicates with backend analytics endpoints for KPIs, monthly trends, and category distribution.
 */
export const analyticsService = {
  /**
   * Fetch financial summary (income, expenses, net savings, savings rate, comparison)
   * @param {number} [month] 1-12
   * @param {number} [year] e.g. 2026
   */
  async getSummary(month, year) {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await api.get('/analytics/summary', { params });
    return response.data.data;
  },

  /**
   * Fetch monthly income vs expense trends for the last N months
   * @param {number} [months=6]
   */
  async getMonthlyTrend(months = 6) {
    const response = await api.get('/analytics/monthly', {
      params: { months },
    });
    return response.data.data;
  },

  /**
   * Fetch category-wise expense breakdown with percentages
   * @param {number} [month]
   * @param {number} [year]
   */
  async getCategoryBreakdown(month, year) {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await api.get('/analytics/categories', { params });
    return response.data.data;
  },
};

export default analyticsService;
