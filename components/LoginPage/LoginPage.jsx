import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, loginSuccess, loginFailure } from '../../store/slices/Authentication';
import authService from '../../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';
import logo from '../../assets/logo.jpg';
import FeaturesSection from '../common/FeaturesSection';

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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHamburgerClick = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

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
          navigate('/CareGiverHome', { replace: true });
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

      // TODO: Replace this with actual API call to your forgot password endpoint
      // const response = await authService.forgotPassword(forgotPasswordData.emailOrUsername);
      
      // For now, simulate a successful request
      setTimeout(() => {
        setForgotPasswordMessage('Password reset instructions have been sent to your email address.');
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error('Forgot Password Error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to send reset instructions. Please try again.'
      );
      setLoading(false);
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

        <button
          className="hamburger"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={handleHamburgerClick}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`mobile-nav${menuOpen ? ' open' : ' closed'}`}>
          <Link to="/how-it-works" onClick={closeMenu}>How it works</Link>
          <Link to="/benefits" onClick={closeMenu}>Benefits</Link>
          <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
          <Link to="/login" onClick={closeMenu} className="login-btn">Log in</Link>
          <Link to="/signup" onClick={closeMenu} className="signup-btn">Sign up</Link>
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
              {forgotPasswordMessage && (
                <div className="success-message" style={{
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  border: '1px solid #c3e6cb',
                  borderRadius: '5px',
                  padding: '10px',
                  marginBottom: '15px'
                }}>
                  <p>{forgotPasswordMessage}</p>
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
                    marginRight: '10px'
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
    </div>
  );
};

export default LoginPage;