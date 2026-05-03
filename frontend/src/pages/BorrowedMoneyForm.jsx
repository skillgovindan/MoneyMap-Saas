import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import personService from '../services/personService';
import { getAllCategories, createCategory } from '../services/categoryService';
import borrowedMoneyService from '../services/borrowedMoneyService';

const BorrowedIcon = ({ size = 24, style = { marginRight: '8px', verticalAlign: 'bottom', color: '#4f46e5' } }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M17 7 7 17"/><path d="M17 17H7V7"/>
  </svg>
);

const CustomSelect = ({ value, onChange, options, placeholder, renderOption, renderSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt._id === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '4px', padding: '0.5rem 0.75rem', minHeight: '40px' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: selectedOption ? '#111827' : '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? renderSelected(selectedOption) : placeholder}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {selectedOption && (
            <span 
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              style={{ padding: '0 4px', color: '#9ca3af', cursor: 'pointer', marginRight: '4px', fontSize: '1rem', lineHeight: 1 }}
              title="Clear selection"
            >
              ×
            </span>
          )}
          <span style={{ fontSize: '0.7rem', color: '#9ca3af', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
        </div>
      </div>
      
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '4px', marginTop: '4px', zIndex: 50, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          {options.length === 0 ? (
            <div style={{ padding: '8px 12px', color: '#6b7280', fontSize: '0.9rem' }}>No options available</div>
          ) : (
            options.map(option => (
              <div 
                key={option._id}
                onClick={() => { onChange(option._id); setIsOpen(false); }}
                style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem', color: '#111827' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
              >
                {renderOption(option)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const BorrowedMoneyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id && id !== 'add');

  const [formData, setFormData] = useState({
    person: '',
    category: '',
    amount: '',
    takenDate: new Date().toISOString().split('T')[0],
    payingDate: '',
    isPaid: false,
    notes: ''
  });

  const [persons, setPersons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Modals state
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personForm, setPersonForm] = useState({ name: '', phoneNumber: '', address: '' });
  const [personModalError, setPersonModalError] = useState('');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', notes: '' });
  const [categoryModalError, setCategoryModalError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [personsData, categoriesData] = await Promise.all([
          personService.getAllPersons(),
          getAllCategories()
        ]);
        setPersons(personsData || []);
        setCategories(categoriesData || []);

        if (isEditMode) {
          const record = await borrowedMoneyService.getBorrowedMoneyById(id);
          if (record) {
            setFormData({
              person: record.person?._id || record.person || '',
              category: record.category?._id || record.category || '',
              amount: record.amount || '',
              takenDate: record.takenDate ? new Date(record.takenDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              payingDate: record.payingDate ? new Date(record.payingDate).toISOString().split('T')[0] : '',
              isPaid: !!record.isPaid,
              notes: record.notes || ''
            });
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleSavePerson = async (e) => {
    e.preventDefault();
    if (!personForm.name.trim()) {
      setPersonModalError('Person Name is required.');
      return;
    }
    try {
      const created = await personService.createPerson({
        name: personForm.name.trim(),
        phoneNumber: personForm.phoneNumber.trim(),
        address: personForm.address.trim()
      });
      const updatedPersons = await personService.getAllPersons();
      setPersons(updatedPersons || []);
      setFormData(prev => ({ ...prev, person: created._id }));
      setIsPersonModalOpen(false);
      setPersonForm({ name: '', phoneNumber: '', address: '' });
      setPersonModalError('');
    } catch (err) {
      setPersonModalError(err.message || 'Failed to create person.');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setCategoryModalError('Category Name is required.');
      return;
    }
    try {
      const created = await createCategory({
        name: categoryForm.name.trim(),
        type: 'expense',
        description: categoryForm.notes.trim()
      });
      const updatedCategories = await getAllCategories();
      setCategories(updatedCategories || []);
      setFormData(prev => ({ ...prev, category: created._id }));
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: '', notes: '' });
      setCategoryModalError('');
    } catch (err) {
      setCategoryModalError(err.message || 'Failed to create category.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.person) return setValidationError('Please select a Person.');
    if (!formData.category) return setValidationError('Please select a Category.');
    if (!formData.amount || Number(formData.amount) <= 0) return setValidationError('Amount must be greater than 0.');
    if (!formData.takenDate) return setValidationError('Taken Date is required.');

    try {
      const dataToSave = { ...formData, amount: Number(formData.amount) };
      if (!dataToSave.payingDate) delete dataToSave.payingDate;

      if (isEditMode) {
        await borrowedMoneyService.patchBorrowedMoneyById(id, dataToSave);
      } else {
        await borrowedMoneyService.createBorrowedMoney(dataToSave);
      }
      navigate('/due-tracker');
    } catch (err) {
      setValidationError(err.message || 'Failed to save borrowed money record.');
    }
  };

  if (loading) return <div className="page-container loading-state">Loading form...</div>;
  if (error) return <div className="page-container error-state">{error}</div>;

  return (
    <div className="page-container form-page">
      <div className="page-header" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
        <h1 className="page-title" style={{marginBottom: '0.25rem'}}>
          <BorrowedIcon />
          {isEditMode ? 'Edit Borrowed Money' : 'Add Borrowed Money'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
          {isEditMode ? 'Update details of money you borrowed from someone.' : 'Record a new amount of money you borrowed from someone.'}
        </p>
      </div>

      <div className="form-card">
        {validationError && (
          <div className="error-state" style={{padding: '10px', fontSize: '0.875rem', marginBottom: '20px'}}>
            {validationError}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                <label className="form-label" style={{margin: 0}}>Person *</label>
                <button type="button" className="btn-link" onClick={() => setIsPersonModalOpen(true)}>+ New Person</button>
              </div>
              <CustomSelect 
                value={formData.person}
                onChange={(val) => setFormData({...formData, person: val})}
                options={persons}
                placeholder={persons.length === 0 ? 'Please create a contact first' : 'Select Person'}
                renderOption={(p) => p.phoneNumber ? `${p.name} - ${p.phoneNumber}` : p.name}
                renderSelected={(p) => p.name}
              />
            </div>

            <div className="form-group">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                <label className="form-label" style={{margin: 0}}>Category *</label>
                <button type="button" className="btn-link" onClick={() => setIsCategoryModalOpen(true)}>+ New Category</button>
              </div>
              <CustomSelect 
                value={formData.category}
                onChange={(val) => setFormData({...formData, category: val})}
                options={categories}
                placeholder="Select Category"
                renderOption={(c) => c.name}
                renderSelected={(c) => c.name}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input className="form-input" type="number" min="0.01" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" required />
            </div>

            <div className="form-group">
              <label className="form-label">Taken Date *</label>
              <input className="form-input" type="date" max={new Date().toISOString().split('T')[0]} value={formData.takenDate} onChange={e => setFormData({...formData, takenDate: e.target.value})} required />
            </div>

            <div className="form-group">
              <label className="form-label">Paying Date</label>
              <input className="form-input" type="date" value={formData.payingDate} onChange={e => setFormData({...formData, payingDate: e.target.value})} />
            </div>

            <div className="form-group flex-align-center">
              <label className="form-label" style={{display: 'flex', alignItems: 'center', cursor: 'pointer', margin: 0, marginTop: '28px'}}>
                <input type="checkbox" checked={formData.isPaid} onChange={e => setFormData({...formData, isPaid: e.target.checked})} style={{ marginRight: '8px', width: '18px', height: '18px' }} /> 
                Mark as Paid
              </label>
            </div>
          </div>

          <div className="form-group full-width" style={{marginTop: '16px'}}>
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows="3" placeholder="Add any details or conditions here..." />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/due-tracker')}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Borrowed Money</button>
          </div>
        </form>
      </div>

      {/* Person Modal */}
      {isPersonModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create New Person</h2>
            {personModalError && <div className="error-state" style={{padding: '8px', fontSize: '0.875rem', marginBottom: '16px'}}>{personModalError}</div>}
            <form onSubmit={handleSavePerson}>
              <div className="form-group">
                <label className="form-label">Person Name *</label>
                <input className="form-input" type="text" value={personForm.name} onChange={e => setPersonForm({...personForm, name: e.target.value})} placeholder="e.g. Rahul" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" pattern="[0-9]*" value={personForm.phoneNumber} onChange={e => setPersonForm({...personForm, phoneNumber: e.target.value.replace(/\D/g, '')})} placeholder="e.g. 9876543210" />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className="form-textarea" value={personForm.address} onChange={e => setPersonForm({...personForm, address: e.target.value})} rows="2" placeholder="e.g. Palakkad" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPersonModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Person</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create New Category</h2>
            {categoryModalError && <div className="error-state" style={{padding: '8px', fontSize: '0.875rem', marginBottom: '16px'}}>{categoryModalError}</div>}
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input className="form-input" type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} placeholder="e.g. Loan, Advance" />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <input className="form-input" type="text" value={categoryForm.notes} onChange={e => setCategoryForm({...categoryForm, notes: e.target.value})} placeholder="Optional details" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          max-width: 800px;
          margin: 0 auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 24px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .btn-link {
          background: none;
          border: none;
          color: #4f46e5;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        
        .btn-link:hover {
          text-decoration: underline;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
          border-top: 1px solid #e5e7eb;
          padding-top: 24px;
        }

        .flex-align-center {
          display: flex;
          align-items: center;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-card {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default BorrowedMoneyForm;
