import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../services/authService';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Safely get user data
  let rawUser = null;
  try {
    rawUser = authService.getUser();
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }
  
  const user = rawUser || { name: 'User' };
  const userPhone = user.phoneNumber || '-';
  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />
      {isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)}></div>}
      
      <div className="main-content-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-toggle-btn mobile-only-btn" onClick={() => setIsMobileOpen(true)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div className="mobile-header-title mobile-only-text">MoneyMap SaaS</div>
          </div>
          
          <div className="topbar-right" ref={dropdownRef}>
            <button className="user-profile-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className="user-avatar">
                {avatarLetter}
              </div>
              <div className="user-info desktop-only-flex">
                <div className="user-name truncate" style={{ maxWidth: '130px' }} title={user.name}>{user.name}</div>
                {user.phoneNumber && <div className="user-phone truncate" style={{ maxWidth: '130px' }} title={user.phoneNumber}>{user.phoneNumber}</div>}
              </div>
              <div className="user-info tablet-only-flex">
                <div className="user-name truncate" style={{ maxWidth: '100px' }} title={user.name}>{user.name}</div>
              </div>
              <svg className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            {isDropdownOpen && (
              <div className="user-dropdown enhanced-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">{avatarLetter}</div>
                  <div className="dropdown-user-details">
                    <div className="dropdown-name truncate" title={user.name}>{user.name}</div>
                    <div className="dropdown-phone truncate" title={userPhone}>{userPhone}</div>
                  </div>
                </div>
                <div className="dropdown-divider" style={{ margin: 0 }}></div>
                <div style={{ padding: '8px 0' }}>
                  <button className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Profile</button>
                  <button className="dropdown-item text-danger flex-item" onClick={handleLogout}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
