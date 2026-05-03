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

const getTransactionTitle = (transaction, categories) => {
  const category = transaction.category;

  if (category && typeof category === "object" && category.name) {
    return category.name;
  }

  if (category && typeof category === "string") {
    const matchedCategory = categories.find(
      (item) => item._id === category || item.id === category
    );
    if (matchedCategory) return matchedCategory.name;
  }

  if (transaction.title && !isObjectId(transaction.title)) {
    return transaction.title;
  }

  return "-";
};

const getPaymentMethodName = (paymentMethod, paymentMethods) => {
  if (!paymentMethod) return "-";

  if (typeof paymentMethod === "object" && paymentMethod.name) {
    return paymentMethod.name;
  }

  if (typeof paymentMethod === "string") {
    const matchedPaymentMethod = paymentMethods.find(
      (item) => item._id === paymentMethod || item.id === paymentMethod
    );
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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const [allIncome, setAllIncome] = useState([]);
  const [allExpense, setAllExpense] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [dues, setDues] = useState({ pendingLent: 0, pendingBorrowed: 0 });
  const [allTimeBalance, setAllTimeBalance] = useState({ totalIncome: 0, totalExpense: 0 });

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
          paymentMethodsData,
          balanceData
        ] = await Promise.allSettled([
          incomeService.getAllIncome(),
          expenseService.getAllExpense(),
          lentMoneyService.getAllLentMoney(),
          borrowedMoneyService.getAllBorrowedMoney(),
          categoryService.getAllCategories(),
          paymentMethodService.getAllPaymentMethods(),
          balanceService.getBalance()
        ]);

        if (incomeData.status === 'rejected') {
          throw new Error(incomeData.reason?.message || "Failed to load income data");
        }
        if (expenseData.status === 'rejected') {
          throw new Error(expenseData.reason?.message || "Failed to load expense data");
        }

        if (incomeData.status === 'fulfilled' && incomeData.value) {
          setAllIncome(Array.isArray(incomeData.value) ? incomeData.value : (incomeData.value.data || []));
        }

        if (expenseData.status === 'fulfilled' && expenseData.value) {
          setAllExpense(Array.isArray(expenseData.value) ? expenseData.value : (expenseData.value.data || []));
        }

        if (categoriesData.status === 'fulfilled' && categoriesData.value) {
          setCategories(Array.isArray(categoriesData.value) ? categoriesData.value : (categoriesData.value.data || []));
        } else if (categoriesData.status === 'rejected') {
          console.warn("Categories API failed:", categoriesData.reason);
        }

        if (paymentMethodsData.status === 'fulfilled' && paymentMethodsData.value) {
          setPaymentMethods(Array.isArray(paymentMethodsData.value) ? paymentMethodsData.value : (paymentMethodsData.value.data || []));
        } else if (paymentMethodsData.status === 'rejected') {
          console.warn("Payment Methods API failed:", paymentMethodsData.reason);
        }

        if (lentData.status === 'fulfilled' && lentData.value) {
          const pendingLent = (Array.isArray(lentData.value) ? lentData.value : (lentData.value.data || []))
            .filter(item => !item.isPaid)
            .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
          setDues(prev => ({ ...prev, pendingLent }));
        } else if (lentData.status === 'rejected') {
          console.warn("Lent Money API failed:", lentData.reason);
          setDues(prev => ({ ...prev, pendingLent: 0 }));
        }

        if (borrowedData.status === 'fulfilled' && borrowedData.value) {
          const pendingBorrowed = (Array.isArray(borrowedData.value) ? borrowedData.value : (borrowedData.value.data || []))
            .filter(item => !item.isPaid)
            .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
          setDues(prev => ({ ...prev, pendingBorrowed }));
        } else if (borrowedData.status === 'rejected') {
          console.warn("Borrowed Money API failed:", borrowedData.reason);
          setDues(prev => ({ ...prev, pendingBorrowed: 0 }));
        }

        if (balanceData.status === 'fulfilled' && balanceData.value) {
          setAllTimeBalance(balanceData.value);
        } else if (balanceData.status === 'rejected') {
          console.warn("Balance API failed:", balanceData.reason);
        }

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

  const monthTotalIncome = filteredIncome.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const monthTotalExpense = filteredExpense.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const monthCurrentBalance = monthTotalIncome - monthTotalExpense;

  // Net Savings logic remains based on all-time balance implementation
  const netSavings = (allTimeBalance.totalIncome || 0) - (allTimeBalance.totalExpense || 0);

  const chartData = [
    { name: 'Income', value: monthTotalIncome, color: '#10b981' },
    { name: 'Expense', value: monthTotalExpense, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const recentTransactions = [
    ...filteredIncome.map(i => ({ ...i, type: 'income' })),
    ...filteredExpense.map(e => ({ ...e, type: 'expense' }))
  ]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
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
              <div className="card-title">Current Balance</div>
              <div className="card-amount" style={{ color: monthCurrentBalance < 0 ? '#ef4444' : '#4f46e5' }}>
                {monthCurrentBalance < 0 ? '-' : ''}{formatAmount(monthCurrentBalance)}
              </div>
            </div>
            <div className="summary-card">
              <div className="card-title">Total Income</div>
              <div className="card-amount" style={{ color: '#10b981' }}>{formatAmount(monthTotalIncome)}</div>
            </div>
            <div className="summary-card">
              <div className="card-title">Total Expense</div>
              <div className="card-amount" style={{ color: '#ef4444' }}>{formatAmount(monthTotalExpense)}</div>
            </div>
            <div className="summary-card">
              <div className="card-title">Net Savings (All-Time)</div>
              <div className="card-amount" style={{ color: netSavings < 0 ? '#ef4444' : '#10b981' }}>
                {netSavings < 0 ? '-' : ''}{formatAmount(netSavings)}
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
                  <div className="due-amount" style={{ color: '#059669' }}>{formatAmount(dues.pendingLent)}</div>
                  <Link to="/due-tracker/lent/add" className="btn btn-secondary btn-sm" style={{ marginTop: '12px', display: 'inline-block' }}>+ Add Lent Money</Link>
                </div>
                <div className="due-item">
                  <div className="due-label">Pending Borrowed Money</div>
                  <div className="due-amount" style={{ color: '#dc2626' }}>{formatAmount(dues.pendingBorrowed)}</div>
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
                      <th>Title / Category</th>
                      <th>Type</th>
                      <th>Payment Method</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map(t => {
                      const isIncome = t.type === 'income';
                      const title = getTransactionTitle(t, categories);
                      const paymentMethodName = getPaymentMethodName(t.paymentMethod, paymentMethods);
                      return (
                        <tr key={t._id}>
                          <td>
                            <div style={{ fontWeight: 500, color: '#111827' }}>
                              {title}
                            </div>
                            {t.notes && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{t.notes}</div>}
                          </td>
                          <td>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 600,
                              backgroundColor: isIncome ? '#d1fae5' : '#fee2e2',
                              color: isIncome ? '#065f46' : '#991b1b'
                            }}>
                              {isIncome ? 'Income' : 'Expense'}
                            </span>
                          </td>
                          <td>{paymentMethodName}</td>
                          <td>{formatDate(t.date || t.createdAt)}</td>
                          <td style={{ textAlign: 'right', fontWeight: '600', color: isIncome ? '#10b981' : '#ef4444' }}>
                            {isIncome ? '+' : '-'} {formatAmount(t.amount)}
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
        .dashboard-container {
          width: 100%;
        }

        .month-selector {
          display: flex;
          align-items: center;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 6px;
        }

        .month-btn {
          background: transparent;
          border: none;
          padding: 6px 12px;
          font-weight: 500;
          color: #4b5563;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .month-btn:hover:not(:disabled) {
          background: #e5e7eb;
          color: #111827;
        }

        .month-display {
          font-weight: 600;
          color: #111827;
          margin: 0 16px;
          min-width: 120px;
          text-align: center;
        }

        .quick-actions {
          display: flex;
          gap: 12px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border: 1px solid #f3f4f6;
        }

        .summary-card .card-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-card .card-amount {
          font-size: 1.7rem;
          font-weight: 700;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .dashboard-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border: 1px solid #f3f4f6;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
        }

        .due-summary-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .due-item {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 16px;
          border-radius: 8px;
        }

        .due-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 8px;
        }

        .due-amount {
          font-size: 1.5rem;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }
          .desktop-only {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
