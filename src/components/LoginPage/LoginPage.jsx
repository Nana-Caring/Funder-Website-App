import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, loginSuccess, loginFailure } from '../../store/slices/Authentication';
import authService from '../../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import FeaturesSection from '../common/FeaturesSection';
import { API_ENDPOINTS, apiCall } from '../../utils/apiConfiguration';

// Styled components for popup - matching system theme
const PopupOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  fontFamily: "'Poppins', sans-serif"
};

const PopupContainer = {
  background: '#ffffff',
  padding: '32px',
  borderRadius: '12px',
  boxShadow: '0 10px 40px rgba(255, 165, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.15)',
  maxWidth: '420px',
  width: '90%',
  textAlign: 'center',
  border: '2px solid #FFA500EE',
  position: 'relative'
};

const PopupIcon = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  margin: '0 auto 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  background: 'linear-gradient(135deg, #FFA500EE, #FF8C00)',
  color: 'white',
  boxShadow: '0 4px 16px rgba(255, 165, 0, 0.3)'
};

const PopupTitle = {
  margin: '0 0 16px 0',
  color: '#008000',
  fontSize: '22px',
  fontWeight: '600',
  fontFamily: "'Poppins', sans-serif"
};

const PopupMessage = {
  margin: '0 0 28px 0',
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  fontFamily: "'Poppins', sans-serif"
};

const PopupButton = {
  background: '#008000',
  color: 'white',
  padding: '12px 32px',
  border: '2px solid #008000',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: "'Poppins', sans-serif",
  minWidth: '120px'
};

