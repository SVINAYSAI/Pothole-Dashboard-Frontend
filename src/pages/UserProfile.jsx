import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { userAPI } from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    countryCode: '+91',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(storedUser);
      setFormData({
        name: storedUser.name || '',
        email: storedUser.email || '',
        mobileNumber: storedUser.mobileNumber || '',
        countryCode: storedUser.countryCode || '+91',
      });
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // API call to update profile
      const response = await userAPI.updateProfile(formData);
      
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
      countryCode: user.countryCode || '+91',
    });
    setEditMode(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <Container fluid>
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Row className="g-4">
          {/* Profile Card */}
          <Col lg={4}>
            <Card className="profile-card">
              <Card.Body className="text-center">
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h4 className="profile-name">{user?.name || 'User'}</h4>
                <p className="profile-email">{user?.email || 'user@example.com'}</p>
                <div className="profile-badge">
                  <i className="bi bi-patch-check-fill me-2"></i>
                  Verified User
                </div>
              </Card.Body>
            </Card>

            <Card className="profile-stats-card">
              <Card.Body>
                <h6 className="stats-title">Account Statistics</h6>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Member Since</p>
                    <p className="stat-value">January 2024</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Sessions</p>
                    <p className="stat-value">24</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Profile Details */}
          <Col lg={8}>
            <Card className="profile-details-card">
              <Card.Header>
                <div className="card-header-content">
                  <h5 className="card-title">Personal Information</h5>
                  {!editMode ? (
                    <Button variant="primary" size="sm" onClick={() => setEditMode(true)}>
                      <Edit2 size={16} className="me-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="edit-actions">
                      <Button variant="success" size="sm" onClick={handleSave} disabled={saving}>
                        <Save size={16} className="me-2" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={handleCancel}>
                        <X size={16} className="me-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          <User size={18} className="me-2" />
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!editMode}
                          className="form-input-custom"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          <Mail size={18} className="me-2" />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={true}
                          className="form-input-custom"
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          <Phone size={18} className="me-2" />
                          Mobile Number
                        </Form.Label>
                        <div className="phone-input-group">
                          <Form.Select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="country-code-select"
                          >
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                          </Form.Select>
                          <Form.Control
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="form-input-custom"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          <MapPin size={18} className="me-2" />
                          Location
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value="India"
                          disabled
                          className="form-input-custom"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile;