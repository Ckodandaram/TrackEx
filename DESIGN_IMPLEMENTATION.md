# 🎨 SpendWise UI Implementation Guide

## **Overview**

SpendWise features a modern, polished interface designed for clarity, engagement, and effortless financial tracking. This guide covers the complete implementation of the design system.

---

## **Quick Start**

### **1. Import Design System**
Add to your React app's main file (`App.js`):
```javascript
import './styles/design-system.css';
```

### **2. Use Predefined Classes**
All components use semantic CSS classes. Examples:
```jsx
<button className="btn btn-primary">Save</button>
<div className="card">Content here</div>
<div className="stat-card">₹45,230</div>
```

---

## **Color System Implementation**

### **Light Mode (Default)**
```css
Background: #FFFFFF
Surface: #F3F4F6
Text: #1F2937
Secondary Text: #6B7280
```

### **Dark Mode**
Enable with data attribute:
```html
<body data-theme="dark">
  <!-- All content automatically adapts -->
</body>
```

### **Using Colors in Components**
```css
/* Use CSS variables */
.my-component {
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}
```

---

## **Component Examples**

### **1. Dashboard Header**
```jsx
<div className="dashboard-header">
  <h1>Hi, there! 👋</h1>
  <p className="text-muted">Track and manage your spending wisely</p>
</div>
```

### **2. Stat Cards**
```jsx
<div className="grid grid-2">
  <div className="stat-card">
    <div className="stat-label">Total Spent This Month</div>
    <div className="stat-value">₹45,230</div>
    <div className="stat-change">↗️ +12% from last month</div>
  </div>

  <div className="stat-card success">
    <div className="stat-label">Budget Remaining</div>
    <div className="stat-value">₹12,770</div>
    <div className="stat-change">Out of ₹58,000</div>
  </div>
</div>
```

### **3. Budget Progress Bar**
```jsx
<div className="card">
  <div className="flex-between mb-3">
    <h3>Budget Status</h3>
    <span className="text-muted">75% Used</span>
  </div>
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: '75%' }}></div>
  </div>
</div>
```

### **4. Transaction List**
```jsx
<div className="card">
  <h3 className="mb-3">Recent Transactions</h3>
  {expenses.map((expense) => (
    <div key={expense._id} className="transaction-item">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="transaction-icon">🍔</div>
        <div className="transaction-details">
          <div className="transaction-title">Lunch @ Cafe</div>
          <div className="transaction-time">Today 12:45 PM</div>
        </div>
      </div>
      <div className="transaction-amount">−₹350</div>
    </div>
  ))}
</div>
```

### **5. Form Inputs**
```jsx
<form className="form">
  <div className="input-group">
    <label>Amount</label>
    <input type="number" placeholder="0.00" step="0.01" />
  </div>

  <div className="input-group">
    <label>Category</label>
    <select>
      <option>Food</option>
      <option>Transport</option>
      <option>Shopping</option>
    </select>
  </div>

  <div className="form-row">
    <div className="input-group">
      <label>Date</label>
      <input type="date" />
    </div>
    <div className="input-group">
      <label>Time</label>
      <input type="time" />
    </div>
  </div>

  <button className="btn btn-primary">Save Expense</button>
</form>
```

### **6. Buttons**
```jsx
<button className="btn btn-primary">Primary Action</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-danger">Delete</button>
<button className="btn btn-ghost">Cancel</button>
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### **7. Cards & Layouts**
```jsx
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
    <button className="btn btn-sm btn-ghost">Action</button>
  </div>
  <div className="card-content">
    {/* Content here */}
  </div>
  <div className="card-footer">
    <button className="btn btn-secondary">Cancel</button>
    <button className="btn btn-primary">Save</button>
  </div>
</card>
```

### **8. Toast Notifications**
```jsx
<div className="toast success">
  <span>✓ Expense saved successfully</span>
</div>

<div className="toast error">
  <span>❌ Failed to save expense</span>
</div>
```

### **9. Empty States**
```jsx
<div className="empty-state">
  <div className="empty-state-icon">💸</div>
  <div className="empty-state-title">No Expenses Yet</div>
  <div className="empty-state-description">
    Start tracking your spending by adding your first expense!
  </div>
  <button className="btn btn-primary mt-3">Add Expense</button>
