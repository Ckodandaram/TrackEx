import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor: Attach JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API_INTERCEPTOR] Token attached to request:', config.method, config.url);
    } else {
      console.log('[API_INTERCEPTOR] No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API_INTERCEPTOR] 401 Unauthorized - Clearing token and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Expense endpoints
export const expenseService = {
  getAll: () => apiClient.get('/expenses'),
  create: (data) => apiClient.post('/expenses', data),
  update: (id, data) => apiClient.put(`/expenses/${id}`, data),
  delete: (id) => apiClient.delete(`/expenses/${id}`),
};

// Analytics endpoints
export const analyticsService = {
  getAnalytics: () => apiClient.get('/analytics'),
  getByCategory: () => apiClient.get('/analytics/category'),
  getMonthly: () => apiClient.get('/analytics/monthly'),
};

// User/Auth endpoints
export const userService = {
  register: (data) => apiClient.post('/users/register', data),
  login: (data) => apiClient.post('/users/login', data),
  getCurrentUser: () => apiClient.get('/users/me'),
};

export default apiClient;