export const useAuth = () => {
  const { token, isAuthenticated, user } = useSelector(state => state.authentication);

  useEffect(() => {
    if (token) {
      authService.setupAxiosInterceptors(token);
    }
  }, [token]);

  return {
    isAuthenticated,
    user,
    token
  };
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: authError } = useSelector(state => state.authentication);

  // Add loading state
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    emailOrUsername: ''
  });
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      setLoading(true);

      // Dispatch login action
      const response = await dispatch(loginUser(formData)).unwrap();
      
      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }

      // Explicitly dispatch login success to update Redux state
      dispatch(loginSuccess({ 
        token: response.token, 
        user: response.user,
        accounts: response.accounts
      }));
      
      // Store the complete raw response in localStorage for funders
      // This ensures we have all the data received from the backend
      if (response.rawResponse) {
        localStorage.setItem('loginResponse', JSON.stringify(response.rawResponse));
      }

      // Store comprehensive user data in localStorage (redundant but ensures consistency)
      localStorage.setItem('token', response.token);
      localStorage.setItem('jwt', response.jwt || ''); // Store JWT if present
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userId', response.user.id);
      
      // Store all user details
      localStorage.setItem('firstName', response.user.firstName || '');
      localStorage.setItem('middleName', response.user.middleName || '');
      localStorage.setItem('surname', response.user.surname || '');
      localStorage.setItem('email', response.user.email || '');
      localStorage.setItem('userName', response.user.firstName || response.user.email || 'User');
      localStorage.setItem('Idnumber', response.user.Idnumber || '');
      localStorage.setItem('relation', response.user.relation || '');
      localStorage.setItem('createdAt', response.user.createdAt || '');
      localStorage.setItem('updatedAt', response.user.updatedAt || '');
      
      // Store account information if available
      if (response.user.account) {
        localStorage.setItem('account', JSON.stringify(response.user.account));
        localStorage.setItem('accountId', response.user.account.id || '');
        localStorage.setItem('accountType', response.user.account.accountType || '');
        localStorage.setItem('accountBalance', response.user.account.balance?.toString() || '0');
        localStorage.setItem('accountNumber', response.user.account.accountNumber || '');
        localStorage.setItem('parentAccountId', response.user.account.parentAccountId || '');
      }
      
      // Store accounts array if available in the response
      if (response.accounts && Array.isArray(response.accounts)) {
        localStorage.setItem('userAccounts', JSON.stringify(response.accounts));
        
        // Also store main account details for quick access
        const mainAccount = response.accounts.find(acc => 
          acc.accountType?.toLowerCase() === 'main' || 
          acc.accountType?.toLowerCase() === 'primary'
        );
        if (mainAccount) {
          localStorage.setItem('mainAccountId', mainAccount.id || '');
          localStorage.setItem('mainAccountNumber', mainAccount.accountNumber || '');
          localStorage.setItem('mainAccountBalance', mainAccount.balance?.toString() || '0');
        }
      }
      
      // For funder login specifically - store main account balance in one place
      if (response.user.role === 'funder') {
        const rawResponse = response.rawResponse;
        let mainBalance = '0';
        
        // Try to extract balance from various possible locations in the response
        if (rawResponse?.balance) {
          mainBalance = rawResponse.balance.toString();
        } else if (rawResponse?.accounts?.length > 0) {
          // Use the first account balance as main balance
          mainBalance = rawResponse.accounts[0].balance?.toString() || '0';
        } else if (response.accounts?.length > 0) {
          mainBalance = response.accounts[0].balance?.toString() || '0';
        }
        
        localStorage.setItem('funderMainBalance', mainBalance);
      }

      // Setup axios interceptors
      authService.setupAxiosInterceptors(response.token);

      // Use replace: true to prevent going back to login
      switch (response.user.role) {
        case 'caregiver':
          navigate('/caregiver-home', { replace: true });
          break;
        case 'dependent':
          navigate('/dependent-home', { replace: true });
          break;
        case 'funder':
          navigate('/dashboard', { replace: true });
          break;
        default:
          throw new Error('Invalid user role');
      }
      
    } catch (err) {
      console.error('Login Error:', err);
      
      // Clear any stored data on error
      localStorage.clear();
      dispatch(loginFailure(err.message));
      
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotPasswordMessage('');
    
    try {
      if (!forgotPasswordData.emailOrUsername) {
        setError('Please enter your email or username');
        return;
      }

      setLoading(true);

      console.log('🔄=== PASSWORD RESET DEBUG START ===');
      console.log('🌍 Environment:', import.meta.env.DEV ? 'DEVELOPMENT' : 'PRODUCTION');
      console.log('🎯 Target endpoint:', API_ENDPOINTS.FORGOT_PASSWORD);
      console.log('📧 Email/Username:', forgotPasswordData.emailOrUsername);
      console.log('⏰ Request timestamp:', new Date().toISOString());
      
      // Validate email format if it looks like an email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(forgotPasswordData.emailOrUsername)) {
        console.log('✅ Email format validation passed');
      } else {
        console.log('⚠️ Input appears to be username, not email format');
      }
      
      const requestData = { email: forgotPasswordData.emailOrUsername };
      console.log('📦 Request payload:', JSON.stringify(requestData, null, 2));
      
      // Enhanced debugging for frontend vs backend comparison
      console.log('🔍 === DETAILED REQUEST DEBUG ===');
      console.log('🌐 Full URL that will be called:', 
        window.location.origin + API_ENDPOINTS.FORGOT_PASSWORD);
      console.log('📋 Headers that will be sent:', {
        'Content-Type': 'application/json'
      });
      console.log('📝 Exact request body:', JSON.stringify(requestData));
      console.log('🔧 Request method: POST');
      console.log('⚙️ Browser User-Agent:', navigator.userAgent);
      
      const data = await apiCall(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      
      console.log('✅ API call successful!');
      console.log('📨 Server response data:', JSON.stringify(data, null, 2));
      console.log('🔍 Response type:', typeof data);
      console.log('📋 Response keys:', Object.keys(data || {}));
      
      // Check if the response indicates email was actually sent
      if (data && (data.success || data.message || data.status === 'success')) {
        console.log('🎉 Backend confirms email processing initiated');
        if (data.message) {
          console.log('💬 Backend message:', data.message);
          
          // Check if the message indicates a generic response (likely no email service configured)
          if (data.message === 'Request processed successfully' && !data.emailSent) {
            console.warn('🚨 === EMAIL SERVICE ISSUE DETECTED ===');
            console.warn('⚠️ Backend returned generic response without email confirmation');
            console.warn('⚠️ This indicates the email service is NOT configured on backend');
            console.warn('⚠️ NO EMAIL WAS ACTUALLY SENT despite success response');
            console.warn('⚠️ Backend needs email service setup (SMTP/SendGrid/etc.)');
            console.warn('🚨 === CONTACT BACKEND DEVELOPER ===');
          }
        }
      } else {
        console.log('⚠️ Backend response unclear - assuming success for now');
      }
      
      // Provide more specific feedback based on the response
      let userMessage = '';
      if (data.message === 'Request processed successfully' && !data.emailSent) {
        userMessage = `⚠️ Password reset request was received, but there appears to be an email service configuration issue on our servers. The email may not have been sent. Please contact technical support or try again later. Email: ${forgotPasswordData.emailOrUsername}`;
        console.warn('🚨 Showing user WARNING about confirmed email service issue');
      } else {
        userMessage = `Password reset instructions have been sent to ${forgotPasswordData.emailOrUsername}. Please check your inbox (and spam folder) for an email from our system. If you don't receive it within 5-10 minutes, please try again or contact support.`;
      }
      
      setForgotPasswordMessage(userMessage);
      setShowSuccessPopup(true);
      
      console.log('🔔 Success popup displayed to user');
      console.log('🔄=== PASSWORD RESET DEBUG END ===');

    } catch (err) {
      console.log('❌=== PASSWORD RESET ERROR DEBUG ===');
      console.error('🚨 Forgot Password Error Details:');
      console.error('📛 Error name:', err.name);
      console.error('📛 Error message:', err.message);
      console.error('📛 Error stack:', err.stack);
      
      if (err.response) {
        console.error('📛 Response status:', err.response.status);
        console.error('📛 Response data:', err.response.data);
        console.error('📛 Response headers:', err.response.headers);
      }
      
      if (err.message.includes('Network')) {
        console.error('🌐 Network error detected - check internet connection');
      } else if (err.message.includes('CORS')) {
        console.error('🚫 CORS error detected - server configuration issue');
      } else if (err.message.includes('404')) {
        console.error('🔍 404 error - endpoint not found on server');
      } else if (err.message.includes('429')) {
        console.error('⏱️ Rate limit exceeded - too many requests');
      } else if (err.message.includes('500')) {
        console.error('⚠️ Server error - backend processing failed');
      }
      
      let userMessage = '';
      if (err.message.includes('Network') || err.message.includes('fetch')) {
        userMessage = 'Network error: Please check your internet connection and try again.';
      } else if (err.message.includes('404')) {
        userMessage = 'Service unavailable: The password reset service is currently unavailable. Please try again later.';
      } else if (err.message.includes('429') || err.message.includes('Too Many Requests')) {
        userMessage = 'Too many password reset attempts. Please wait a few minutes before trying again. This helps keep your account secure.';
      } else if (err.message.includes('500')) {
        userMessage = 'Server error: There was an issue processing your request. Please try again or contact support.';
      } else {
        userMessage = err.message || 'Failed to send reset instructions. Please try again.';
      }
      
      console.error('👤 User will see error:', userMessage);
      console.log('❌=== ERROR DEBUG END ===');
      
      setError(userMessage);
    } finally {
      setLoading(false);
      console.log('🏁 Password reset request completed');
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setError('');
    setForgotPasswordMessage('');
    setForgotPasswordData({ emailOrUsername: '' });
  };

  const handleForgotPasswordInputChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value
    });
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setShowForgotPassword(false);
    setForgotPasswordMessage('');
    setForgotPasswordData({ emailOrUsername: '' });
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-left">
          <img src={logo} alt="Nana Logo" className="nav-logo" />
        </div>
        <div className="nav-center">
          <Link to="/how-it-works">How it works</Link>
          <Link to="/benefits">Benefits</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="nav-right">
          <Link to="/login" className="login-btn">Log in</Link>
          <Link to="/signup" className="signup-btn">Sign up</Link>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <p className="hero-text">
            Empowering<br />
            Families, Ensuring<br />
            Every Child's Needs<br />
            Are Met.
          </p>
          <p>A secure financial platform ensuring funds are used solely for children's essential needs.</p>
          <button className="download-btn">Download App</button>
        </div>
        <div className="login-form">
          {!showForgotPassword ? (
            // Login Form
            <form onSubmit={handleSubmit}>
              <h2>Login</h2>
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  {(error.includes('download') || error.includes('mobile app')) && (
                    <div className="app-download-options">
                      <a 
                        href="your-ios-app-link"
                        className="download-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download iOS App →
                      </a>
                      <a 
                        href="your-android-app-link"
                        className="download-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Android App →
                      </a>
                    </div>
                  )}
                </div>
              )}
              <p className="form-description">Provide your email and password</p>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="forgot-password-link">
                <button 
                  type="button" 
                  onClick={toggleForgotPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#000',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '10px',
                    padding: '0',
                    margin: '10px 0',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#FFD600'}
                  onMouseOut={e => e.currentTarget.style.color = '#000'}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="form-navigation">
                <button 
                  type="submit" 
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login →'}
                </button>
              </div>
            </form>
          ) : (
            // Forgot Password Form
            <form onSubmit={handleForgotPasswordSubmit}>
              <h2>Reset Password</h2>
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              <p className="form-description">Enter your email or username to receive password reset instructions</p>
              <div className="form-group">
                <label>Email or Username:</label>
                <input 
                  type="text" 
                  name="emailOrUsername"
                  value={forgotPasswordData.emailOrUsername}
                  onChange={handleForgotPasswordInputChange}
                  placeholder="Enter your email or username"
                  required 
                />
              </div>
              <div className="form-navigation">
                <button 
                  type="button" 
                  onClick={toggleForgotPassword}
                  style={{
                    background: '#f8f9fa',
                    color: '#6c757d',
                    height: '30px',
                    border: 'none',
                    alignContent: 'center',
                    padding: '0 10px',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#FFD600'}
                  onMouseOut={e => e.currentTarget.style.color = '#000'}
                >
                  ← 
                </button>
                <button 
                  type="submit" 
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <FeaturesSection />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }} onClick={closeSuccessPopup}>
          <div style={{
            background: 'var(--background, #ffffff)',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            border: '1px solid var(--border, #e5e7eb)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              background: 'var(--success, #10b981)',
              color: 'white',
              fontWeight: '600'
            }}>
              ✓
            </div>
            <h3 style={{
              margin: '0 0 8px 0',
              color: 'var(--foreground, #111827)',
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'inherit'
            }}>Email Sent</h3>
            <p style={{
              margin: '0 0 24px 0',
              color: 'var(--muted-foreground, #6b7280)',
              fontSize: '15px',
              lineHeight: '1.5',
              fontFamily: 'inherit'
            }}>
              Check your email for reset instructions.
            </p>
            <button 
              style={{
                background: 'var(--primary, #3b82f6)',
                color: 'var(--primary-foreground, #ffffff)',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                minWidth: '100px'
              }}
              onClick={closeSuccessPopup}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary-hover, #2563eb)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--primary, #3b82f6)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;