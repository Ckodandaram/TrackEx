import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/register',
        { name, email, password, confirmPassword }
      );

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);

      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password }
      );

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);

      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Get current user from backend
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await axios.get(
        'http://localhost:5000/api/users/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      logout();
      return null;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
