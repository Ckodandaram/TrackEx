import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import '../styles/Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await userService.login({
        email: formData.email,
        password: formData.password,
      });

      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('✓ Login successful! Redirecting...');
      console.log('[LOGIN_SUCCESS]', response.data.user);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Refresh to update auth state in App.js
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMsg);
      console.error('[LOGIN_ERROR]', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo/Header */}
        <div className="auth-header">
          <h1 className="auth-title">SpendWise</h1>
          <p className="auth-subtitle">Sign In to Your Account</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {/* Remember & Forgot */}
          <div className="auth-options">
            <label>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-link">
              Forgot password?
            </a>
          </div>

          {/* Messages */}
          {error && <div className="error-message">❌ {error}</div>}
          {message && <div className="success-message">✓ {message}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '16px' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Social Login (Placeholder) */}
        <div className="auth-social">
          <button type="button" className="btn btn-secondary" disabled>
            🔵 Continue with Google
          </button>
          <button type="button" className="btn btn-secondary" disabled>
            🍎 Continue with Apple
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="auth-link">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="auth-background"></div>
    </div>
  );
}

export default Login;
