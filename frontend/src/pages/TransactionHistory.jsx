import React, { useState, useEffect } from 'react';
import * as incomeService from '../services/incomeService';
import * as expenseService from '../services/expenseService';
import * as categoryService from '../services/categoryService';
import * as paymentMethodService from '../services/paymentMethodService';

const formatDateKey = (dateValue) => {
  if (!dateValue) return "";
  return new Date(dateValue).toISOString().split("T")[0];
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [paymentMethodsMap, setPaymentMethodsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [incomeResponse, expenseResponse, categoryResponse, pmResponse] = await Promise.all([
        incomeService.getAllIncome(),
        expenseService.getAllExpense(),
        categoryService.getAllCategories(),
        paymentMethodService.getAllPaymentMethods()
      ]);

      const incomeData = Array.isArray(incomeResponse) ? incomeResponse : (incomeResponse.data || []);
      const expenseData = Array.isArray(expenseResponse) ? expenseResponse : (expenseResponse.data || []);
      const categoryData = Array.isArray(categoryResponse) ? categoryResponse : (categoryResponse.data || []);
      const pmData = Array.isArray(pmResponse) ? pmResponse : (pmResponse.data || []);

      const catMap = {};
      categoryData.forEach(c => { catMap[c._id] = c.name; });
      setCategoriesMap(catMap);

      const pMap = {};
      pmData.forEach(pm => { pMap[pm._id] = pm.name; });
      setPaymentMethodsMap(pMap);

      const incomes = incomeData.map(item => ({ ...item, type: 'income' }));
      const expenses = expenseData.map(item => ({ ...item, type: 'expense' }));

      const combined = [...incomes, ...expenses];

      // Sort by createdAt or date
      combined.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : (a.date ? new Date(a.date) : new Date());
        const dateB = b.createdAt ? new Date(b.createdAt) : (b.date ? new Date(b.date) : new Date());
        return dateB.getTime() - dateA.getTime();
      });

      setTransactions(combined);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryName = (field) => {
    if (!field) return '-';
    if (typeof field === 'object') return field.name || '-';
    return categoriesMap[field] || field;
  };

  const getPaymentMethodName = (field) => {
    if (!field) return '-';
    if (typeof field === 'object') return field.name || '-';
    return paymentMethodsMap[field] || field;
  };

  const filteredTransactions = transactions.filter(t => {
    let typeMatches = true;
    if (typeFilter !== 'All') {
      typeMatches = t.type.toLowerCase() === typeFilter.toLowerCase();
    }
    
    let dateMatches = true;
    if (selectedDate) {
      dateMatches = formatDateKey(t.date || t.createdAt) === selectedDate;
    }
    
    return typeMatches && dateMatches;
  });

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Transaction History</h1>
        <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>View all your past incomes and expenses</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Income', 'Expense'].map(f => (
            <button
              key={f}
              className={`btn ${typeFilter === f ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '6px 16px', fontWeight: '500', transition: 'all 0.2s', ...( typeFilter === f ? { backgroundColor: '#4f46e5', color: '#fff', border: 'none' } : { backgroundColor: '#e5e7eb', color: '#374151', border: 'none' } ) }}
              onClick={() => setTypeFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className={`btn ${!selectedDate ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedDate('')}
            style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: '500', transition: 'all 0.2s', ...( !selectedDate ? { backgroundColor: '#4f46e5', color: '#fff', border: 'none' } : { backgroundColor: '#e5e7eb', color: '#374151', border: 'none' } ) }}
          >
            All Dates
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="filterDate" style={{ fontWeight: '500', color: '#374151' }}>Date:</label>
            <input
              type="date"
              id="filterDate"
              className="form-input"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: 'auto', borderRadius: '8px', cursor: 'pointer', border: '1px solid #d1d5db', padding: '6px 12px' }}
            />
          </div>
        </div>
      </div>

      {error && <div className="error-state" style={{ marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="loading-state">Loading transactions...</div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
          <h3 style={{ fontSize: '1.25rem', color: '#374151', margin: '0 0 8px 0' }}>
            {selectedDate ? 'No records found for this date' : 'No records found'}
          </h3>
          <p style={{ color: '#6b7280' }}>
            {selectedDate ? 'Try selecting a different date or click All Dates.' : 'You have no transactions in the selected filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTransactions.map((t) => (
            <div 
              key={t._id || Math.random().toString()} 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: t.type === 'income' ? '#dcfce7' : '#fee2e2',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.25rem',
                  color: t.type === 'income' ? '#166534' : '#991b1b',
                  flexShrink: 0
                }}>
                  {t.type === 'income' ? '↓' : '↑'}
                </div>
                
                <div>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '1rem', marginBottom: '4px' }}>
                    {t.title || getCategoryName(t.category)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>{formatDate(t.date || t.createdAt || new Date())}</span>
                    <span style={{ fontSize: '0.5rem' }}>•</span>
                    <span>{formatTime(t.date || t.createdAt || new Date())}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '6px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '2px 8px', 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {getCategoryName(t.category)}
                    </span>
                    {t.description && <span style={{ color: '#9ca3af' }}>{t.description}</span>}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: '1.125rem',
                  color: t.type === 'income' ? '#10b981' : '#ef4444'
                }}>
                  {t.type === 'income' ? '+' : '-'} ₹{Number(t.amount).toLocaleString('en-IN')}
                </div>
                {t.paymentMethod && (
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>
                    {getPaymentMethodName(t.paymentMethod)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
