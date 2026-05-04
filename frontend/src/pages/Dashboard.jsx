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

const isObjectId = (value) => {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
};

const getCategoryName = (category, categories) => {
  if (!category) return "-";
  if (typeof category === "object" && category.name) return category.name;
  if (typeof category === "string") {
    const matchedCategory = categories.find(item => item._id === category || item.id === category);
    return matchedCategory ? matchedCategory.name : "-";
  }
  return "-";
};

const getPaymentMethodName = (paymentMethod, paymentMethods) => {
  if (!paymentMethod) return "-";
  if (typeof paymentMethod === "object" && paymentMethod.name) return paymentMethod.name;
  if (typeof paymentMethod === "string") {
    const matchedPaymentMethod = paymentMethods.find(item => item._id === paymentMethod || item.id === paymentMethod);
    return matchedPaymentMethod ? matchedPaymentMethod.name : "-";
  }
  return "-";
};

const isSameMonth = (dateValue, selectedMonthDate) => {
  if (!dateValue) return false;
  const recordDate = new Date(dateValue);
  return (
    recordDate.getMonth() === selectedMonthDate.getMonth() &&
    recordDate.getFullYear() === selectedMonthDate.getFullYear()
  );
};

const normalizeArray = (response) => {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.records)) return response.records;
  return [];
};

const isNotPaid = (item) => {
  return item.isPaid === false || item.isPaid === "false" || item.isPaid === undefined || item.isPaid === null;
};

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
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

  const chartData = [
    { name: 'Income', value: monthTotalIncome, color: '#10b981' },
    { name: 'Expense', value: monthTotalExpense, color: '#ef4444' }
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
          <Link to="/transactions/income/add" className="btn btn-primary" style={{ backgroundColor: '#10b981', border: 'none' }}>+ Add Income</Link>
          <Link to="/transactions/expense/add" className="btn btn-primary" style={{ backgroundColor: '#ef4444', border: 'none' }}>+ Add Expense</Link>
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
              <div className="card-amount" style={{ color: dashboardStats.currentBalance < 0 ? '#ef4444' : '#4f46e5' }}>
                {dashboardStats.currentBalance < 0 ? '-' : ''}{formatAmount(dashboardStats.currentBalance)}
              </div>
            </div>
            <div className="summary-card">
              <div className="card-title">Monthly Income</div>
              <div className="card-amount" style={{ color: '#10b981' }}>{formatAmount(monthTotalIncome)}</div>
            </div>
            <div className="summary-card">
              <div className="card-title">Monthly Expense</div>
              <div className="card-amount" style={{ color: '#ef4444' }}>{formatAmount(monthTotalExpense)}</div>
            </div>
            <div className="summary-card">
              <div className="card-title">Monthly Balance</div>
              <div className="card-amount" style={{ color: monthCurrentBalance < 0 ? '#ef4444' : '#10b981' }}>
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
                  <div className="due-amount" style={{ color: '#059669' }}>{formatAmount(dashboardStats.pendingLentMoney)}</div>
                  <Link to="/due-tracker/lent/add" className="btn btn-secondary btn-sm" style={{ marginTop: '12px', display: 'inline-block' }}>+ Add Lent Money</Link>
                </div>
                <div className="due-item">
                  <div className="due-label">Pending Borrowed Money</div>
                  <div className="due-amount" style={{ color: '#dc2626' }}>{formatAmount(dashboardStats.pendingBorrowedMoney)}</div>
                  <Link to="/due-tracker/borrowed/add" className="btn btn-secondary btn-sm" style={{ marginTop: '12px', display: 'inline-block' }}>+ Add Borrowed Money</Link>
                </div>
              </div>
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
                        typeBadgeBg = '#d1fae5';
                        typeBadgeColor = '#065f46';
                        amountColor = '#10b981';
                        amountSign = '+';
                      } else if (isExpense) {
                        typeBadgeLabel = 'Expense';
                        typeBadgeBg = '#fee2e2';
                        typeBadgeColor = '#991b1b';
                        amountColor = '#ef4444';
                        amountSign = '-';
                      } else if (isLent) {
                        typeBadgeLabel = 'Lent';
                        typeBadgeBg = '#fef3c7'; // yellow
                        typeBadgeColor = '#92400e';
                        amountColor = '#ef4444'; // money went out
                        amountSign = '-';
                      } else if (isBorrowed) {
                        typeBadgeLabel = 'Borrowed';
                        typeBadgeBg = '#e0e7ff'; // indigo
                        typeBadgeColor = '#3730a3';
                        amountColor = '#10b981'; // money came in
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
        .month-selector { display: flex; align-items: center; background: #f3f4f6; border-radius: 8px; padding: 6px; }
        .month-btn { background: transparent; border: none; padding: 6px 12px; font-weight: 500; color: #4b5563; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
        .month-btn:hover:not(:disabled) { background: #e5e7eb; color: #111827; }
        .month-display { font-weight: 600; color: #111827; margin: 0 16px; min-width: 120px; text-align: center; }
        .quick-actions { display: flex; gap: 12px; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .summary-card { background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); border: 1px solid #f3f4f6; }
        .summary-card .card-title { font-size: 0.85rem; font-weight: 600; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .summary-card .card-amount { font-size: 1.7rem; font-weight: 700; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .dashboard-card { background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); border: 1px solid #f3f4f6; }
        .section-title { font-size: 1.1rem; font-weight: 600; color: #111827; margin-bottom: 20px; }
        .due-summary-container { display: flex; flex-direction: column; gap: 16px; }
        .due-item { background: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; }
        .due-label { font-size: 0.9rem; font-weight: 600; color: #4b5563; margin-bottom: 8px; }
        .due-amount { font-size: 1.5rem; font-weight: 700; }
        @media (max-width: 1024px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } .dashboard-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .summary-grid { grid-template-columns: 1fr; } .desktop-only { display: none; } }
      `}</style>
    </div>
  );
};

export default Dashboard;
