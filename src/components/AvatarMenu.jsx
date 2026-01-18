import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { authAPI } from '../services/api';
import './AvatarMenu.css';

const AvatarMenu = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token) {
      navigate('/');
      return;
    }

    try {
      // Call logout API
      console.log('Calling logout API for:', userEmail);
      await authAPI.logout(userEmail);
      console.log('Logout API call successful');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API fails
    } finally {
      // Always clear localStorage and navigate
      console.log('Clearing localStorage and navigating...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('live_session_id');
      
      // Navigate to login page
      navigate('/');
      // Force full page reload to reset state
      window.location.reload();
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="avatar-menu-container">
      <button 
        className="avatar-button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="avatar-circle">
          {getInitials(userData?.name)}
        </div>
      </button>

      {dropdownOpen && (
        <>
          <div className="dropdown-overlay" onClick={() => setDropdownOpen(false)} />
          <div className="avatar-dropdown">
            {/* User Info */}
            <div className="dropdown-header">
              <div className="dropdown-avatar">
                {getInitials(userData?.name)}
              </div>
              <div className="dropdown-user-info">
                <p className="dropdown-user-name">{userData?.name || 'User'}</p>
                <p className="dropdown-user-email">{userData?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="dropdown-divider" />

            {/* Menu Items */}
            <div className="dropdown-menu-items">
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/profile');
                  setDropdownOpen(false);
                }}
              >
                <User size={18} />
                <span>My Profile</span>
              </button>

              <button className="dropdown-item" disabled>
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </div>

            <div className="dropdown-divider" />

            {/* Logout */}
            <button className="dropdown-item logout-item" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AvatarMenu;
