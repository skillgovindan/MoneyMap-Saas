import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as incomeService from '../services/incomeService';
import * as categoryService from '../services/categoryService';
import * as paymentMethodService from '../services/paymentMethodService';

const IncomeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    paymentMethod: '',
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    description: '',
  });

  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // New Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [categoryError, setCategoryError] = useState(null);

  // New Payment Method Modal state
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({ name: '', description: '' });
  const [paymentMethodError, setPaymentMethodError] = useState(null);

  useEffect(() => {
    fetchDropdownData();
    if (isEditMode) {
      fetchIncome();
    }
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      const [catData, pmData] = await Promise.all([
        categoryService.getCategoriesByType('income'),
        paymentMethodService.getActivePaymentMethods()
      ]);
      setCategories(Array.isArray(catData) ? catData : (catData.data || []));
      setPaymentMethods(Array.isArray(pmData) ? pmData : (pmData.data || []));
    } catch (err) {
      console.error('Failed to load dropdown data', err);
    }
  };

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const data = await incomeService.getIncomeById(id);
      
      const incomeData = data.data || data;

      let formattedDate = '';
      if (incomeData.date) {
        const d = new Date(incomeData.date);
        formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      } else {
        formattedDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      }

      setFormData({
        title: incomeData.title || '',
        amount: incomeData.amount || '',
        category: typeof incomeData.category === 'object' ? incomeData.category._id : (incomeData.category || ''),
        paymentMethod: typeof incomeData.paymentMethod === 'object' && incomeData.paymentMethod ? incomeData.paymentMethod._id : (incomeData.paymentMethod || ''),
        date: formattedDate,
        description: incomeData.description || '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load income details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.category) {
      setError('Category is required.');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Amount is required and must be greater than 0.');
      return;
    }
    const selectedDate = new Date(formData.date);
    if (selectedDate > new Date()) {
      setError('Date and time cannot be in the future.');
      return;
    }

    try {
      setSaving(true);
      
      const selectedCategory = categories.find(c => c._id === formData.category);
      const categoryName = selectedCategory ? selectedCategory.name : 'Income';

      const payload = {
        ...formData,
        title: categoryName,
        amount: Number(formData.amount),
        date: selectedDate.toISOString(),
      };
      
      // Clean up optional fields
      if (!payload.paymentMethod) delete payload.paymentMethod;

      if (isEditMode) {
        await incomeService.patchIncome(id, payload);
      } else {
        await incomeService.createIncome(payload);
      }
      navigate('/transactions/income');
    } catch (err) {
      setError(err.message || 'Failed to save income');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setCategoryError(null);

    if (!newCategory.name.trim()) {
      setCategoryError('Category Name is required.');
      return;
    }

    try {
      const created = await categoryService.createCategory({
        name: newCategory.name,
        type: 'income',
        description: newCategory.description
      });
      
      const createdData = created.data || created;
      
      await fetchDropdownData();
      setFormData(prev => ({ ...prev, category: createdData._id }));
      setIsCategoryModalOpen(false);
      setNewCategory({ name: '', description: '' });
    } catch (err) {
      setCategoryError(err.message || 'Failed to create category');
    }
  };

  const handleSavePaymentMethod = async (e) => {
    e.preventDefault();
    setPaymentMethodError(null);

    if (!newPaymentMethod.name.trim()) {
      setPaymentMethodError('Payment Method Name is required.');
      return;
    }

    try {
      const created = await paymentMethodService.createPaymentMethod({
        name: newPaymentMethod.name,
        description: newPaymentMethod.description
      });
      
      const createdData = created.data || created;
      
      await fetchDropdownData();
      setFormData(prev => ({ ...prev, paymentMethod: createdData._id }));
      setIsPaymentMethodModalOpen(false);
      setNewPaymentMethod({ name: '', description: '' });
    } catch (err) {
      setPaymentMethodError(err.message || 'Failed to create payment method');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">Loading income details...</div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          {isEditMode ? 'Edit Income' : 'Add Income'}
        </h1>
      </div>

      {error && <div className="error-state">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Category <span style={{color: 'red'}}>*</span></label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => setIsCategoryModalOpen(true)}
            >
              + New
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Amount <span style={{color: 'red'}}>*</span></label>
          <input
            type="number"
            name="amount"
            className="form-input"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              name="paymentMethod"
              className="form-select"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Select a payment method</option>
              {paymentMethods.map(pm => (
                <option key={pm._id} value={pm._id}>{pm.name}</option>
              ))}
            </select>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => setIsPaymentMethodModalOpen(true)}
            >
              + New
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date and Time <span style={{color: 'red'}}>*</span></label>
          <input
            type="datetime-local"
            name="date"
            className="form-input"
            value={formData.date}
            onChange={handleChange}
            max={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description"
            rows="3"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/transactions/income')}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>

      {/* New Category Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create Income Category</h2>
            {categoryError && <div className="error-state" style={{ padding: '8px', marginBottom: '16px' }}>{categoryError}</div>}
            
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name <span style={{color: 'red'}}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="e.g. Salary, Freelance"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Optional description"
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Payment Method Modal */}
      {isPaymentMethodModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create Payment Method</h2>
            {paymentMethodError && <div className="error-state" style={{ padding: '8px', marginBottom: '16px' }}>{paymentMethodError}</div>}
            
            <form onSubmit={handleSavePaymentMethod}>
              <div className="form-group">
                <label className="form-label">Payment Method Name <span style={{color: 'red'}}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={newPaymentMethod.name}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                  placeholder="e.g. UPI, Card, Cash"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={newPaymentMethod.description}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, description: e.target.value})}
                  placeholder="Optional description"
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsPaymentMethodModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeForm;
