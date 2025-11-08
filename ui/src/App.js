import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/design-system.css';
import './styles/App.css';

// Pages
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <a href="/" className="navbar-logo">SpendWise</a>
          </div>
          <ul className="navbar-menu">
            <li><a href="/">Dashboard</a></li>
            <li><a href="/add-expense">Add Expense</a></li>
            <li><a href="/analytics">Analytics</a></li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>

        {/* Mobile Bottom Navigation */}
        <nav className="bottom-nav" style={{ display: 'none' }}>
          <a href="/">📊 Dashboard</a>
          <a href="/add-expense">➕ Add</a>
          <a href="/analytics">📈 Analytics</a>
        </nav>

        <style>{`
          @media (max-width: 768px) {
            .navbar-menu { display: none; }
            .bottom-nav { display: flex; }
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
