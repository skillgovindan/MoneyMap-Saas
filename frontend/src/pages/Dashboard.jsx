import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import balanceService from '../services/balanceService';
import * as incomeService from '../services/incomeService';
import * as expenseService from '../services/expenseService';
import * as lentMoneyService from '../services/lentMoneyService';
import * as borrowedMoneyService from '../services/borrowedMoneyService';
import * as categoryService from '../services/categoryService';
import * as paymentMethodService from '../services/paymentMethodService';

function isObjectId(value) {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
}

function getCategoryName(category, categories) {
  if (!category) return "-";
  if (typeof category === "object" && category.name) return category.name;
  if (typeof category === "string") {
    const matchedCategory = categories.find(item => item._id === category || item.id === category);
    return matchedCategory ? matchedCategory.name : "-";
  }
  return "-";
}

function getPaymentMethodName(paymentMethod, paymentMethods) {
  if (!paymentMethod) return "-";
  if (typeof paymentMethod === "object" && paymentMethod.name) return paymentMethod.name;
  if (typeof paymentMethod === "string") {
    const matchedPaymentMethod = paymentMethods.find(item => item._id === paymentMethod || item.id === paymentMethod);
    return matchedPaymentMethod ? matchedPaymentMethod.name : "-";
  }
  return "-";
}

function isSameMonth(dateValue, selectedMonthDate) {
  if (!dateValue) return false;
  const recordDate = new Date(dateValue);
  return (
    recordDate.getMonth() === selectedMonthDate.getMonth() &&
    recordDate.getFullYear() === selectedMonthDate.getFullYear()
  );
}

function normalizeArray(response) {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.records)) return response.records;
  return [];
}

function isNotPaid(item) {
  return item.isPaid === false || item.isPaid === "false" || item.isPaid === undefined || item.isPaid === null;
}

// ── Demo mode constants (module-level, computed once) ────────────────────────
// ── Demo mode function ────────────────────────────────────────────────────────
const DEMO_TOKEN = 'demo-access-token';

