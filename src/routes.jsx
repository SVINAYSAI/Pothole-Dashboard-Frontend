import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/AnalyticsDashboard';
import LiveDetect from './pages/LiveDetectNew';
import ContactUs from './pages/ContactUs';
import SessionHistory from './pages/SessionHistory';
import SessionDetails from './pages/SessionDetails';
import LoginSignup from './auth/LoginSignup';
import AdminRegistration from './admin/AdminRegistration';
import AdminLayout from './admin/layout/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import UsersManagement from './admin/pages/UsersManagement';
import AdminProfile from './admin/pages/AdminProfile';
import PotholeThresholds from './admin/pages/PotholeThresholds';
import UserProfile from './pages/UserProfile';

const RoutesComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role || '');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/admin_registration" element={<AdminRegistration />} />
          <Route path="*" element={<LoginSignup onLogin={handleLogin} />} />
        </Routes>
      ) : userRole?.toLowerCase() === 'admin' ? (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
            <Route path="users" element={<PrivateRoute element={<UsersManagement />} />} />
            <Route path="profile" element={<PrivateRoute element={<AdminProfile />} />} />
            <Route path="thresholds" element={<PrivateRoute element={<PotholeThresholds />} />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      ) : (
        <div className="d-flex">
          <Sidebar onCollapse={setSidebarCollapsed} />
          <div
            className="flex-grow-1"
            style={{
              marginLeft: sidebarCollapsed ? '80px' : '260px',
              transition: 'margin-left 0.3s ease',
              minHeight: '100vh'
            }}
          >
            <Header sidebarCollapsed={sidebarCollapsed} />
            <Routes>
              {/* Dashboard has its own full-width container */}
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />

              {/* Other routes use Container wrapper */}
              <Route path="/live-detect" element={<PrivateRoute element={<LiveDetect />} />} />
              <Route path="/history" element={<PrivateRoute element={<SessionHistory />} />} />
              <Route path="/history/session/:sessionId" element={<PrivateRoute element={<SessionDetails />} />} />
              <Route path="/contact-us" element={<PrivateRoute element={<ContactUs />} />} />
              <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
              <Route path="*" element={<Navigate to="/live-detect" />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesComponent;
