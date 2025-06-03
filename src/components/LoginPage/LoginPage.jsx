import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/Authentication';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';
import logo from '../../assets/logo.jpg';
import FeaturesSection from '../common/FeaturesSection';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector(state => state.authentication);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleNavigation = (role) => {
    switch (role) {
      case 'caregiver':
        navigate('/CareGiverHome');
        break;
      case 'dependent':
        navigate('/DependentHome');
        break;
      case 'funder':
        navigate('/dashboard');
        break;
      default:
        setError('Invalid user role');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      
      if (!result.user?.role) {
        throw new Error('User role not specified');
      }
      // Handle navigation based on role
      handleNavigation(result.user.role);
      
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please try again.');
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

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-left">
          <img src={logo} alt="Nana Logo" className="nav-logo" />
        </div>
        <div className="nav-center">
          <Link to="/service">Service</Link>
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
        </div>
      </div>

      <FeaturesSection />
    </div>
  );
};

export default LoginPage;