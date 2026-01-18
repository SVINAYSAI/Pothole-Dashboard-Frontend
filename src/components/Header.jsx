import React from 'react';
import { Bell, Search } from 'lucide-react';
import AvatarMenu from './AvatarMenu';
import './Header.css';

const Header = ({ sidebarCollapsed }) => {
  return (
    <header className={`modern-header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-content">
        {/* Left Section - Brand */}
        <div className="header-left">
          <div className="brand-section">
            <div className="brand-icon">
              <i className="bi bi-cone-striped"></i>
            </div>
            <div className="brand-info">
              <h1 className="brand-title">Pothole Detection System</h1>
              <p className="brand-tagline">Real-time Road Monitoring</p>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="header-right">
          {/* Search Bar */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>

          {/* Notifications */}
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* Avatar Menu */}
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