</div>
```

### **10. Loading States**
```jsx
<div className="skeleton" style={{ height: '100px' }}></div>
<div className="skeleton" style={{ height: '300px' }}></div>
```

---

## **Grid System**

### **Responsive Grids**
```jsx
<div className="grid grid-2">
  {/* 2 columns on desktop, 1 on mobile */}
</div>

<div className="grid grid-3">
  {/* 3 columns on desktop, 1 on mobile */}
</div>

<div className="grid grid-4">
  {/* 4 columns on desktop, 1 on mobile */}
</div>
```

### **Flexible Layout**
```jsx
<div className="flex">
  {/* Flex with gap */}
</div>

<div className="flex-between">
  {/* Flex with space-between and center alignment */}
</div>

<div className="flex-center">
  {/* Flex with center alignment */}
</div>
```

---

## **Spacing Utilities**

### **Margin Top**
```css
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 16px; }
.mt-4 { margin-top: 24px; }
```

### **Margin Bottom**
```css
.mb-1 { margin-bottom: 4px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 16px; }
.mb-4 { margin-bottom: 24px; }
```

---

## **Text Utilities**

```jsx
<p className="text-center">Centered text</p>
<p className="text-right">Right-aligned</p>
<p className="text-muted">Muted secondary text</p>
<p className="font-bold">Bold text</p>
<p className="font-semibold">Semibold text</p>
```

---

## **Responsive Design Breakpoints**

| Device | Width | Example |
|--------|-------|---------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px - 1024px | Two columns |
| Desktop | > 1024px | Three+ columns |

### **Mobile-First Approach**
```css
/* Mobile (base) */
.grid-2 {
  grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## **Dark Mode Integration**

### **Enable Dark Mode Toggle**
```jsx
const [theme, setTheme] = useState('light');

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
};

return (
  <button onClick={toggleTheme}>
    {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
  </button>
);
```

---

## **Animation & Transitions**

### **Hover Effects**
```css
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
}
```

### **Fast Transitions**
```css
transition: all var(--transition-fast); /* 200ms */
transition: all var(--transition-base); /* 300ms */
transition: all var(--transition-slow); /* 500ms */
```

---

## **Accessibility**

### **Focus Indicators**
```css
:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}
```

### **Screen Reader Only Text**
```jsx
<span className="sr-only">Navigation Menu</span>
```

### **Semantic HTML**
```jsx
<button className="btn">Click me</button>
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

---

## **Chart Integration (Recharts)**

### **Chart Container**
```jsx
<div className="chart-container">
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      {/* Chart components */}
    </PieChart>
  </ResponsiveContainer>
</div>
```

### **Tooltip Styling**
The design system automatically styles Recharts tooltips with dark background and white text.

---

## **Best Practices**

✅ **Always use CSS variables** for colors and spacing
✅ **Use semantic HTML** for accessibility
✅ **Test on mobile** before considering complete
✅ **Leverage utility classes** for quick layouts
✅ **Check contrast ratios** (minimum 4.5:1 for text)
✅ **Use focus-visible** for keyboard navigation
✅ **Keep animations under 400ms** for responsiveness
✅ **Use rem units** for scalability
✅ **Test with screen readers** (NVDA, JAWS, VoiceOver)
✅ **Validate forms** before submission

---

## **File Organization**

```
ui/src/
├── styles/
│   ├── design-system.css       ← Global design tokens
│   ├── App.css                 ← App-level styles
│   ├── Dashboard.css           ← Page-specific styles
│   ├── AddExpense.css
│   └── Analytics.css
├── components/                  ← Reusable components
│   ├── Button.js
│   ├── Card.js
│   └── ...
├── pages/
│   ├── Dashboard.js
│   ├── AddExpense.js
│   └── Analytics.js
└── App.js
```

---

## **Performance Tips**

1. **Minimize CSS reflows** – Use CSS Grid/Flex
2. **Lazy load images** – Use `loading="lazy"`
3. **Optimize animations** – Use `transform` and `opacity` only
4. **CSS-in-JS cautiously** – Inline critical styles only
5. **Monitor bundle size** – Keep CSS modular

---

## **Support & Questions**

For questions about the design system, refer to the main `UI_UX_DESIGN.md` document.

---
