import React, { useState, useEffect } from 'react';
import personService from '../services/personService';

const Persons = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', phoneNumber: '', address: '' });
  const [validationError, setValidationError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await personService.getAllPersons();
      // sort latest first by createdAt
      const sortedData = (data || []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setPersons(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch persons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (person = null) => {
    setValidationError('');
    if (person) {
      setForm({ id: person._id, name: person.name, phoneNumber: person.phoneNumber || '', address: person.address || '' });
    } else {
      setForm({ id: null, name: '', phoneNumber: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ id: null, name: '', phoneNumber: '', address: '' });
    setValidationError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setValidationError('Person Name is mandatory.');
      return;
    }
    try {
      const data = { name: form.name.trim(), phoneNumber: form.phoneNumber.trim(), address: form.address.trim() };
      if (form.id) {
        await personService.patchPersonById(form.id, data);
      } else {
        await personService.createPerson(data);
      }
      closeModal();
      fetchData();
    } catch (err) {
      setValidationError(err.message || 'Failed to save person');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await personService.deletePersonById(id);
        fetchData();
      } catch (err) {
        alert(err.message || 'Failed to delete person');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="page-container persons-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{marginBottom: '0.25rem'}}>Persons</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Manage persons linked with lent and borrowed money.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>Add Person</button>
      </div>

      {loading ? (
        <div className="loading-state">Loading persons...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : persons.length === 0 ? (
        <div className="empty-state">No persons found. Add a person to get started.</div>
      ) : (
        <>
          <div className="table-container desktop-only">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Person Name</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Created Date</th>
                  <th style={{textAlign: 'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {persons.map(p => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.phoneNumber || '-'}</td>
                    <td>{p.address || '-'}</td>
                    <td>{formatDate(p.createdAt)}</td>
                    <td className="actions-cell">
                      <button className="btn btn-secondary btn-sm" onClick={() => openModal(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-only cards-container">
            {persons.map(p => (
              <div key={p._id} className="person-card">
                <div className="card-header">
                  <h3 className="card-name">{p.name}</h3>
                </div>
                <div className="card-body">
                  <p><strong>Phone:</strong> {p.phoneNumber || '-'}</p>
                  <p><strong>Address:</strong> {p.address || '-'}</p>
                  <p><strong>Created:</strong> {formatDate(p.createdAt)}</p>
                </div>
                <div className="card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => openModal(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{form.id ? 'Edit Person' : 'Add Person'}</h2>
            
            {validationError && (
              <div className="error-state" style={{padding: '10px', fontSize: '0.875rem', marginBottom: '16px'}}>
                {validationError}
              </div>
            )}
            
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Person Name *</label>
                <input 
                  className="form-input" 
                  type="text" 
                  value={form.name} 
                  onChange={e => {
                    setForm({...form, name: e.target.value});
                    if (validationError) setValidationError('');
                  }} 
                  placeholder="e.g. Rahul"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  className="form-input" 
                  type="tel" 
                  pattern="[0-9]*"
                  value={form.phoneNumber} 
                  onChange={e => setForm({...form, phoneNumber: e.target.value.replace(/\D/g, '')})} 
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea 
                  className="form-textarea" 
                  value={form.address} 
                  onChange={e => setForm({...form, address: e.target.value})} 
                  placeholder="e.g. Palakkad"
                  rows="3"
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .desktop-only { display: block; }
        .mobile-only { display: none; }
        
        .persons-page .page-header {
          flex-direction: row;
        }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          
          .persons-page .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .persons-page .page-header button {
            margin-top: 1rem;
            width: 100%;
          }

          .cards-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .person-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }

          .person-card .card-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 12px;
          }

          .person-card .card-body p {
            font-size: 0.9rem;
            color: #4b5563;
            margin-bottom: 6px;
          }
            
          .person-card .card-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px;
            border-top: 1px solid #f3f4f6;
            padding-top: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Persons;
