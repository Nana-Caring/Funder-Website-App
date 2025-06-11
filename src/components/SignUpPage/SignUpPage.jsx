import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/Authentication';
import './SignUpPage.css';
import landingCard from '../../assets/images/landingCard.png';
import logo from '../../assets/logo.jpg';
import FeaturesSection from '../common/FeaturesSection';

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, registrationStatus } = useSelector(state => state.authentication);
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '', // Changed from lastName
    surname: '',
    email: '',
    idNumber: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Clear form data when component mounts or window refreshes
    const handleBeforeUnload = () => {
      localStorage.removeItem('registrationData');
    };

    // Add event listener for page refresh/close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clear any existing form data on mount
    setFormData({
      firstName: '',
      middleName: '', // Changed from lastName
      surname: '',
      email: '',
      idNumber: ''
    });
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const validateForm = () => {
    const errors = {};
    
    // Name validations
    if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    // Remove middleName validation since it's optional
    if (formData.surname.length < 2) {
      errors.surname = 'Surname must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const cleanedData = {
        ...formData,
        email: formData.email.toLowerCase().trim()
      };

      localStorage.setItem('registrationData', JSON.stringify(cleanedData));
      navigate('/second-signup');
    } catch (error) {
      setFormErrors(prev => ({
        ...prev,
        submit: 'Error saving form data'
      }));
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
          <form className="signup-form" onSubmit={handleNext}>
            <h2>Create a Nana account</h2>
            {formErrors.submit && <p className="error-message">{formErrors.submit}</p>}
            <p className="form-description">Follow the steps to create your account. Provide accurate information.</p>
            <div className="form-section">
              <h3>Personal Details</h3>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={formErrors.firstName ? 'error' : ''}
                  required
                />
                {formErrors.firstName && <p className="error-message">{formErrors.firstName}</p>}
              </div>
              <div className="form-group">
                <label>Middle Name:</label> {/* Changed from Second Name */}
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className={formErrors.middleName ? 'error' : ''}
                  placeholder="Optional" // Added to indicate it's optional
                />
                {formErrors.middleName && <p className="error-message">{formErrors.middleName}</p>}
              </div>
              <div className="form-group">
                <label>Surname:</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className={formErrors.surname ? 'error' : ''}
                  required
                />
                {formErrors.surname && <p className="error-message">{formErrors.surname}</p>}
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                  required
                />
                {formErrors.email && <p className="error-message">{formErrors.email}</p>}
              </div>
              <div className="form-group">
                <label>ID No:</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="Enter ID number"
                  required
                />
                {formErrors.idNumber && <p className="error-message">{formErrors.idNumber}</p>}
              </div>
            </div>
            <div className="form-navigation">
              <div className="nav-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
              </div>
              <div className="button-group">
                <button 
                  type="submit" 
                  className="next-btn" 
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Next →'}
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

export default SignUpPage;