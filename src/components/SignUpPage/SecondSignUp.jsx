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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateSouthAfricanID = (idNumber) => {
    const cleanId = idNumber.replace(/\D/g, '');

    if (cleanId.length !== 13) {
      return false;
    }

    if (!/^\d+$/.test(cleanId)) {
      return false;
    }

    const year = parseInt(cleanId.substring(0, 2));
    const month = parseInt(cleanId.substring(2, 4));
    const day = parseInt(cleanId.substring(4, 6));

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }

    return true;
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const firstStepData = JSON.parse(localStorage.getItem('registrationData'));

      if (!validateSouthAfricanID(firstStepData.idNumber)) {
        alert("Please enter a valid 13-digit South African ID number");
        return;
      }

      const userData = {
        ...firstStepData,
        password: formData.password,
        role: formData.accountType,
        idNumber: firstStepData.idNumber.replace(/\D/g, '')
      };

      console.log('Submitting registration data:', userData);
      await dispatch(registerUser(userData)).unwrap();
      localStorage.removeItem('registrationData');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err.message || 'Registration failed. Please try again.');
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
                  {loading ? 'Signing up...' : 'Sign up →'}
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