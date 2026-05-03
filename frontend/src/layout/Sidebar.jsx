import React from 'react';
import { NavLink } from 'react-router-dom';

const IconDashboard = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconIncome = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
const IconExpense = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
const IconHistory = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IconDaily = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>;
const IconWeekly = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h8"/></svg>;
const IconMonthly = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h8M8 18h4"/></svg>;
const IconYearly = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconPersons = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const IconDueTracker = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconCategories = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"/></svg>;
const IconMenu = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconX = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const Sidebar = ({ isCollapsed, toggleCollapse, isMobileOpen, closeMobile }) => {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <div className="sidebar-title">MoneyMap SaaS</div>}
        {isCollapsed && <div className="sidebar-title-short">MM</div>}
        <button className="toggle-btn desktop-only" onClick={toggleCollapse}>
          <IconMenu />
        </button>
        <button className="toggle-btn mobile-only-btn" onClick={closeMobile}>
          <IconX />
        </button>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <NavLink to="/dashboard" title="Dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconDashboard />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Transactions</div>
          <NavLink to="/transactions/income" title="Income" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconIncome />
            <span className="nav-text">Income</span>
          </NavLink>
          <NavLink to="/transactions/expense" title="Expense" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconExpense />
            <span className="nav-text">Expense</span>
          </NavLink>
          <NavLink to="/transactions/history" title="Transaction History" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconHistory />
            <span className="nav-text">Transaction History</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Reports</div>
          <NavLink to="/reports/daily" title="Daily Report" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconDaily />
            <span className="nav-text">Daily Report</span>
          </NavLink>
          <NavLink to="/reports/weekly" title="Weekly Report" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconWeekly />
            <span className="nav-text">Weekly Report</span>
          </NavLink>
          <NavLink to="/reports/monthly" title="Monthly Report" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconMonthly />
            <span className="nav-text">Monthly Report</span>
          </NavLink>
          <NavLink to="/reports/yearly" title="Yearly Report" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconYearly />
            <span className="nav-text">Yearly Report</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Management</div>
          <NavLink to="/persons" title="Persons" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconPersons />
            <span className="nav-text">Persons</span>
          </NavLink>
          <NavLink to="/due-tracker" title="Due Tracker" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconDueTracker />
            <span className="nav-text">Due Tracker</span>
          </NavLink>
          <NavLink to="/categories" title="Categories" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconCategories />
            <span className="nav-text">Categories</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
