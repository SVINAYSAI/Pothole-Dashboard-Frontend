import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Bell, Search } from 'lucide-react';
import './AdminLayout.css';

const AdminHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="admin-header">
      <div className="header-left">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="user-dropdown">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name || 'Admin'}</div>
              <div className="user-role">Administrator</div>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="user-menu">
            <Dropdown.Item href="/admin/profile">
              <i className="bi bi-person me-2"></i>
              Profile
            </Dropdown.Item>
            <Dropdown.Item href="/admin/settings">
              <i className="bi bi-gear me-2"></i>
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default AdminHeader;