import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { userAPI } from '../../services/api';

const UserModal = ({ show, onHide, user, mode, onUserSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        countryCode: user.country_code || '+91',
        mobileNumber: user.mobile_number || '',
        isActive: user.is_active ?? true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        countryCode: '+91',
        mobileNumber: '',
        isActive: true
      });
    }
    setError('');
  }, [user, mode, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'edit' && user) {
        await userAPI.updateUser(user.id, {
          name: formData.name,
          country_code: formData.countryCode,
          mobile_number: formData.mobileNumber,
          is_active: formData.isActive
        });
        alert('User updated successfully!');
      } else {
        // Create functionality would require admin signup endpoint
        alert('Create user functionality - connect to admin signup endpoint');
      }
      
      onUserSaved();
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'edit' ? 'Edit User' : 'Add New User'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={mode === 'edit'}
              placeholder="user@example.com"
            />
            {mode === 'edit' && (
              <Form.Text className="text-muted">
                Email cannot be changed
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Country Code</Form.Label>
            <Form.Select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            >
              <option value="+91">+91 (India)</option>
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+86">+86 (China)</option>
              <option value="+81">+81 (Japan)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              maxLength={10}
              placeholder="1234567890"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="isActive"
              label="Active User"
              checked={formData.isActive}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                mode === 'edit' ? 'Update User' : 'Create User'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserModal;