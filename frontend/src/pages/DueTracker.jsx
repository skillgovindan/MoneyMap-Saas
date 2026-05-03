import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import personService from '../services/personService';
import { getAllCategories } from '../services/categoryService';
import lentMoneyService from '../services/lentMoneyService';
import borrowedMoneyService from '../services/borrowedMoneyService';

const LentIcon = ({ size = 18, style = { marginRight: '6px', verticalAlign: 'text-bottom' } }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
  </svg>
);

const BorrowedIcon = ({ size = 18, style = { marginRight: '6px', verticalAlign: 'text-bottom' } }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M17 7 7 17"/><path d="M17 17H7V7"/>
  </svg>
);

const DueTracker = () => {
  const [activeTab, setActiveTab] = useState('Lent Money');
  
  const [persons, setPersons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lentMoney, setLentMoney] = useState([]);
  const [borrowedMoney, setBorrowedMoney] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [personsData, categoriesData, lentData, borrowedData] = await Promise.all([
        personService.getAllPersons(),
        getAllCategories(),
        lentMoneyService.getAllLentMoney(),
        borrowedMoneyService.getAllBorrowedMoney()
      ]);
      setPersons(personsData || []);
      setCategories(categoriesData || []);
      
      const sortRecords = (records) => {
        return records.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.takenDate);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.takenDate);
          return dateB - dateA; // Latest first
        });
      };
      
      setLentMoney(sortRecords(lentData || []));
      setBorrowedMoney(sortRecords(borrowedData || []));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalLent = lentMoney.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalBorrowed = borrowedMoney.reduce((sum, item) => sum + Number(item.amount), 0);
  const pendingLent = lentMoney.filter(item => !item.isPaid).reduce((sum, item) => sum + Number(item.amount), 0);
  const pendingBorrowed = borrowedMoney.filter(item => !item.isPaid).reduce((sum, item) => sum + Number(item.amount), 0);

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getPersonDetails = (personIdOrObj) => {
    if (!personIdOrObj) return { name: '-', phoneNumber: '' };
    if (typeof personIdOrObj === 'object') return personIdOrObj;
    const found = persons.find(p => p._id === personIdOrObj);
    return found || { name: '-', phoneNumber: '' };
  };

  const getCategoryDetails = (categoryIdOrObj) => {
    if (!categoryIdOrObj) return { name: '-' };
    if (typeof categoryIdOrObj === 'object') return categoryIdOrObj;
    const found = categories.find(c => c._id === categoryIdOrObj);
    return found || { name: '-' };
  };

  // Handlers for Lent Money Actions
  const handleDeleteLent = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await lentMoneyService.deleteLentMoneyById(id);
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const toggleLentStatus = async (record) => {
    try {
      await lentMoneyService.patchLentMoneyById(record._id, { isPaid: !record.isPaid });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handlers for Borrowed Money Actions
  const handleDeleteBorrowed = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await borrowedMoneyService.deleteBorrowedMoneyById(id);
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const toggleBorrowedStatus = async (record) => {
    try {
      await borrowedMoneyService.patchBorrowedMoneyById(record._id, { isPaid: !record.isPaid });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const renderTable = (records, type) => {
    const isLent = type === 'lent';
    
    if (records.length === 0) {
      return (
        <div className="empty-state">
          No {isLent ? 'lent' : 'borrowed'} money records found.
        </div>
      );
    }

    return (
      <>
        <div className="table-container desktop-only">
          <table className="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Taken Date</th>
                <th>Paying Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => {
                const personInfo = getPersonDetails(record.person);
                const categoryInfo = getCategoryDetails(record.category);
                return (
                  <tr key={record._id}>
                    <td>
                      {personInfo.name}
                      {personInfo.phoneNumber && <div style={{fontSize: '0.8rem', color: '#6b7280'}}>{personInfo.phoneNumber}</div>}
                    </td>
                    <td>{categoryInfo.name}</td>
                    <td style={{fontWeight: '500'}}>{formatCurrency(record.amount)}</td>
                    <td>{formatDate(record.takenDate)}</td>
                    <td>{formatDate(record.payingDate)}</td>
                    <td>
                      <span className={`status-badge ${record.isPaid ? 'paid' : 'pending'}`}>
                        {record.isPaid ? 'Paid' : 'Not Paid'}
                      </span>
                    </td>
                    <td>{record.notes || '-'}</td>
                    <td className="actions-cell">
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/due-tracker/${isLent ? 'lent' : 'borrowed'}/edit/${record._id}`)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => isLent ? handleDeleteLent(record._id) : handleDeleteBorrowed(record._id)}>Delete</button>
                      <button className={`btn btn-sm ${record.isPaid ? 'btn-secondary' : 'btn-success'}`} onClick={() => isLent ? toggleLentStatus(record) : toggleBorrowedStatus(record)}>
                        {record.isPaid ? 'Mark Not Paid' : 'Mark Paid'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-only cards-container">
          {records.map(record => {
            const personInfo = getPersonDetails(record.person);
            const categoryInfo = getCategoryDetails(record.category);
            return (
              <div key={record._id} className="record-card">
                <div className="card-header">
                  <h3 className="card-title-text">{personInfo.name}</h3>
                  <span className={`status-badge ${record.isPaid ? 'paid' : 'pending'}`}>
                    {record.isPaid ? 'Paid' : 'Not Paid'}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>Category:</strong> {categoryInfo.name}</p>
                  <p><strong>Amount:</strong> <span style={{fontWeight: 'bold', color: '#111827'}}>{formatCurrency(record.amount)}</span></p>
                  <p><strong>Taken:</strong> {formatDate(record.takenDate)}</p>
                  <p><strong>Paying:</strong> {formatDate(record.payingDate)}</p>
                  {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                </div>
                <div className="card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/due-tracker/${isLent ? 'lent' : 'borrowed'}/edit/${record._id}`)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => isLent ? handleDeleteLent(record._id) : handleDeleteBorrowed(record._id)}>Delete</button>
                  <button className={`btn btn-sm ${record.isPaid ? 'btn-secondary' : 'btn-success'}`} onClick={() => isLent ? toggleLentStatus(record) : toggleBorrowedStatus(record)} style={{flex: 1}}>
                    {record.isPaid ? 'Mark Not Paid' : 'Mark Paid'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  if (loading) return <div className="page-container loading-state">Loading due tracker...</div>;
  if (error) return <div className="page-container error-state">{error}</div>;

  return (
    <div className="page-container due-tracker-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{marginBottom: '0.25rem'}}>Due Tracker</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Track money lent, borrowed, and pending dues.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <h3 className="summary-title">Total Lent</h3>
          <p className="summary-value text-primary">{formatCurrency(totalLent)}</p>
        </div>
        <div className="summary-card">
          <h3 className="summary-title">Total Borrowed</h3>
          <p className="summary-value text-primary">{formatCurrency(totalBorrowed)}</p>
        </div>
        <div className="summary-card">
          <h3 className="summary-title">Pending Lent</h3>
          <p className="summary-value text-danger">{formatCurrency(pendingLent)}</p>
        </div>
        <div className="summary-card">
          <h3 className="summary-title">Pending Borrowed</h3>
          <p className="summary-value text-danger">{formatCurrency(pendingBorrowed)}</p>
        </div>
      </div>

      <div className="tabs-container">
        {['Lent Money', 'Borrowed Money'].map(tab => (
          <div key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'Lent Money' ? <LentIcon /> : <BorrowedIcon />}
            {tab}
          </div>
        ))}
      </div>

      {activeTab === 'Lent Money' && (
        <div className="tab-content">
          <div className="tab-header">
            <h2 className="section-title"><LentIcon size={22} style={{ marginRight: '8px', verticalAlign: 'text-bottom', color: '#4f46e5' }} />Lent Money</h2>
            <Link to="/due-tracker/lent/add" className="btn btn-primary"><LentIcon />Add Lent Money</Link>
          </div>
          {renderTable(lentMoney, 'lent')}
        </div>
      )}

      {activeTab === 'Borrowed Money' && (
        <div className="tab-content">
          <div className="tab-header">
            <h2 className="section-title"><BorrowedIcon size={22} style={{ marginRight: '8px', verticalAlign: 'text-bottom', color: '#4f46e5' }} />Borrowed Money</h2>
            <Link to="/due-tracker/borrowed/add" className="btn btn-primary"><BorrowedIcon />Add Borrowed Money</Link>
          </div>
          {renderTable(borrowedMoney, 'borrowed')}
        </div>
      )}

      <style>{`
        .due-tracker-page .page-header {
          flex-direction: row;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .summary-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .text-primary { color: #4f46e5; }
        .text-danger { color: #ef4444; }

        .tabs-container {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
          overflow-x: auto;
        }

        .tab-item {
          padding: 12px 24px;
          font-weight: 500;
          font-size: 0.95rem;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .tab-item:hover {
          color: #374151;
        }

        .tab-item.active {
          color: #4f46e5;
          border-bottom-color: #4f46e5;
        }

        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.paid {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .btn-success {
          background-color: #10b981;
          color: white;
          border: none;
        }

        .btn-success:hover {
          background-color: #059669;
        }

        .desktop-only { display: block; }
        .mobile-only { display: none; }

        @media (max-width: 1024px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          
          .summary-grid {
            grid-template-columns: 1fr;
          }

          .due-tracker-page .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .tab-header {
            flex-direction: column;
            align-items: stretch;
          }

          .cards-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .record-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }

          .record-card .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .record-card .card-title-text {
            font-size: 1.1rem;
            font-weight: 600;
            color: #111827;
            margin: 0;
          }

          .record-card .card-body p {
            font-size: 0.9rem;
            color: #4b5563;
            margin-bottom: 6px;
          }

          .record-card .card-actions {
            display: flex;
            gap: 8px;
            margin-top: 16px;
            border-top: 1px solid #f3f4f6;
            padding-top: 12px;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default DueTracker;
