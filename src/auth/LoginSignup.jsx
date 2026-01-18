import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { authAPI } from '../services/api';
import OTPVerification from './OTPVerification';
import ForgotPasswordModal from './ForgotPasswordModal';
import { toast } from 'react-toastify';
import './LoginSignup.css';

const LoginSignup = ({ onLogin }) => {
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [validationErrors, setValidationErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  
  const navigate = useNavigate();

  // Validation Functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setLoading(true);
    
    try {
      const response = await authAPI.login(loginEmail, loginPassword);
      const { token, data, role } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', role);

      if (onLogin) onLogin();
      
      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    
    const errors = {};

    if (!signupName.trim()) errors.name = 'Name is required';
    if (!validateEmail(signupEmail)) errors.email = 'Please enter a valid email address';
    if (!validatePassword(signupPassword)) errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    if (signupPassword !== signupConfirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!validatePhone(mobileNumber)) errors.phone = 'Please enter a valid 10-digit mobile number';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        email: signupEmail,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
        name: signupName,
        countryCode: countryCode,
        mobileNumber: mobileNumber
      };

      await authAPI.signup(userData);
      
      setPendingVerificationEmail(signupEmail);
      setShowOTPModal(true);
      
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setMobileNumber('');
      
      toast.success('Registration successful! Please check your email for OTP.');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setActiveTab('login');
    setLoginEmail(pendingVerificationEmail);
    setPendingVerificationEmail('');
    toast.success('Email verified successfully! You can now login.');
  };

  const passwordChecks = getPasswordStrength(signupPassword);

  return (
    <>
      <div className="modern-auth-container">
        <div className="auth-wrapper">
          <div className="auth-content-card">
            {/* Left Side - Welcome Panel */}
            <div className={`welcome-panel ${activeTab === 'signup' ? 'panel-signup' : 'panel-login'}`}>
              <div className="welcome-content">
                {activeTab === 'login' ? (
                  <>
                    <h1 className="welcome-title">Welcome Back!</h1>
                    <p className="welcome-subtitle">Sign in to continue your journey with us</p>
                    <button 
                      className="switch-btn"
                      onClick={() => {
                        setActiveTab('signup');
                        setValidationErrors({});
                      }}
                    >
                      Create Account
                    </button>
                  </>
                ) : (
                  <>
                    <h1 className="welcome-title">Hello, Friend!</h1>
                    <p className="welcome-subtitle">Enter your personal details and start your journey with us</p>
                    <button 
                      className="switch-btn"
                      onClick={() => {
                        setActiveTab('login');
                        setValidationErrors({});
                      }}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Side - Form Panel */}
            <div className="form-panel">
              {activeTab === 'login' ? (
                // Login Form
                <div className="form-content">
                  <h2 className="form-title">Sign In</h2>
                  
                  <div className="social-login">
                    <button type="button" className="social-btn google">
                      <i className="bi bi-google"></i>
                    </button>
                    <button type="button" className="social-btn facebook">
                      <i className="bi bi-facebook"></i>
                    </button>
                    <button type="button" className="social-btn github">
                      <i className="bi bi-github"></i>
                    </button>
                  </div>

                  <div className="divider">
                    <span>OR</span>
                  </div>

                  <p className="form-subtitle">Use Your Email To Sign In</p>

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Email Address"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className={`modern-input ${validationErrors.email ? 'is-invalid' : ''}`}
                      />
                      {validationErrors.email && (
                        <div className="invalid-feedback">{validationErrors.email}</div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <InputGroup>
                        <Form.Control
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className={`modern-input ${validationErrors.password ? 'is-invalid' : ''}`}
                        />
                        <Button
                          variant="link"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="password-toggle"
                        >
                          <i className={`bi bi-eye${showLoginPassword ? '-slash' : ''}`}></i>
                        </Button>
                      </InputGroup>
                      {validationErrors.password && (
                        <div className="invalid-feedback">{validationErrors.password}</div>
                      )}
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="custom-checkbox">
                        <input type="checkbox" id="rememberMe" />
                        <label htmlFor="rememberMe">Remember me</label>
                      </div>
                      <a 
                        href="#" 
                        className="forgot-password-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowForgotModal(true);
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      className="modern-submit-btn w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <Link to="/admin_registration" className="admin-link">
                        <i className="bi bi-shield-lock me-2"></i>
                        Admin Registration
                      </Link>
                    </div>
                  </Form>
                </div>
              ) : (
                // Signup Form
                <div className="form-content">
                  <h2 className="form-title">Create Account</h2>
                  
                  <div className="social-login">
                    <button type="button" className="social-btn google">
                      <i className="bi bi-google"></i>
                    </button>
                    <button type="button" className="social-btn facebook">
                      <i className="bi bi-facebook"></i>
                    </button>
                    <button type="button" className="social-btn github">
                      <i className="bi bi-github"></i>
                    </button>
                  </div>

                  <div className="divider">
                    <span>OR</span>
                  </div>

                  <p className="form-subtitle">Fill Out The Following Info For Registration</p>

                  <Form onSubmit={handleSignup}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Full Name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        className={`modern-input ${validationErrors.name ? 'is-invalid' : ''}`}
                      />
                      {validationErrors.name && (
                        <div className="invalid-feedback">{validationErrors.name}</div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Email Address"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className={`modern-input ${validationErrors.email ? 'is-invalid' : ''}`}
                      />
                      {validationErrors.email && (
                        <div className="invalid-feedback">{validationErrors.email}</div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <InputGroup>
                        <Form.Control
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          className={`modern-input ${validationErrors.password ? 'is-invalid' : ''}`}
                        />
                        <Button
                          variant="link"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="password-toggle"
                        >
                          <i className={`bi bi-eye${showSignupPassword ? '-slash' : ''}`}></i>
                        </Button>
                      </InputGroup>
                      {validationErrors.password && (
                        <div className="invalid-feedback">{validationErrors.password}</div>
                      )}
                      {signupPassword && (
                        <div className="password-strength mt-2">
                          <div className={`strength-item ${passwordChecks.length ? 'met' : ''}`}>
                            <i className={`bi bi-${passwordChecks.length ? 'check-circle-fill' : 'circle'}`}></i>
                            <span>8+ characters</span>
                          </div>
                          <div className={`strength-item ${passwordChecks.uppercase ? 'met' : ''}`}>
                            <i className={`bi bi-${passwordChecks.uppercase ? 'check-circle-fill' : 'circle'}`}></i>
                            <span>Uppercase</span>
                          </div>
                          <div className={`strength-item ${passwordChecks.lowercase ? 'met' : ''}`}>
                            <i className={`bi bi-${passwordChecks.lowercase ? 'check-circle-fill' : 'circle'}`}></i>
                            <span>Lowercase</span>
                          </div>
                          <div className={`strength-item ${passwordChecks.number ? 'met' : ''}`}>
                            <i className={`bi bi-${passwordChecks.number ? 'check-circle-fill' : 'circle'}`}></i>
                            <span>Number</span>
                          </div>
                          <div className={`strength-item ${passwordChecks.special ? 'met' : ''}`}>
                            <i className={`bi bi-${passwordChecks.special ? 'check-circle-fill' : 'circle'}`}></i>
                            <span>Special char</span>
                          </div>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          required
                          className={`modern-input ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                        />
                        <Button
                          variant="link"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="password-toggle"
                        >
                          <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                        </Button>
                      </InputGroup>
                      {validationErrors.confirmPassword && (
                        <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <InputGroup>
                        <Form.Select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="modern-input country-code-select"
                        >
                          <option value="+91">+91 (India)</option>
                          <option value="+1">+1 (USA/Canada)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (Australia)</option>
                          <option value="+81">+81 (Japan)</option>
                        </Form.Select>
                        <Form.Control
                          type="tel"
                          placeholder="Mobile Number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          maxLength={10}
                          required
                          className={`modern-input ${validationErrors.phone ? 'is-invalid' : ''}`}
                        />
                      </InputGroup>
                      {validationErrors.phone && (
                        <div className="invalid-feedback">{validationErrors.phone}</div>
                      )}
                    </Form.Group>

                    <Button
                      type="submit"
                      className="modern-submit-btn w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <OTPVerification
        show={showOTPModal}
        onHide={() => setShowOTPModal(false)}
        email={pendingVerificationEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <ForgotPasswordModal
        show={showForgotModal}
        onHide={() => setShowForgotModal(false)}
      />
    </>
  );
};

export default LoginSignup;