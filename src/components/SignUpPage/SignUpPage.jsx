import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/Authentication';
import './SignUpPage.css';
import landingCard from '../../assets/images/landingCard.png';
import logo from '../../assets/logo.jpg';

const validateSouthAfricanID = (idNumber) => {
  // Remove any non-digit characters
  const cleanId = idNumber.replace(/\D/g, '');

  // Check if exactly 13 digits
  if (cleanId.length !== 13) {
    return 'ID number must be exactly 13 digits';
  }

  // Extract date components
  const year = parseInt(cleanId.substring(0, 2));
  const month = parseInt(cleanId.substring(2, 4));
  const day = parseInt(cleanId.substring(4, 6));

  // Convert to full year (assuming no one is over 100 years old)
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = year > currentYear ? 1900 + year : 2000 + year;

  // Validate date
  const dob = new Date(fullYear, month - 1, day);
  if (
    dob.getFullYear() !== fullYear ||
    dob.getMonth() !== month - 1 ||
    dob.getDate() !== day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return 'Invalid date in ID number';
  }

  // Validate gender and citizenship
  const genderNum = parseInt(cleanId.substring(6, 10));
  const citizenshipNum = parseInt(cleanId.substring(10, 11));
  if (genderNum < 0 || genderNum > 9999) {
    return 'Invalid gender digits in ID';
  }
  if (citizenshipNum < 0 || citizenshipNum > 1) {
    return 'Invalid citizenship digit in ID';
  }

  // Luhn algorithm validation
  const digits = cleanId.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let num = digits[i];
    if ((i + 1) % 2 === 0) {
      num *= 2;
      if (num > 9) num -= 9;
    }
    sum += num;
  }

  if (sum % 10 !== 0) {
    return 'Invalid ID number checksum';
  }

  return null; // validation passed
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, registrationStatus } = useSelector(state => state.authentication);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
      lastName: '',
      surname: '',
      email: '',
      idNumber: ''
    });
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const validateIdNumber = (idNumber) => {
    const cleanId = idNumber.replace(/\D/g, '');
    if (cleanId.length !== 13) {
      return 'ID number must be exactly 13 digits';
    }
    if (!/^\d+$/.test(cleanId)) {
      return 'ID number must contain only numbers';
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validations
    if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (formData.surname.length < 2) {
      errors.surname = 'Surname must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // ID Number validation
    const idError = validateIdNumber(formData.idNumber);
    if (idError) {
      errors.idNumber = idError;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'idNumber') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 13);
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();

    // Validate ID number first
    const idError = validateSouthAfricanID(formData.idNumber);
    if (idError) {
      setFormErrors(prev => ({
        ...prev,
        idNumber: idError
      }));
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const cleanedData = {
        ...formData,
        idNumber: formData.idNumber.replace(/\D/g, ''),
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
                <label>Second Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={formErrors.lastName ? 'error' : ''}
                  required
                />
                {formErrors.lastName && <p className="error-message">{formErrors.lastName}</p>}
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
                  maxLength="13"
                  pattern="\d*"
                  placeholder="Enter 13 digit ID number"
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

export default SignUpPage;