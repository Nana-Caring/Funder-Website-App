import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/Authentication';
import './SecondSignUp.css';
import landingCard from '../../assets/images/landingCard.png';
import logo from '../../assets/logo.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SecondSignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.authentication);

  const [formData, setFormData] = useState({
    accountType: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Add message styles to your CSS file
  const messageStyles = {
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '1rem',
      borderRadius: '4px',
      marginBottom: '1rem'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '1rem',
      borderRadius: '4px',
      marginBottom: '1rem'
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setFormData({
        ...formData,
        accountType: value
      });
      console.log('Selected role:', value);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleBack = () => {
    // Save current form data before going back
    localStorage.setItem('secondStepData', JSON.stringify(formData));
    navigate('/signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: "Passwords don't match!"
      });
      return;
    }

    try {
      const firstStepData = JSON.parse(localStorage.getItem('registrationData'));

      const userData = {
        ...firstStepData,
        password: formData.password,
        role: formData.accountType,
        Idnumber: firstStepData.idNumber || ''
      };

      await dispatch(registerUser(userData)).unwrap();
      setMessage({
        type: 'success',
        text: 'Registration successful! Redirecting to dashboard...'
      });
      
      // Clear storage and redirect after a short delay
      setTimeout(() => {
        localStorage.removeItem('registrationData');
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Registration failed:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Registration failed. Please try again.'
      });
    }
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
        <div className="registration-form">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Create a Nana account</h2>
            
            {/* Add message display */}
            {message.text && (
              <div style={messageStyles[message.type]}>
                {message.text}
              </div>
            )}

            {error && <p className="error-message">{error}</p>}
            <p className="form-description">Follow the steps to create your account. Provide accurate information.</p>
            <div className="form-section">
              <div className="account-type-section">
                <p>Select your role:</p>
                <div className="radio-group">
                  <label className={`role-option ${formData.accountType === 'caregiver' ? 'selected' : ''}`}>
                    <input 
                      type="radio"
                      name="accountType"
                      value="caregiver"
                      checked={formData.accountType === 'caregiver'}
                      onChange={handleInputChange}
                      required
                    />
                    Caregiver
                  </label>
                  <label className={`role-option ${formData.accountType === 'funder' ? 'selected' : ''}`}>
                    <input 
                      type="radio"
                      name="accountType"
                      value="funder"
                      checked={formData.accountType === 'funder'}
                      onChange={handleInputChange}
                      required
                    />
                    Funder
                  </label>
                </div>
              </div>
              <div className="password-section">
                <p>Confirm Passwords:</p>
                <div className="form-group">
                  <label>Password:</label>
                  <div className="password-input-container">
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password" 
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
                <div className="form-group">
                  <label>Confirm Password:</label>
                  <div className="password-input-container">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required 
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-navigation">
              <div className="nav-dots">
                <span className="dot"></span>
                <span className="dot active"></span>
              </div>
              <div className="button-group">
                <button 
                  type="button" 
                  className="back-btn" 
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button 
                  type="submit" 
                  className="signup"
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign up'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-item">
          <p className="feature-number">01</p>
          <p className="feature-title">Financial transaction</p>
          <p>Manage financial transactions on the website and on the mobile app.</p>
        </div>

        <div className="feature-item">
          <p className="feature-number">02</p>
          <p className="feature-title">Easy to use System</p>
          <p>Each card can have its own unique holder name and balance.</p>
        </div>

        <div className="feature-item">
          <p className="feature-number">03</p>
          <p className="feature-title">Secure and Reliable</p>
          <p>Ensure all financial transactions are encrypted and securely processable to protect user data.</p>
        </div>

        <div className="feature-item">
          <p className="feature-number">04</p>
          <p className="feature-title">Multi-Platform Accessibility</p>
          <p>Users can manage financial transactions seamlessly across both web and mobile applications.</p>
        </div>
      </div>
    </div>
  );
};

export default SecondSignUp;