import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import landingCard from '../../assets/images/landingCard.png';
import logo from '../../assets/logo.jpg';

const LandingPage = () => {
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
          <h1>Empowering Families, Ensuring Every Child's Needs Are Met.</h1>
          <p>A secure financial platform ensuring funds are used solely for children's essential needs.</p>
          <button className="download-btn">Download App</button>
        </div>
        <div className="hero-image">
          <img src={landingCard} alt="Nana Card" className="card-image" />
        </div>
      </div>

      <div className="features-section">
        <div className="feature-item">
          <h3>01</h3>
          <h4>Financial transaction</h4>
          <p>Manage financial transactions on the website and on the mobile app.</p>
        </div>

        <div className="feature-item">
          <h3>02</h3>
          <h4>Easy to use System</h4>
          <p>Each card can have its own unique holder name and balance.</p>
        </div>

        <div className="feature-item">
          <h3>03</h3>
          <h4>Secure and Reliable</h4>
          <p>Ensure all financial transactions are encrypted and securely processable to protect user data.</p>
        </div>

        <div className="feature-item">
          <h3>04</h3>
          <h4>Multi-Platform Accessibility</h4>
          <p>Users can manage financial transactions seamlessly across both web and mobile applications.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;