import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../services/authService';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const [currentUser, setCurrentUser] = useState(() => {
    let u = { name: 'User' };
    try { 
      u = authService.getUser() || u;
      const identifier = u.phoneNumber || u.name;
      if (identifier) {
        const savedPhoto = localStorage.getItem(`profile_photo_${identifier}`);
        if (savedPhoto) u.photo = savedPhoto;
      }
    } catch (e) {}
    return u;
  });
  
  const userPhone = currentUser.phoneNumber || '-';
  const avatarLetter = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const identifier = currentUser.phoneNumber || currentUser.name;
        if (identifier) {
          localStorage.setItem(`profile_photo_${identifier}`, base64String);
        }
        const updatedUser = { ...currentUser, photo: base64String };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setIsDropdownOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

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
          
          <div className="topbar-right" ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={toggleTheme}
              className="toggle-btn"
              title="Toggle Dark Mode"
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              )}
            </button>
            <button className="user-profile-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className="user-avatar" style={{ overflow: 'hidden' }}>
                {currentUser.photo ? (
                  <img src={currentUser.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  avatarLetter
                )}
              </div>
              <div className="user-info desktop-only-flex">
                <div className="user-name truncate" style={{ maxWidth: '130px' }} title={currentUser.name}>{currentUser.name}</div>
                {currentUser.phoneNumber && <div className="user-phone truncate" style={{ maxWidth: '130px' }} title={currentUser.phoneNumber}>{currentUser.phoneNumber}</div>}
              </div>
              <div className="user-info tablet-only-flex">
                <div className="user-name truncate" style={{ maxWidth: '100px' }} title={currentUser.name}>{currentUser.name}</div>
              </div>
              <svg className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            {isDropdownOpen && (
              <div className="user-dropdown enhanced-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar" style={{ overflow: 'hidden' }}>
                    {currentUser.photo ? (
                      <img src={currentUser.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      avatarLetter
                    )}
                  </div>
                  <div className="dropdown-user-details">
                    <div className="dropdown-name truncate" title={currentUser.name}>{currentUser.name}</div>
                    <div className="dropdown-phone truncate" title={userPhone}>{userPhone}</div>
                  </div>
                </div>
                <div className="dropdown-divider" style={{ margin: 0 }}></div>
                <div style={{ padding: '8px 0' }}>
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoUpload} />
                  <button className="dropdown-item" onClick={() => fileInputRef.current.click()}>Update Photo</button>
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
