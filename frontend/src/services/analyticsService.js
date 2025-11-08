import api from './api';

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getByCategory: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/analytics/by-category?${params}`);
    return response.data;
  },

  getWeekly: async () => {
    const response = await api.get('/analytics/weekly');
    return response.data;
  },

  getMonthly: async (year) => {
    const params = year ? `?year=${year}` : '';
    const response = await api.get(`/analytics/monthly${params}`);
    return response.data;
  },

  getYearly: async () => {
    const response = await api.get('/analytics/yearly');
    return response.data;
  },

  getByPaymentMode: async () => {
    const response = await api.get('/analytics/by-payment-mode');
    return response.data;
  },
};
