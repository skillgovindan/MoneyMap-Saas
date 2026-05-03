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

  const renderList = (records, type) => {
    const isLent = type === 'lent';
    
    if (records.length === 0) {
      return (
        <div className="empty-state" style={{ padding: '32px', textAlign: 'center', background: '#ffffff', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#4b5563', marginBottom: '12px' }}>No {isLent ? 'lent' : 'borrowed'} money records found.</p>
          <Link to={`/due-tracker/${isLent ? 'lent' : 'borrowed'}/add`} className="btn btn-primary btn-sm">
            + Add {isLent ? 'Lent' : 'Borrowed'} Money
          </Link>
        </div>
      );
    }

    return (
      <div className="compact-list">
        {records.map(record => {
          const personInfo = getPersonDetails(record.person);
          const categoryInfo = getCategoryDetails(record.category);
          
          return (
            <div key={record._id} className="list-row">
              <div className="row-main">
                <div className="row-info">
                  <div className="row-title">
                    <span className="person-name">{personInfo.name}</span>
                    <span className="row-amount">{formatCurrency(record.amount)}</span>
                    <span className={`status-badge ${record.isPaid ? 'paid' : 'pending'}`}>
                      {record.isPaid ? 'Paid' : 'Not Paid'}
                    </span>
                  </div>
                  
                  <div className="row-sub">
                    <span className="category-text">{categoryInfo.name}</span>
                    <span className="dot-separator">•</span>
                    <span className="date-text">Taken: {formatDate(record.takenDate)}</span>
                    {record.payingDate && (
                      <>
                        <span className="dot-separator">•</span>
                        <span className="date-text">Paying: {formatDate(record.payingDate)}</span>
                      </>
                    )}
                  </div>
                  
                  {record.notes && <div className="row-notes">{record.notes}</div>}
                </div>
                
                <div className="row-actions">
                  <button className="action-link" onClick={() => navigate(`/due-tracker/${isLent ? 'lent' : 'borrowed'}/edit/${record._id}`)}>Edit</button>
                  <button className="action-link text-danger" onClick={() => isLent ? handleDeleteLent(record._id) : handleDeleteBorrowed(record._id)}>Delete</button>
                  <button className={`action-btn ${record.isPaid ? 'btn-outline' : 'btn-fill'}`} onClick={() => isLent ? toggleLentStatus(record) : toggleBorrowedStatus(record)}>
                    {record.isPaid ? 'Mark Not Paid' : 'Mark Paid'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="page-container loading-state">Loading due tracker...</div>;
  if (error) return <div className="page-container error-state">{error}</div>;

  return (
    <div className="page-container due-tracker-page">
      <div className="page-header compact-header">
        <div>
          <h1 className="page-title" style={{marginBottom: '0.25rem'}}>Due Tracker</h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Track money lent, borrowed, and pending dues.</p>
        </div>
        <div className="header-actions">
          {activeTab === 'Lent Money' ? (
            <Link to="/due-tracker/lent/add" className="btn btn-primary btn-sm"><LentIcon size={16} />Add Lent Money</Link>
          ) : (
            <Link to="/due-tracker/borrowed/add" className="btn btn-primary btn-sm"><BorrowedIcon size={16} />Add Borrowed Money</Link>
          )}
        </div>
      </div>

      <div className="summary-bar">
        <div className="summary-item">
          <span className="summary-label">Total Lent</span>
          <span className="summary-val text-primary">{formatCurrency(totalLent)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Borrowed</span>
          <span className="summary-val text-primary">{formatCurrency(totalBorrowed)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Pending Lent</span>
          <span className="summary-val text-danger">{formatCurrency(pendingLent)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Pending Borrowed</span>
          <span className="summary-val text-danger">{formatCurrency(pendingBorrowed)}</span>
        </div>
      </div>

      <div className="compact-tabs">
        {['Lent Money', 'Borrowed Money'].map(tab => (
          <div key={tab} className={`compact-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'Lent Money' ? <LentIcon size={16} /> : <BorrowedIcon size={16} />}
            {tab}
          </div>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'Lent Money' ? renderList(lentMoney, 'lent') : renderList(borrowedMoney, 'borrowed')}
      </div>

      <style>{`
        .due-tracker-page .compact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .summary-bar {
          display: flex;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 24px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }

        .summary-item {
          flex: 1;
          padding: 12px 20px;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
        }

        .summary-item:last-child {
          border-right: none;
        }

        .summary-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .summary-val {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .text-primary { color: #4f46e5; }
        .text-danger { color: #ef4444; }

        .compact-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 16px;
          overflow-x: auto;
        }

        .compact-tab {
          padding: 10px 20px;
          font-weight: 500;
          font-size: 0.9rem;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-right: 8px;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .compact-tab:hover {
          color: #374151;
        }

        .compact-tab.active {
          color: #4f46e5;
          border-bottom-color: #4f46e5;
        }

        .compact-list {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }

        .list-row {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.15s;
        }
        
        .list-row:hover {
          background-color: #f9fafb;
        }

        .list-row:last-child {
          border-bottom: none;
        }

        .row-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .row-info {
          flex: 1;
          min-width: 250px;
        }

        .row-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .person-name {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
        }

        .row-amount {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.paid { background-color: #d1fae5; color: #065f46; }
        .status-badge.pending { background-color: #fee2e2; color: #991b1b; }

        .row-sub {
          font-size: 0.85rem;
          color: #4b5563;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }

        .dot-separator {
          color: #d1d5db;
          font-size: 0.7rem;
        }

        .row-notes {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 4px;
        }

        .row-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-link {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }
        
        .action-link:hover {
          color: #111827;
          text-decoration: underline;
        }

        .action-link.text-danger:hover {
          color: #dc2626;
        }

        .action-btn {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s;
        }

        .btn-outline {
          background: #ffffff;
          border-color: #d1d5db;
          color: #374151;
        }
        
        .btn-outline:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-fill {
          background: #10b981;
          color: #ffffff;
        }
        
        .btn-fill:hover {
          background: #059669;
        }

        @media (max-width: 768px) {
          .summary-bar {
            flex-wrap: wrap;
          }
          
          .summary-item {
            flex: 1 1 40%;
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .summary-item:nth-child(2) {
            border-right: none;
          }
          
          .summary-item:nth-child(3),
          .summary-item:nth-child(4) {
            border-bottom: none;
          }
          
          .row-main {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .row-actions {
            width: 100%;
            justify-content: flex-end;
            padding-top: 12px;
            margin-top: 4px;
            border-top: 1px dashed #e5e7eb;
          }
        }
      `}</style>
    </div>
  );
};

export default DueTracker;
