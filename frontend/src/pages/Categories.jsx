import React, { useState, useEffect } from 'react';
import * as categoryService from '../services/categoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    description: ''
  });
  const [formError, setFormError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ name: '', type: 'expense', description: '' });
    setFormError(null);
    setIsEditing(false);
    setEditCategoryId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setFormData({
      name: category.name,
      type: category.type,
      description: category.description || ''
    });
    setFormError(null);
    setIsEditing(true);
    setEditCategoryId(category._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    if (!formData.type) {
      setFormError('Category type is required.');
      return;
    }

    try {
      setIsSaving(true);
      if (isEditing) {
        await categoryService.patchCategory(editCategoryId, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert(err.message || 'Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(c => {
    if (activeTab === 'all') return true;
    return c.type === activeTab;
  });

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Categories</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Manage your income and expense categories</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleOpenModal}
          style={{ padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-card)', backgroundColor: 'var(--primary)', border: 'none', color: 'var(--bg-card)' }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span> Add Category
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', overflowX: 'auto' }}>
        {['all', 'income', 'expense'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 24px',
              borderRadius: '24px',
              border: 'none',
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
              backgroundColor: activeTab === tab ? 'var(--primary)' : 'var(--border)',
              color: activeTab === tab ? 'var(--bg-card)' : '#4b5563',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <div className="error-state" style={{ marginBottom: '20px' }}>{error}</div>}

      {/* Content Section */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="loading-state">Loading categories...</div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '2px dashed var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>No Categories Found</h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Get started by creating a new category for your transactions.</p>
          <button className="btn btn-primary" onClick={handleOpenModal}>Create First Category</button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredCategories.map((category) => (
            <div 
              key={category._id} 
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
            >
              {/* Type Indicator Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                backgroundColor: category.type === 'income' ? 'var(--income-color)' : 'var(--expense-color)'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0, paddingRight: '12px' }}>
                  {category.name}
                </h3>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  backgroundColor: category.type === 'income' ? 'var(--bg-success-light)' : 'var(--bg-danger-light)',
                  color: category.type === 'income' ? 'var(--income-color)' : 'var(--expense-color)',
                  whiteSpace: 'nowrap'
                }}>
                  {category.type}
                </span>
              </div>
              
              <p style={{ color: '#6b7280', fontSize: '0.9rem', flexGrow: 1, margin: '0 0 20px 0', minHeight: '40px' }}>
                {category.description || 'No description provided.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <button 
                  onClick={() => handleOpenEditModal(category)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--border)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(category._id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--expense-color)',
                    backgroundColor: 'var(--bg-danger-light)',
                    color: 'var(--expense-color)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--expense-color)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-danger-light)'; }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Modernized */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(17, 24, 39, 0.4)' }}>
          <div className="modal-content" style={{ borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                {isEditing ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button 
                onClick={handleCloseModal}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
              >
                &times;
              </button>
            </div>
            
            {formError && <div className="error-state" style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>{formError}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Category Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Food, Salary, Rent"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Transaction Type</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{
                    flex: 1, padding: '12px', border: formData.type === 'expense' ? '2px solid var(--expense-color)' : '1px solid var(--border)', 
                    borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: formData.type === 'expense' ? 'var(--bg-danger-light)' : 'var(--bg-card)', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}>
                    <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={handleChange} style={{ accentColor: 'var(--expense-color)' }} />
                    <span style={{ fontWeight: formData.type === 'expense' ? 600 : 400, color: '#111827' }}>Expense</span>
                  </label>
                  <label style={{
                    flex: 1, padding: '12px', border: formData.type === 'income' ? '2px solid var(--income-color)' : '1px solid var(--border)', 
                    borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: formData.type === 'income' ? 'var(--bg-success-light)' : 'var(--bg-card)', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}>
                    <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={handleChange} style={{ accentColor: 'var(--income-color)' }} />
                    <span style={{ fontWeight: formData.type === 'income' ? 600 : 400, color: '#111827' }}>Income</span>
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Description (Optional)</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this category used for?"
                  rows="3"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', resize: 'vertical', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSaving}
                  style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--bg-card)', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}
                >
                  {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
