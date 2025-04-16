import React from 'react';
import { Link } from 'react-router-dom';
import './SecondSignUp.css';
import landingCard from '../../assets/images/landingCard.png';
import logo from '../../assets/logo.jpg';

const SecondSignUp = () => {
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
          <form className="signup-form">
            <h2>Create a Nana account</h2>
            <p className="form-description">Follow the steps to create your account.Provide accurate information.</p>
            <div className="form-section">
              <div className="account-type-section">
                <p>Who is creating the account</p>
                <div className="radio-group">
                  <label>
                    <input type="checkbox" name="accountType" value="caregiver" />
                    Caregiver
                  </label>
                  <div className="funder-checkbox">
                    <label>
                      <input type="checkbox" name="accountType" value="funder" />
                      Funder
                    </label>
                  </div>
                </div>
              </div>
              <div className="password-section">
                <p>Confirm Passwords:</p>
                <div className="form-group">
                  <label>Password:</label>
                  <input type="password" placeholder="Enter password" required />
                </div>
                <div className="form-group">
                  <label>Confirm Password:</label>
                  <input type="password" placeholder="Re-enter password" required />
                </div>
              </div>
            </div>
            <div className="form-navigation">
              <div className="nav-dots">
                <span className="dot"></span>
                <span className="dot active"></span>
              </div>
              <button type="submit" className="signup">Sign up →</button>
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