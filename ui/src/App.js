import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          <h1>TrackEx</h1>
          <ul>
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
      </div>
    </Router>
  );
}

export default App;
