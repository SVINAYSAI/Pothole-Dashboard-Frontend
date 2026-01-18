import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Video, LayoutDashboard, FileBarChart, Mail, UserCircle, LogOut, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { authAPI } from '../services/api';
import './Sidebar.css';

const Sidebar = ({ onCollapse }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (onCollapse) onCollapse(collapsed);
  }, [collapsed, onCollapse]);

  const menuItems = [
    { path: '/live-detect', label: 'Live Detection', icon: Video },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile', icon: UserCircle },
    // { path: '/reports', label: 'Reports', icon: FileBarChart },
    { path: '/contact-us', label: 'Contact Us', icon: Mail },
  ];

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (email) {
        await authAPI.logout(email);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('live_session_id');
      navigate('/');
    }
  };

  return (
    <aside className={`user-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="brand-section">
            <div className="brand-logo">
              <i className="bi bi-cone-striped"></i>
            </div>
            <div className="brand-text">
              <h3 className="brand-name">PDS</h3>
              <p className="brand-subtitle">Pothole Detection</p>
            </div>
          </div>
        )}
        <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <div className="nav-icon">
                <IconComponent size={22} />
              </div>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {isActive && <div className="active-indicator"></div>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer - Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
          <div className="nav-icon">
            <LogOut size={22} />
          </div>
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;