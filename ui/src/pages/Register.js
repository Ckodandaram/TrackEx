import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import '../styles/Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await userService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('✓ Account created successfully! Redirecting...');
      console.log('[REGISTER_SUCCESS]', response.data.user);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Refresh to update auth state in App.js
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMsg);
      console.error('[REGISTER_ERROR]', errorMsg);
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
          <p className="auth-subtitle">Create Your Account</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

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
              placeholder="At least 6 characters"
              required
              disabled={loading}
            />
            <small className="hint">
              {formData.password.length >= 6 ? '✓ Strong' : '✗ At least 6 characters required'}
            </small>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
            {formData.confirmPassword && (
              <small className="hint">
                {formData.password === formData.confirmPassword
                  ? '✓ Passwords match'
                  : '✗ Passwords do not match'}
              </small>
            )}
          </div>

          {/* Terms */}
          <label className="terms-checkbox">
            <input type="checkbox" required disabled={loading} />
            <span>I agree to the Terms and Conditions</span>
          </label>

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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Social Register (Placeholder) */}
        <div className="auth-social">
          <button type="button" className="btn btn-secondary" disabled>
            🔵 Sign up with Google
          </button>
          <button type="button" className="btn btn-secondary" disabled>
            🍎 Sign up with Apple
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="auth-link">
              Sign In
            </a>
          </p>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="auth-background"></div>
    </div>
  );
}

export default Register;
