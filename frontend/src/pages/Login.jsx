import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phoneNumber: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    // Set a demo token so ProtectedRoute allows access without a real account
    localStorage.setItem('token', 'demo-access-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Demo User', phoneNumber: 'demo' }));
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="page-container auth-card">
        <div className="auth-header" style={{ marginBottom: '24px' }}>
          <h1 className="auth-brand" style={{ fontSize: '1.85rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '8px' }}>MoneyMap</h1>
          <p className="auth-subtitle" style={{ fontSize: '0.95rem' }}>Sign in to your account</p>
        </div>

        {/* Demo Access Banner */}
        <div className="demo-banner">
          <p className="demo-banner-text">👋 Recruiter? Explore the app instantly — no sign-up needed.</p>
          <button
            id="demo-access-btn"
            type="button"
            className="btn demo-btn"
            onClick={handleDemoAccess}
          >
            ✦ Try Demo
          </button>
        </div>

        <div className="auth-divider">
          <span>or sign in with your account</span>
        </div>

        {error && <div className="error-state" style={{ padding: '10px 14px', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              className="form-input"
              placeholder="Enter your phone number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-button"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
