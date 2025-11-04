import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/Authentication';
import { showLoading, hideLoading } from '../../store/slices/ui';
import './SecondSignUp.css';
import landingCard from '../../assets/images/landingCard.png';
import logo from '../../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import FeaturesSection from '../common/FeaturesSection';

const SecondSignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.authentication);

  const [formData, setFormData] = useState({
    accountType: '',
    password: '',
    confirmPassword: '',
    isPregnant: false,
    expectedDueDate: ''
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
    const { name, value, type, checked } = e.target;
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        accountType: value,
        // Reset pregnancy fields when switching roles
        ...(value !== 'caregiver' ? { isPregnant: false, expectedDueDate: '' } : {})
      }));
      return;
    }
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
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
      dispatch(showLoading({ message: 'Creating your account...' }));
      const firstStepData = JSON.parse(localStorage.getItem('registrationData'));

      // Build request payload per enhanced API
      const userData = {
        firstName: firstStepData.firstName,
        middleName: firstStepData.middleName || '',
        surname: firstStepData.surname,
        email: (firstStepData.email || '').toLowerCase().trim(),
        password: formData.password,
        role: formData.accountType,
        // API expects capitalized Idnumber field
        Idnumber: firstStepData.idNumber || firstStepData.Idnumber || ''
      };

      // Caregiver pregnancy support
      if (userData.role === 'caregiver' && formData.isPregnant) {
        // Validate expectedDueDate is in the future
        const due = new Date(formData.expectedDueDate);
        const today = new Date();
        if (!(due instanceof Date) || isNaN(due.getTime()) || due <= today) {
          setMessage({ type: 'error', text: 'Expected due date must be in the future.' });
          return;
        }
        userData.isPregnant = true;
        userData.expectedDueDate = new Date(formData.expectedDueDate).toISOString();
      }

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
    } finally {
      dispatch(hideLoading());
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
              {/* Caregiver pregnancy fields */}
              {formData.accountType === 'caregiver' && (
                <div className="form-group" style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      name="isPregnant"
                      checked={formData.isPregnant}
                      onChange={handleInputChange}
                    />
                    I’m pregnant
                  </label>
                  {formData.isPregnant && (
                    <div style={{ marginTop: '8px' }}>
                      <label>Expected Due Date:</label>
                      <input
                        type="date"
                        name="expectedDueDate"
                        value={formData.expectedDueDate}
                        onChange={handleInputChange}
                        min={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}
                        required
                      />
                      <small style={{ display: 'block', color: '#666', marginTop: '4px' }}>
                        Must be a future date.
                      </small>
                    </div>
                  )}
                </div>
              )}
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

      <FeaturesSection />
    </div>
  );
};

export default SecondSignUp;