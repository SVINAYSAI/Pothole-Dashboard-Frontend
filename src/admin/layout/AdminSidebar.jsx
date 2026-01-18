import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { authAPI } from '../../services/api';
import './AdminLayout.css';

const AdminSidebar = ({ onCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (email) {
        await authAPI.logout(email);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('live_session_id');
      
      // Redirect to login
      navigate('/');
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users Management' },
    { path: '/admin/thresholds', icon: Settings, label: 'Pothole Thresholds' },
    { path: '/admin/profile', icon: UserCircle, label: 'My Profile' },
  ];

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <>
            <div className="logo">
              <i className="bi bi-shield-check"></i>
            </div>
            <h3>Admin Panel</h3>
          </>
        )}
        <button className="collapse-btn" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={22} className="nav-icon" />
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="nav-item logout-item" title={isCollapsed ? 'Logout' : ''}>
          <LogOut size={22} className="nav-icon" />
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;