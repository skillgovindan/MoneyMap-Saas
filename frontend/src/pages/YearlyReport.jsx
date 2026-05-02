import React, { useState, useEffect } from 'react';
import yearlyReportService from '../services/yearlyReportService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const YearlyReport = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async (year) => {
    try {
      setLoading(true);
      setError(null);
      const data = await yearlyReportService.getYearlyReport(year);
      setReportData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch yearly report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedYear);
  }, [selectedYear]);

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '';
    if (amount < 0) {
      return `-₹${Math.abs(amount).toLocaleString('en-IN')}`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading-state">Loading yearly report...</div>;
    }

    if (error) {
      return <div className="error-state">{error}</div>;
    }

    if (!reportData) {
      return null;
    }

    const isEmpty = reportData.totalIncome === 0 && reportData.totalExpense === 0;

    if (isEmpty) {
      return <div className="empty-state">No transactions found for {selectedYear}.</div>;
    }

    const graphData = [
      { name: 'Income', amount: reportData.totalIncome, color: '#10b981' },
      { name: 'Expense', amount: reportData.totalExpense, color: '#ef4444' }
    ];

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '24px' }}>
        <div style={{ flex: '1 1 500px', minWidth: '300px', height: '400px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', color: '#374151', fontWeight: '600' }}>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} cursor={{fill: 'transparent'}} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={80}>
                {graphData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: '0 1 300px', minWidth: '250px', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.125rem', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', fontWeight: '600' }}>
            Yearly Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Selected Year:</span>
              <span style={{ fontWeight: '500', color: '#111827' }}>{selectedYear}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Total Income:</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(reportData.totalIncome)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Total Expense:</span>
              <span style={{ fontWeight: '600', color: '#ef4444' }}>{formatCurrency(reportData.totalExpense)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <span style={{ color: '#4b5563', fontWeight: '600' }}>Balance:</span>
              <span style={{ fontWeight: '700', fontSize: '1.125rem', color: reportData.balance >= 0 ? '#4f46e5' : '#ef4444' }}>
                {formatCurrency(reportData.balance)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Income Count:</span>
              <span style={{ fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>{reportData.incomeCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Expense Count:</span>
              <span style={{ fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>{reportData.expenseCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const years = Array.from(new Array(10), (val, index) => currentYear - index);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Yearly Report</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>View your yearly financial report.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor="yearSelect" style={{ fontWeight: '500', color: '#374151' }}>Year:</label>
          <select
            id="yearSelect"
            className="form-select"
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            {years.map(y => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default YearlyReport;
