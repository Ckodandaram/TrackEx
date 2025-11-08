import api from './api';

export const expenseService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/expenses?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  update: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};

export const storyService = {
  getAll: async () => {
    const response = await api.get('/stories');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  create: async (storyData) => {
    const response = await api.post('/stories', storyData);
    return response.data;
  },

  update: async (id, storyData) => {
    const response = await api.put(`/stories/${id}`, storyData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  },
};

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

  getMonthly: async (year) => {
    const params = year ? `?year=${year}` : '';
    const response = await api.get(`/analytics/monthly${params}`);
    return response.data;
  },
};