function getDemoData() {
  const _now = new Date();
  function _daysAgo(days, monthOffset = 0) {
    const dt = new Date(_now);
    dt.setMonth(dt.getMonth() + monthOffset);
    dt.setDate(dt.getDate() - days);
    return dt.toISOString();
  }

  const DEMO_CATEGORIES = [
    { _id: 'c1', name: 'Salary' }, { _id: 'c2', name: 'Freelance' },
    { _id: 'c3', name: 'Food & Dining' }, { _id: 'c4', name: 'Transport' },
    { _id: 'c5', name: 'Shopping' }, { _id: 'c6', name: 'Utilities' },
    { _id: 'c7', name: 'Entertainment' }, { _id: 'c8', name: 'Healthcare' },
  ];
  const DEMO_PAYMENT_METHODS = [
    { _id: 'p1', name: 'UPI' }, { _id: 'p2', name: 'Cash' },
    { _id: 'p3', name: 'Credit Card' }, { _id: 'p4', name: 'Net Banking' },
  ];
  const DEMO_INCOME = [
    { _id: 'i1', amount: 65000, category: 'c1', paymentMethod: 'p4', date: _daysAgo(3),       description: 'Monthly salary' },
    { _id: 'i2', amount: 12000, category: 'c2', paymentMethod: 'p1', date: _daysAgo(10),      description: 'Website project' },
    { _id: 'i3', amount: 8500,  category: 'c2', paymentMethod: 'p1', date: _daysAgo(18),      description: 'Logo design' },
    { _id: 'i4', amount: 65000, category: 'c1', paymentMethod: 'p4', date: _daysAgo(3, -1),   description: 'Monthly salary' },
    { _id: 'i5', amount: 9000,  category: 'c2', paymentMethod: 'p1', date: _daysAgo(12, -1),  description: 'App UI work' },
  ];
  const DEMO_EXPENSE = [
    { _id: 'e1', amount: 4200, category: 'c3', paymentMethod: 'p1', date: _daysAgo(2),       description: 'Groceries & dining out' },
    { _id: 'e2', amount: 1800, category: 'c4', paymentMethod: 'p2', date: _daysAgo(5),       description: 'Cab & auto rides' },
    { _id: 'e3', amount: 7500, category: 'c5', paymentMethod: 'p3', date: _daysAgo(8),       description: 'Clothing & accessories' },
    { _id: 'e4', amount: 2100, category: 'c6', paymentMethod: 'p1', date: _daysAgo(11),      description: 'Electricity & internet' },
    { _id: 'e5', amount: 1200, category: 'c7', paymentMethod: 'p2', date: _daysAgo(14),      description: 'Movies & OTT subscriptions' },
    { _id: 'e6', amount: 950,  category: 'c8', paymentMethod: 'p1', date: _daysAgo(20),      description: 'Doctor consultation' },
    { _id: 'e7', amount: 3800, category: 'c3', paymentMethod: 'p1', date: _daysAgo(4, -1),   description: 'Restaurant & groceries' },
    { _id: 'e8', amount: 5200, category: 'c5', paymentMethod: 'p3', date: _daysAgo(9, -1),   description: 'Electronics' },
    { _id: 'e9', amount: 1600, category: 'c4', paymentMethod: 'p2', date: _daysAgo(15, -1),  description: 'Fuel' },
  ];
  const DEMO_LENT = [
    { _id: 'l1', amount: 5000, personName: 'Arjun',   takenDate: _daysAgo(15), isPaid: false, notes: 'Personal loan' },
    { _id: 'l2', amount: 2000, personName: 'Priya',   takenDate: _daysAgo(30), isPaid: true,  notes: 'Lunch money' },
  ];
  const DEMO_BORROWED = [
    { _id: 'b1', amount: 3000, personName: 'Karthik', takenDate: _daysAgo(20), isPaid: false, notes: 'Emergency cash' },
  ];

  return { DEMO_CATEGORIES, DEMO_PAYMENT_METHODS, DEMO_INCOME, DEMO_EXPENSE, DEMO_LENT, DEMO_BORROWED };
}
// ─────────────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const [allIncome, setAllIncome] = useState([]);
  const [allExpense, setAllExpense] = useState([]);
  const [allLent, setAllLent] = useState([]);
  const [allBorrowed, setAllBorrowed] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  // Dashboard calculation states
  const [dashboardStats, setDashboardStats] = useState({
    pendingLentMoney: 0,
    pendingBorrowedMoney: 0,
    currentBalance: 0
  });

  const isDemo = localStorage.getItem('token') === DEMO_TOKEN;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      // ── DEMO MODE: skip API, load mock data ────────────────────────────
      if (isDemo) {
        const demoData = getDemoData();
        setCategories(demoData.DEMO_CATEGORIES);
        setPaymentMethods(demoData.DEMO_PAYMENT_METHODS);
        setAllIncome(demoData.DEMO_INCOME);
        setAllExpense(demoData.DEMO_EXPENSE);
        setAllLent(demoData.DEMO_LENT);
        setAllBorrowed(demoData.DEMO_BORROWED);
        
        const pendingLent = demoData.DEMO_LENT.filter(isNotPaid).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const pendingBorrowed = demoData.DEMO_BORROWED.filter(isNotPaid).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        
        const incSum = demoData.DEMO_INCOME.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
        const expSum = demoData.DEMO_EXPENSE.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

        setDashboardStats({
          pendingLentMoney:     pendingLent,
          pendingBorrowedMoney: pendingBorrowed,
          currentBalance:       incSum - expSum - pendingLent + pendingBorrowed,
        });
        setLoading(false);
        return;
      }
      // ──────────────────────────────────────────────────────────────────

      try {
        const [
          incomeData,
          expenseData,
          lentData,
          borrowedData,
          categoriesData,
          paymentMethodsData
        ] = await Promise.allSettled([
          incomeService.getAllIncome(),
          expenseService.getAllExpense(),
          lentMoneyService.getAllLentMoney(),
          borrowedMoneyService.getAllBorrowedMoney(),
          categoryService.getAllCategories(),
          paymentMethodService.getAllPaymentMethods()
        ]);

        if (incomeData.status === 'rejected') throw new Error(incomeData.reason?.message || "Failed to load income data");
        if (expenseData.status === 'rejected') throw new Error(expenseData.reason?.message || "Failed to load expense data");

        const normalizedIncome = incomeData.status === 'fulfilled' ? normalizeArray(incomeData.value) : [];
        const normalizedExpense = expenseData.status === 'fulfilled' ? normalizeArray(expenseData.value) : [];
        const normalizedLent = lentData.status === 'fulfilled' ? normalizeArray(lentData.value) : [];
        const normalizedBorrowed = borrowedData.status === 'fulfilled' ? normalizeArray(borrowedData.value) : [];
        
        const normalizedCategories = categoriesData.status === 'fulfilled' ? normalizeArray(categoriesData.value) : [];
        const normalizedPaymentMethods = paymentMethodsData.status === 'fulfilled' ? normalizeArray(paymentMethodsData.value) : [];

        setAllIncome(normalizedIncome);
        setAllExpense(normalizedExpense);
        setAllLent(normalizedLent);
        setAllBorrowed(normalizedBorrowed);
        setCategories(normalizedCategories);
        setPaymentMethods(normalizedPaymentMethods);

        // 1. Calculate All-time Income & Expense
        const totalIncome = normalizedIncome.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const totalExpense = normalizedExpense.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        // 2. Calculate Pending Dues
        const pendingLent = normalizedLent
          .filter(isNotPaid)
          .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        const pendingBorrowed = normalizedBorrowed
          .filter(isNotPaid)
          .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        // 3. Calculate Overall Current Balance
        // Lent Money decreases balance because money went out.
        // Borrowed Money increases balance because money came in.
        const currentBalance = totalIncome - totalExpense - pendingLent + pendingBorrowed;

        setDashboardStats({
          pendingLentMoney: pendingLent,
          pendingBorrowedMoney: pendingBorrowed,
          currentBalance: currentBalance
        });

      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const handlePrevMonth = () => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const isNextMonthDisabled = () => {
    const now = new Date();
    return (
      selectedMonth.getMonth() === now.getMonth() &&
      selectedMonth.getFullYear() === now.getFullYear()
    );
  };

  // Calculations for Selected Month
  const filteredIncome = allIncome.filter(i => isSameMonth(i.date || i.createdAt, selectedMonth));
  const filteredExpense = allExpense.filter(e => isSameMonth(e.date || e.createdAt, selectedMonth));
  const filteredLent = allLent.filter(l => isSameMonth(l.takenDate || l.createdAt, selectedMonth));
  const filteredBorrowed = allBorrowed.filter(b => isSameMonth(b.takenDate || b.createdAt, selectedMonth));

  const monthTotalIncome = filteredIncome.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const monthTotalExpense = filteredExpense.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const monthCurrentBalance = monthTotalIncome - monthTotalExpense;

  const getInsights = () => {
    const insightsList = [];
    const savingsRate = monthTotalIncome > 0 ? (monthCurrentBalance / monthTotalIncome) * 100 : 0;

    if (monthTotalExpense > monthTotalIncome && monthTotalIncome > 0) {
      insightsList.push({ id: 1, type: 'warning', text: 'You have spent more than you earned this month. Consider reviewing your recent expenses.', color: 'var(--expense-color)', bg: 'var(--bg-danger-light)', border: 'var(--expense-color)' });
    } else if (savingsRate >= 20) {
      insightsList.push({ id: 2, type: 'success', text: `Great job! You've saved ${savingsRate.toFixed(1)}% of your income this month.`, color: 'var(--income-color)', bg: 'var(--bg-success-light)', border: 'var(--income-color)' });
    } else if (savingsRate > 0 && savingsRate < 20) {
      insightsList.push({ id: 3, type: 'info', text: `You've saved ${savingsRate.toFixed(1)}% of your income. Try aiming for 20% by cutting unnecessary expenses.`, color: 'var(--primary)', bg: '#eff6ff', border: '#bfdbfe' });
    }

    if (dashboardStats.pendingBorrowedMoney > 0) {
      insightsList.push({ id: 4, type: 'warning', text: `You have ${formatAmount(dashboardStats.pendingBorrowedMoney)} in outstanding borrowed money. Prioritize paying off debts.`, color: 'var(--expense-color)', bg: 'var(--bg-danger-light)', border: 'var(--expense-color)' });
    }

    if (insightsList.length === 0) {
      insightsList.push({ id: 5, type: 'info', text: 'Track more income and expenses to receive personalized financial insights.', color: 'var(--text-secondary)', bg: 'var(--bg-hover)', border: 'var(--border)' });
    }
    
    return insightsList;
  };

  const insights = getInsights();

  const chartData = [
    { name: 'Income', value: monthTotalIncome, color: 'var(--income-color)' },
    { name: 'Expense', value: monthTotalExpense, color: 'var(--expense-color)' }
  ].filter(item => item.value > 0);

  const combinedTransactions = [
    ...filteredIncome.map(i => ({ 
      ...i, 
      type: 'income', 
      category: i.category,
      amount: i.amount,
      date: i.date || i.createdAt, 
      createdAt: i.createdAt,
      paymentMethod: i.paymentMethod,
      notes: i.description
    })),
    ...filteredExpense.map(e => ({ 
      ...e, 
      type: 'expense', 
      category: e.category,
      amount: e.amount,
      date: e.date || e.createdAt, 
      createdAt: e.createdAt,
      paymentMethod: e.paymentMethod,
      notes: e.description
    })),
    ...filteredLent.map(l => ({ 
      ...l, 
      type: 'lent', 
      category: "Lent Money",
      amount: l.amount,
      date: l.takenDate || l.createdAt, 
      createdAt: l.createdAt,
      paymentMethod: null,
      status: isNotPaid(l) ? "Not Paid" : "Paid",
      notes: l.notes
    })),
    ...filteredBorrowed.map(b => ({ 
      ...b, 
      type: 'borrowed', 
      category: "Borrowed Money",
      amount: b.amount,
      date: b.takenDate || b.createdAt, 
      createdAt: b.createdAt,
      paymentMethod: null,
      status: isNotPaid(b) ? "Not Paid" : "Paid",
      notes: b.notes
    }))
  ];

  const recentTransactions = combinedTransactions
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 10);

  const formatAmount = (amount) => {
    return '₹' + Math.abs(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="dashboard-container">
      <div className="page-header" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Overview of your income, expenses, balance, and dues.</p>
        </div>
        
        <div className="month-selector">
          <button className="month-btn" onClick={handlePrevMonth}>
            &lt; Previous
          </button>
          <span className="month-display">
            {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            className="month-btn" 
            onClick={handleNextMonth} 
            disabled={isNextMonthDisabled()}
            style={{ opacity: isNextMonthDisabled() ? 0.4 : 1, cursor: isNextMonthDisabled() ? 'not-allowed' : 'pointer' }}
          >
            Next &gt;
          </button>
        </div>

        <div className="quick-actions desktop-only">
          <Link to="/transactions/income/add" className="btn btn-primary" style={{ backgroundColor: 'var(--income-color)', border: 'none' }}>+ Add Income</Link>
          <Link to="/transactions/expense/add" className="btn btn-primary" style={{ backgroundColor: 'var(--expense-color)', border: 'none' }}>+ Add Expense</Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading dashboard...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <div className="card-title">Current Balance (Overall)</div>
              <div className="card-amount" style={{ color: 'var(--text-primary)' }}>
                {dashboardStats.currentBalance < 0 ? '-' : ''}{formatAmount(dashboardStats.currentBalance)}
              </div>
            </div>
            <div className="summary-card">
              <div className="card-title">Monthly Income</div>
              <div className="card-amount" style={{ color: 'var(--income-color)' }}>{formatAmount(monthTotalIncome)}</div>
            </div>
            <div className="summary-card">
              <div className="card-title">Monthly Expense</div>
              <div className="card-amount" style={{ color: 'var(--expense-color)' }}>{formatAmount(monthTotalExpense)}</div>
            </div>
            <div className="summary-card">
              <div className="card-title">Monthly Balance</div>
              <div className="card-amount" style={{ color: 'var(--text-primary)' }}>
                {monthCurrentBalance < 0 ? '-' : ''}{formatAmount(monthCurrentBalance)}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Chart Section */}
            <div className="dashboard-card chart-card">
              <h2 className="section-title">Income vs Expense ({selectedMonth.toLocaleString('default', { month: 'short' })})</h2>
              {chartData.length > 0 ? (
                <div style={{ width: '100%', height: '250px' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatAmount(value)} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="empty-state" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No data available for this month</div>
              )}
            </div>

            {/* Due Tracker Summary */}
            <div className="dashboard-card due-card">
              <h2 className="section-title">Pending Dues</h2>
              <div className="due-summary-container">
                <div className="due-item">
                  <div className="due-label">Pending Lent Money</div>
                  <div className="due-amount" style={{ color: 'var(--income-color)' }}>{formatAmount(dashboardStats.pendingLentMoney)}</div>
                  <Link to="/due-tracker/lent/add" className="btn btn-secondary btn-sm" style={{ marginTop: '12px', display: 'inline-block' }}>+ Add Lent Money</Link>
                </div>
                <div className="due-item">
                  <div className="due-label">Pending Borrowed Money</div>
                  <div className="due-amount" style={{ color: 'var(--expense-color)' }}>{formatAmount(dashboardStats.pendingBorrowedMoney)}</div>
                  <Link to="/due-tracker/borrowed/add" className="btn btn-secondary btn-sm" style={{ marginTop: '12px', display: 'inline-block' }}>+ Add Borrowed Money</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Insights */}
          <div className="dashboard-card insights-card" style={{ marginBottom: '24px' }}>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Financial Insights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {insights.map(insight => (
                <div key={insight.id} style={{ 
                  padding: '14px 18px', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: insight.bg, 
                  color: insight.color, 
                  fontSize: '0.9rem', 
                  fontWeight: 500, 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  border: `1px solid ${insight.border}` 
                }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: insight.color,
                    display: 'inline-block',
                    flexShrink: 0,
                    marginTop: '6px'
                  }}></span>
                  <span style={{ lineHeight: 1.5 }}>{insight.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="dashboard-card transactions-card">
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Recent Transactions ({selectedMonth.toLocaleString('default', { month: 'long' })})</h2>
            {recentTransactions.length === 0 ? (
              <div className="empty-state">No recent transactions found for this month.</div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Payment Method / Status</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((t, i) => {
                      const isIncome = t.type === 'income';
                      const isExpense = t.type === 'expense';
                      const isLent = t.type === 'lent';
                      const isBorrowed = t.type === 'borrowed';
                      
                      let categoryDisplay = "-";
                      if (isIncome || isExpense) {
                        categoryDisplay = getCategoryName(t.category, categories);
                      } else {
                        categoryDisplay = t.category; // "Lent Money" or "Borrowed Money"
                      }

                      let typeBadgeColor = "";
                      let typeBadgeBg = "";
                      let typeBadgeLabel = "";
                      let amountColor = "";
                      let amountSign = "";

                      if (isIncome) {
                        typeBadgeLabel = 'Income';
                        typeBadgeBg = 'var(--bg-success-light)';
                        typeBadgeColor = 'var(--income-color)';
                        amountColor = 'var(--income-color)';
                        amountSign = '+';
                      } else if (isExpense) {
                        typeBadgeLabel = 'Expense';
                        typeBadgeBg = 'var(--bg-danger-light)';
                        typeBadgeColor = 'var(--expense-color)';
                        amountColor = 'var(--expense-color)';
                        amountSign = '-';
                      } else if (isLent) {
                        typeBadgeLabel = 'Lent';
                        typeBadgeBg = '#f8fafc';
                        typeBadgeColor = 'var(--text-secondary)';
                        amountColor = 'var(--expense-color)'; // money went out
                        amountSign = '-';
                      } else if (isBorrowed) {
                        typeBadgeLabel = 'Borrowed';
                        typeBadgeBg = '#eff6ff'; // blue
                        typeBadgeColor = 'var(--primary)';
                        amountColor = 'var(--income-color)'; // money came in
                        amountSign = '+';
                      }

                      let pmDisplay = "-";
                      if (isIncome || isExpense) {
                        pmDisplay = getPaymentMethodName(t.paymentMethod, paymentMethods);
                      } else {
                        pmDisplay = t.status;
                      }

                      // Use index as fallback key since _id might clash across collections
                      return (
                        <tr key={t._id || `fallback-${i}`}>
                          <td>
                            <div style={{ fontWeight: 500, color: '#111827' }}>
                              {categoryDisplay}
                            </div>
                          </td>
                          <td>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 600,
                              backgroundColor: typeBadgeBg,
                              color: typeBadgeColor
                            }}>
                              {typeBadgeLabel}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              color: t.status === "Not Paid" ? "#dc2626" : (t.status === "Paid" ? "#059669" : "inherit"),
                              fontWeight: t.status === "Not Paid" || t.status === "Paid" ? 600 : 400
                            }}>
                              {pmDisplay}
                            </span>
                          </td>
                          <td>{formatDate(t.date)}</td>
                          <td style={{ textAlign: 'right', fontWeight: '600', color: amountColor }}>
                            {amountSign} {formatAmount(t.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        .dashboard-container { width: 100%; }
        .month-selector { display: flex; align-items: center; background: var(--bg-hover); border-radius: 8px; padding: 6px; border: 1px solid var(--border); }
        .month-btn { background: transparent; border: none; padding: 6px 12px; font-weight: 500; color: var(--text-secondary); border-radius: 4px; cursor: pointer; transition: background 0.2s; }
        .month-btn:hover:not(:disabled) { background: var(--border); color: var(--text-primary); }
        .month-display { font-weight: 600; color: var(--text-primary); margin: 0 16px; min-width: 120px; text-align: center; }
        .quick-actions { display: flex; gap: 12px; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .summary-card { background: var(--bg-card); border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); border: 1px solid var(--border); }
        .summary-card .card-title { font-size: 0.85rem; font-weight: 600; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .summary-card .card-amount { font-size: 1.7rem; font-weight: 700; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .dashboard-card { background: var(--bg-card); border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); border: 1px solid var(--border); }
        .section-title { font-size: 1.1rem; font-weight: 600; color: #111827; margin-bottom: 20px; }
        .due-summary-container { display: flex; flex-direction: column; gap: 16px; }
        .due-item { background: var(--bg-card); border: 1px solid var(--border); padding: 16px; border-radius: 8px; }
        .due-label { font-size: 0.9rem; font-weight: 600; color: #4b5563; margin-bottom: 8px; }
        .due-amount { font-size: 1.5rem; font-weight: 700; }
        @media (max-width: 1024px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } .dashboard-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .summary-grid { grid-template-columns: 1fr; } .desktop-only { display: none; } }
      `}</style>
    </div>
  );
};

export default Dashboard;
