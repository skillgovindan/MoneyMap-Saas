import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as incomeService from '../services/incomeService';
import * as categoryService from '../services/categoryService';
import * as paymentMethodService from '../services/paymentMethodService';

const formatDateKey = (dateValue) => {
  if (!dateValue) return "";
  return new Date(dateValue).toISOString().split("T")[0];
};

const Income = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [paymentMethodsMap, setPaymentMethodsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [incomeData, categoryData, pmData] = await Promise.all([
        incomeService.getAllIncome(),
        categoryService.getAllCategories(),
        paymentMethodService.getAllPaymentMethods()
      ]);
      
      const incomesList = Array.isArray(incomeData) ? incomeData : (incomeData.data || []);
      const categoriesList = Array.isArray(categoryData) ? categoryData : (categoryData.data || []);
      const pmsList = Array.isArray(pmData) ? pmData : (pmData.data || []);
      
      const catMap = {};
      categoriesList.forEach(c => { catMap[c._id] = c.name; });
      
      const pmMap = {};
      pmsList.forEach(pm => { pmMap[pm._id] = pm.name; });
      
      setCategoriesMap(catMap);
      setPaymentMethodsMap(pmMap);
      
      // Sort incomes by createdAt if available, else date descending
      const sorted = [...incomesList].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : (a.date ? new Date(a.date) : new Date());
        const dateB = b.createdAt ? new Date(b.createdAt) : (b.date ? new Date(b.date) : new Date());
        return dateB.getTime() - dateA.getTime();
      });
      setIncomes(sorted);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await incomeService.deleteIncome(id);
        fetchIncomes();
      } catch (err) {
        alert(err.message || 'Failed to delete income');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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

  const filteredIncomes = selectedDate 
    ? incomes.filter((item) => formatDateKey(item.date || item.createdAt) === selectedDate)
    : incomes;

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Income Records</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Track and manage all your incoming money</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/transactions/income/add')}
          style={{ padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-card)', backgroundColor: 'var(--income-color)', border: 'none' }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span> Add Income
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <button 
          className={`btn ${!selectedDate ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedDate('')}
          style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '500', transition: 'all 0.2s', ...( !selectedDate ? { backgroundColor: 'var(--primary)', color: 'var(--bg-card)', border: 'none' } : { backgroundColor: 'var(--border)', color: 'var(--text-primary)', border: 'none' } ) }}
        >
          All
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="filterDate" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Date:</label>
          <input
            type="date"
            id="filterDate"
            className="form-input"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: 'auto', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border)', padding: '8px 12px' }}
          />
        </div>
      </div>

      {error && <div className="error-state" style={{ marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="loading-state">Loading income records...</div>
        </div>
      ) : filteredIncomes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '2px dashed var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            {selectedDate ? 'No records found for this date' : 'No Income Records Yet'}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {selectedDate ? 'Try selecting a different date or click All.' : 'Start tracking your earnings by adding your first income.'}
          </p>
          {!selectedDate && (
            <button className="btn btn-primary" onClick={() => navigate('/transactions/income/add')} style={{ backgroundColor: 'var(--income-color)', border: 'none' }}>Add First Income</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredIncomes.map((income) => (
            <div 
              key={income._id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-success-light)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', color: 'var(--income-color)', flexShrink: 0
                  }}>
                    ↓
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>
                      {getCategoryName(income.category)}
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span>{formatDate(income.date || income.createdAt)}</span>
                      <span>•</span>
                      <span>{formatTime(income.date || income.createdAt)}</span>
                      {income.paymentMethod && (
                        <>
                          <span>•</span>
                          <span style={{ backgroundColor: 'var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                            {getPaymentMethodName(income.paymentMethod)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--income-color)', marginBottom: '8px' }}>
                    + ₹{Number(income.amount).toLocaleString('en-IN')}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => navigate(`/transactions/income/edit/${income._id}`)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(income._id)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--expense-color)', backgroundColor: 'var(--bg-danger-light)', color: 'var(--expense-color)', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--expense-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-danger-light)'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {income.description && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: '8px' }}>Notes:</span> {income.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Income;
