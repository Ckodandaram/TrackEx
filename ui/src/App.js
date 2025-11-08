import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/design-system.css';
import './styles/App.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import AnalyticsAdvanced from './pages/Analytics_Ultra';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';


// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner">Loading...</div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Layout Component with Navbar
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="App">
      {isAuthenticated && (
        <nav className="navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <a href="/" className="navbar-logo">SpendWise</a>
          </div>
          <ul className="navbar-menu">
            <li><a href="/">Dashboard</a></li>
            <li><a href="/add-expense">Add Expense</a></li>
            <li><a href="/analytics">Analytics</a></li>
            <li><a href="/profile">👤 {user?.name || 'Profile'}</a></li>
            <li>
              <button 
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
      
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-expense" 
          element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <AnalyticsAdvanced />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
      </Routes>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <nav className="bottom-nav" style={{ display: 'none' }}>
          <a href="/">📊 Dashboard</a>
          <a href="/add-expense">➕ Add</a>
          <a href="/analytics">📈 Analytics</a>
          <a href="/profile">👤 Profile</a>
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .navbar-menu { display: none; }
          ${isAuthenticated ? '.bottom-nav { display: flex; }' : ''}
        }
        
        .spinner {
          text-align: center;
          color: var(--primary, #2563eb);
          font-size: 18px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

