import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">MoneyMap SaaS</div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Dashboard
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Transactions</div>
          <NavLink to="/transactions/income" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Income
          </NavLink>
          <NavLink to="/transactions/expense" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Expense
          </NavLink>
          <NavLink to="/transactions/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Transaction History
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Reports</div>
          <NavLink to="/reports/daily" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Daily Report
          </NavLink>
          <NavLink to="/reports/weekly" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Weekly Report
          </NavLink>
          <NavLink to="/reports/monthly" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Monthly Report
          </NavLink>
          <NavLink to="/reports/yearly" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Yearly Report
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Management</div>
          <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Categories
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
