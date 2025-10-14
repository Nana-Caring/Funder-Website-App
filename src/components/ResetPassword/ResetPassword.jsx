import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../../services/authService';
import logo from '../../assets/logo.png';
import './ResetPassword.css';
import { API_ENDPOINTS, apiCall } from '../../utils/apiConfig';

const ResetPassword = () => {
  const location = useLocation();
  // Extract token and email from query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token') || '';
  const emailFromQuery = searchParams.get('email') || '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Set email from query param on mount
  useEffect(() => {
    if (emailFromQuery) {
      setFormData((prev) => ({ ...prev, email: emailFromQuery }));
    }
  }, [emailFromQuery]);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setError('Invalid reset link. Please request a new password reset.');
        return;
      }

      try {
        setLoading(true);
        
        // Verify token using API configuration
        const data = await apiCall(API_ENDPOINTS.VERIFY_RESET_TOKEN, {
          method: 'POST',
          body: JSON.stringify({ 
            token,
            email: formData.email || emailFromQuery 
          })
        });

        setTokenValid(true);
      } catch (err) {
        console.error('Token verification failed:', err);
        setTokenValid(false);
        setError(
          err.message || 
          'This reset link has expired or is invalid. Please request a new password reset.'
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (password) => {
  // if (password.length < 10) {
  //   return 'Password must be at least 10 characters long';
  // }
  // if (!/(?=.*[a-z])/.test(password)) {
  //   return 'Password must contain at least one lowercase letter';
  // }
  // if (!/(?=.*[A-Z])/.test(password)) {
  //   return 'Password must contain at least one uppercase letter';
  // }
  // if (!/(?=.*\d)/.test(password)) {
  //   return 'Password must contain at least one number';
  // }
  // if (!/(?=.*[@$!%*?&])/.test(password)) {
  //   return 'Password must contain at least one special character (@$!%*?&)';
  // }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);
      
      // Call the reset password API using API configuration
      const data = await apiCall(API_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ 
          email: formData.email, 
          token, 
          newPassword: formData.password 
        })
      });

      if (data.success) {
        setSuccess('Password reset successful! You can now log in with your new password.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        throw new Error(data.message || 'Reset failed. Please try again.');
      }
    } catch (err) {
      console.error('Password reset failed:', err);
      let errorMsg = 'Failed to reset password. Please try again or request a new reset link.';
      if (err?.message && typeof err.message === 'string') {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && tokenValid === null) {
    return (
      <div className="reset-password-page">
        <nav className="reset-nav">
          <div className="nav-left">
            <img src={logo} alt="Nana Logo" className="nav-logo" />
          </div>
        </nav>
        <div className="reset-container">
          <div className="reset-form-wrapper">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Verifying reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="reset-password-page">
        <nav className="reset-nav">
          <div className="nav-left">
            <img src={logo} alt="Nana Logo" className="nav-logo" />
          </div>
        </nav>
        <div className="reset-container">
          <div className="reset-form-wrapper">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h2>Invalid Reset Link</h2>
              <p className="error-message">{error}</p>
                <div className="reset-url-container">
                  <p>Reset Password URL for testing:</p>
                  <code style={{wordBreak: 'break-all', background: '#f5f5f5', padding: '8px', display: 'block'}}>
                    {window.location.origin + '/reset-password?token=' + (token || '[token]') + '&email=' + (formData.email || '[email]')}
                  </code>
                </div>
              <div className="action-buttons">
              </div>
                {/* Removed action buttons for a cleaner UI */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="reset-password-page">
        <nav className="reset-nav">
          <div className="nav-left">
            <img src={logo} alt="Nana Logo" className="nav-logo" />
          </div>
        </nav>
        <div className="reset-container">
          <div className="reset-form-wrapper">
            <div className="success-container">
              <div className="success-icon">✅</div>
              <h2>Password Reset Successful!</h2>
              <p className="success-message">{success}</p>
              <div className="redirect-info">
                <p>Redirecting to login page in 3 seconds...</p>
              </div>
              <Link to="/login" className="btn btn-primary">
                Go to Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="reset-password-page">
      <nav className="reset-nav">
        <div className="nav-left">
          <img src={logo} alt="Nana Logo" className="nav-logo" />
        </div>
        <div className="nav-right">
          <Link to="/login" className="login-link">Back to Login</Link>
        </div>
      </nav>
      
      <div className="reset-container">
        <div className="reset-form-wrapper">
          <div className="reset-form">
            <h2>Reset Your Password</h2>
            <p className="form-description">
              Please enter your new password below. Make sure it's strong and secure.
            </p>
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                  />
                </div>
              <div className="form-group">
                <label htmlFor="password">New Password:</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your new password"
                    required 
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password:</label>
                <div className="password-input-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your new password"
                    required 
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              {false && (
                <div className="password-requirements">
                  <p>Password requirements:</p>
                  <ul>
                    <li className={formData.password.length >= 10 ? 'valid' : ''}>
                      At least 10 characters long
                    </li>
                    <li className={/(?=.*[a-z])/.test(formData.password) ? 'valid' : ''}>
                      One lowercase letter
                    </li>
                    <li className={/(?=.*[A-Z])/.test(formData.password) ? 'valid' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/(?=.*\d)/.test(formData.password) ? 'valid' : ''}>
                      One number
                    </li>
                    {/* <li className={/(?=.*[@$!%*?&])/.test(formData.password) ? 'valid' : ''}>
                      One special character (@$!%*?&)
                    </li> */}
                  </ul>
                </div>
              )}
              
              <div className="form-navigation">
                <button 
                  type="submit" 
                  className="reset-submit-btn"
                  disabled={loading || !formData.password || !formData.confirmPassword}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
