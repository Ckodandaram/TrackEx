import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>TrackEx</h1>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/stories">Stories</Link>
          <Link to="/profile">Profile</Link>
          <span>Hi, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
