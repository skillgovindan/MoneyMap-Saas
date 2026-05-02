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
          style={{ padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)', backgroundColor: '#10b981', border: 'none' }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span> Add Income
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <button 
          className={`btn ${!selectedDate ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedDate('')}
          style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '500', transition: 'all 0.2s', ...( !selectedDate ? { backgroundColor: '#4f46e5', color: '#fff', border: 'none' } : { backgroundColor: '#e5e7eb', color: '#374151', border: 'none' } ) }}
        >
          All
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
            style={{ width: 'auto', borderRadius: '8px', cursor: 'pointer', border: '1px solid #d1d5db', padding: '8px 12px' }}
          />
        </div>
      </div>

      {error && <div className="error-state" style={{ marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="loading-state">Loading income records...</div>
        </div>
      ) : filteredIncomes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
          <h3 style={{ fontSize: '1.25rem', color: '#374151', margin: '0 0 8px 0' }}>
            {selectedDate ? 'No records found for this date' : 'No Income Records Yet'}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {selectedDate ? 'Try selecting a different date or click All.' : 'Start tracking your earnings by adding your first income.'}
          </p>
          {!selectedDate && (
            <button className="btn btn-primary" onClick={() => navigate('/transactions/income/add')} style={{ backgroundColor: '#10b981', border: 'none' }}>Add First Income</button>
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
                backgroundColor: '#ffffff',
                border: '1px solid #f3f4f6',
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
                    width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', color: '#166534', flexShrink: 0
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
                          <span style={{ backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                            {getPaymentMethodName(income.paymentMethod)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                    + ₹{Number(income.amount).toLocaleString('en-IN')}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => navigate(`/transactions/income/edit/${income._id}`)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#4b5563', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(income._id)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {income.description && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', color: '#4b5563', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: '#374151', marginRight: '8px' }}>Notes:</span> {income.description}
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
