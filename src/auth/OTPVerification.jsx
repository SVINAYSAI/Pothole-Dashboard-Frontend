import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import './OTPVerification.css';

const OTPVerification = ({ show, onHide, email, onVerificationSuccess }) => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (!show) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOTP = pastedData.split('');
    setOTP(newOTP);
    inputRefs.current[5]?.focus();
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (timeLeft === 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, otpString);
      toast.success(response.data.message);
      
      setTimeout(() => {
        if (onVerificationSuccess) onVerificationSuccess();
        onHide();
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Invalid OTP. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.resendOTP(email);
      toast.success(response.data.message);
      setTimeLeft(600); // Reset timer
      setOTP(['', '', '', '', '', '']); // Clear OTP inputs
      inputRefs.current[0]?.focus();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // Reset on close
  const handleClose = () => {
    setOTP(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
    setTimeLeft(600);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" className="otp-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <div className="otp-icon mb-3">
            <div className="icon-circle">
              <i className="bi bi-envelope-check-fill"></i>
            </div>
          </div>
          <h4 className="fw-bold">Email Verification</h4>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 pb-4">
        <p className="text-center text-muted mb-4">
          We've sent a 6-digit verification code to<br />
          <strong className="text-primary">{email}</strong>
        </p>


        <Form onSubmit={handleVerify}>
          <div className="otp-input-container mb-4" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="text-center mb-4">
            <div className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
              <i className="bi bi-clock me-2"></i>
              Time remaining: <strong>{formatTime(timeLeft)}</strong>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100 mb-3 verify-btn"
            disabled={loading || otp.join('').length !== 6 || timeLeft === 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Verifying...
              </>
            ) : (
              <>
                <i className="bi bi-shield-check me-2"></i>
                Verify OTP
              </>
            )}
          </Button>

          <div className="text-center">
            <span className="text-muted">Didn't receive the code?</span>
            <Button
              variant="link"
              onClick={handleResend}
              disabled={resendLoading || timeLeft > 540} // Can resend after 1 minute
              className="p-0 ms-2 fw-bold resend-btn"
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OTPVerification;