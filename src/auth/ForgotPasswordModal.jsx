import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ show, onHide }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(600);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (show && step === 2) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [show, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setStep(2);
      setTimeLeft(600);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to send reset email';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    // We don't verify OTP solo here, we do it with the new password in the final step 
    // to keep it simple or we can verify now. The backend `reset-password` requires OTP and new_password.
    // So let's just move to step 3.
    setStep(3);
    setError('');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authAPI.resetPassword(email, otp.join(''), newPassword);
      toast.success('Password reset successful! You can now login.');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to reset password';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setOTP(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="forgot-password-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="w-100 text-center">
          <h4 className="fw-bold">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'New Password'}
          </h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">

        {step === 1 && (
          <Form onSubmit={handleEmailSubmit}>
            <p className="text-center text-muted mb-4">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            <Form.Group className="mb-4">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modern-input"
              />
            </Form.Group>
            <Button type="submit" className="w-100 modern-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleOTPSubmit}>
            <p className="text-center text-muted mb-4">
              We've sent a code to <strong>{email}</strong>
            </p>
            <div className="otp-input-container mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className="forgot-otp-input"
                />
              ))}
            </div>
            <div className="text-center mb-4">
              <small className="text-muted">
                Time remaining: <strong>{formatTime(timeLeft)}</strong>
              </small>
            </div>
            <Button type="submit" className="w-100 modern-submit-btn">
              Continue
            </Button>
          </Form>
        )}

        {step === 3 && (
          <Form onSubmit={handleResetSubmit}>
            <p className="text-center text-muted mb-4">Create a strong new password for your account.</p>
            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="modern-input"
                />
                <Button variant="link" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4">
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="modern-input"
                />
                <Button variant="link" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                  <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                </Button>
              </InputGroup>
            </Form.Group>
            <Button type="submit" className="w-100 modern-submit-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
