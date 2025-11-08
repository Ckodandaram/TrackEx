import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { user, logout, fetchCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Fetch latest user data
    fetchCurrentUser().then(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (loading) {
    return (
      <div className="container profile">
        <div className="skeleton" style={{ height: '200px', marginBottom: '16px' }}></div>
        <div className="skeleton" style={{ height: '300px' }}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container profile">
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <div className="empty-state-title">Not Logged In</div>
          <div className="empty-state-description">
            Please log in to view your profile
          </div>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
        </div>
        <div className="profile-info">
          <h1>{user.name || 'User'}</h1>
          <p className="text-muted">{user.email}</p>
          <p className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
            Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>

      {/* Account Information Card */}
      <div className="card mt-4">
        <h3 className="card-title">Account Information</h3>
        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email Address</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">User ID</span>
            <span className="detail-value" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              {user._id}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Status</span>
            <span className="detail-value">
              <span className="status-badge success">Active ✓</span>
            </span>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="card mt-4">
        <h3 className="card-title">Settings</h3>
        
        <div className="settings-group">
          <div className="setting-row">
            <div className="setting-label">
              <span>Dark Mode</span>
              <p className="setting-description">Enable dark theme for easier viewing</p>
            </div>
            <button
              className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
              onClick={handleThemeToggle}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-label">
              <span>Currency</span>
              <p className="setting-description">Display all amounts in INR (₹)</p>
            </div>
            <span className="setting-value">₹ INR</span>
          </div>

          <div className="setting-row">
            <div className="setting-label">
              <span>Language</span>
              <p className="setting-description">Interface language</p>
            </div>
            <span className="setting-value">English</span>
          </div>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="card mt-4 danger-zone">
        <h3 className="card-title">Danger Zone</h3>
        <p className="text-muted" style={{ marginBottom: '16px' }}>
          These actions cannot be undone. Be careful!
        </p>

        <div className="settings-group">
          <div className="setting-row">
            <div className="setting-label">
              <span>Logout</span>
              <p className="setting-description">Sign out from this account</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-label">
              <span>Delete Account</span>
              <p className="setting-description">Permanently delete your account and all data</p>
            </div>
            <button className="btn btn-danger btn-sm" disabled>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="profile-footer">
        <p className="text-muted">
          <strong>SpendWise v1.0</strong> • Your personal expense tracking assistant
        </p>
        <p className="text-muted" style={{ fontSize: '12px', marginTop: '8px' }}>
          All your data is secure and isolated to your account. We use industry-standard encryption.
        </p>
      </div>
    </div>
  );
}

export default Profile;
