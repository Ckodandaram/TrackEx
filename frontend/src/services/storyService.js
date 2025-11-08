import api from './api';

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
