import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { authAPI } from '../services/api';
import OTPVerification from '../auth/OTPVerification';
import './AdminRegistration.css';

const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+91',
    mobileNumber: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return email.includes('@') && email.length > 3;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const getPasswordStrength = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!validatePhone(formData.mobileNumber)) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    
    try {
      await authAPI.adminRegister(formData);
      
      setPendingVerificationEmail(formData.email);
      setShowOTPModal(true);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        countryCode: '+91',
        mobileNumber: ''
      });
    } catch (error) {
      setError(error.response?.data?.detail || 'Admin registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    alert('✅ Admin account created successfully! Please login.');
    navigate('/');
  };

  const passwordChecks = getPasswordStrength(formData.password);

  return (
    <>
      <div className="admin-registration-container">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={7}>
              <Card className="admin-reg-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <div className="admin-icon mb-3">
                      <i className="bi bi-shield-lock-fill"></i>
                    </div>
                    <h1 className="admin-title">Admin Registration</h1>
                    <p className="admin-subtitle">Create your administrator account</p>
                  </div>

                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-admin">
                        <i className="bi bi-person me-2"></i>
                        Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        size="lg"
                        isInvalid={!!validationErrors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-admin">
                        <i className="bi bi-envelope me-2"></i>
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="admin@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        size="lg"
                        isInvalid={!!validationErrors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-admin">
                        <i className="bi bi-phone me-2"></i>
                        Mobile Number
                      </Form.Label>
                      <InputGroup size="lg">
                        <Form.Select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          style={{ maxWidth: '120px' }}
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+86">+86 (CN)</option>
                          <option value="+81">+81 (JP)</option>
                        </Form.Select>
                        <Form.Control
                          type="tel"
                          name="mobileNumber"
                          placeholder="1234567890"
                          value={formData.mobileNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setFormData(prev => ({ ...prev, mobileNumber: value }));
                          }}
                          maxLength={10}
                          required
                          isInvalid={!!validationErrors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.phone}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-admin">
                        <i className="bi bi-lock me-2"></i>
                        Password
                      </Form.Label>
                      <InputGroup size="lg">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          isInvalid={!!validationErrors.password}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </Button>
                      </InputGroup>
                      {formData.password && (
                        <div className="password-requirements mt-2">
                          <small className="d-block mb-1 fw-bold">Password Requirements:</small>
                          <div className="requirements-list">
                            <div className={`requirement-item ${passwordChecks.length ? 'met' : 'unmet'}`}>
                              <i className={`bi bi-${passwordChecks.length ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                              <span>At least 8 characters</span>
                            </div>
                            <div className={`requirement-item ${passwordChecks.uppercase ? 'met' : 'unmet'}`}>
                              <i className={`bi bi-${passwordChecks.uppercase ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                              <span>One uppercase letter</span>
                            </div>
                            <div className={`requirement-item ${passwordChecks.lowercase ? 'met' : 'unmet'}`}>
                              <i className={`bi bi-${passwordChecks.lowercase ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                              <span>One lowercase letter</span>
                            </div>
                            <div className={`requirement-item ${passwordChecks.number ? 'met' : 'unmet'}`}>
                              <i className={`bi bi-${passwordChecks.number ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                              <span>One number</span>
                            </div>
                            <div className={`requirement-item ${passwordChecks.special ? 'met' : 'unmet'}`}>
                              <i className={`bi bi-${passwordChecks.special ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                              <span>One special character</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-admin">
                        <i className="bi bi-lock-fill me-2"></i>
                        Confirm Password
                      </Form.Label>
                      <InputGroup size="lg">
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          isInvalid={!!validationErrors.confirmPassword}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.confirmPassword}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="w-100 admin-submit-btn mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Creating Admin Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          Register as Admin
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <Link to="/" className="back-to-login-link">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Login
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <OTPVerification
        show={showOTPModal}
        onHide={() => setShowOTPModal(false)}
        email={pendingVerificationEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
};

export default AdminRegistration;