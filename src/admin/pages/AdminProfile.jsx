import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';
import './AdminProfile.css';

const AdminProfile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '',
    mobileNumber: '',
    role: ''
  });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      countryCode: userData.country_code || '+91',
      mobileNumber: userData.mobile_number || '',
      role: userData.role || 'admin'
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      // Here you would call the update API
      // await userAPI.updateUser(user.id, formData);
      
      // Update local storage
      const updatedUser = {
        ...user,
        name: formData.name,
        country_code: formData.countryCode,
        mobile_number: formData.mobileNumber
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <Container fluid className="admin-profile">
      <div className="profile-header mb-4">
        <h2 className="profile-title">My Profile</h2>
        <p className="profile-subtitle">Manage your account information</p>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="profile-card text-center">
            <Card.Body className="p-4">
              <div className="profile-avatar-large mb-3">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <h4 className="mb-1">{user.name}</h4>
              <p className="text-muted mb-3">{user.email}</p>
              <div className="role-display">
                <Shield size={18} className="me-2" />
                <span>{user.role?.toUpperCase()}</span>
              </div>
              <div className="profile-stats mt-4">
                <div className="stat-item">
                  <div className="stat-label">Account Status</div>
                  <div className="stat-value">
                    <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="stat-item mt-3">
                  <div className="stat-label">Email Verified</div>
                  <div className="stat-value">
                    {user.is_verified ? (
                      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '1.5rem' }}></i>
                    ) : (
                      <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '1.5rem' }}></i>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="profile-form-card">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Information</h5>
                {!editing && (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </Alert>
              )}

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="profile-label">
                        <User size={18} className="me-2" />
                        Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editing}
                        size="lg"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="profile-label">
                        <Mail size={18} className="me-2" />
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        size="lg"
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="profile-label">
                        <Phone size={18} className="me-2" />
                        Country Code
                      </Form.Label>
                      <Form.Select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        disabled={!editing}
                        size="lg"
                      >
                        <option value="+91">+91 (India)</option>
                        <option value="+1">+1 (USA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+86">+86 (China)</option>
                        <option value="+81">+81 (Japan)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="profile-label">
                        Mobile Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        disabled={!editing}
                        maxLength={10}
                        size="lg"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="profile-label">
                        <Shield size={18} className="me-2" />
                        Role
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.role}
                        disabled
                        size="lg"
                      />
                      <Form.Text className="text-muted">
                        Role is assigned by system administrator
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {editing && (
                  <div className="d-flex gap-3 mt-4">
                    <Button 
                      variant="primary" 
                      type="submit"
                      className="save-btn"
                    >
                      <Save size={18} className="me-2" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          countryCode: user.country_code || '+91',
                          mobileNumber: user.mobile_number || '',
                          role: user.role || 'admin'
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminProfile;