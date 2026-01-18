import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';
import { userAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    admins: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getAllUsers();
      const users = response.data;
      
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.is_active).length;
      const inactiveUsers = users.filter(u => !u.is_active).length;
      const admins = users.filter(u => u.role === 'admin').length;
      
      setStats({ totalUsers, activeUsers, inactiveUsers, admins });
      setRecentUsers(users.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <Card className="stat-card">
      <Card.Body>
        <div className="stat-content">
          <div className="stat-icon" style={{ backgroundColor: bgColor }}>
            <Icon size={28} color={color} />
          </div>
          <div className="stat-details">
            <div className="stat-value">{loading ? '...' : value}</div>
            <div className="stat-title">{title}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="admin-dashboard">
      <div className="dashboard-header mb-4">
        <h2 className="dashboard-title">Dashboard Overview</h2>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening</p>
      </div>

      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            color="#667eea"
            bgColor="#e8ebfc"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            icon={UserCheck}
            title="Active Users"
            value={stats.activeUsers}
            color="#4caf50"
            bgColor="#e8f5e9"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            icon={UserX}
            title="Inactive Users"
            value={stats.inactiveUsers}
            color="#f44336"
            bgColor="#ffebee"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            icon={Activity}
            title="Administrators"
            value={stats.admins}
            color="#ff9800"
            bgColor="#fff3e0"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={12}>
          <Card className="recent-users-card">
            <Card.Header>
              <h5 className="mb-0">Recent Users</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No users found
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Verified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info-cell">
                              <div className="user-avatar-sm">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            {user.is_verified ? (
                              <i className="bi bi-check-circle-fill text-success"></i>
                            ) : (
                              <i className="bi bi-x-circle-fill text-danger"></i>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;