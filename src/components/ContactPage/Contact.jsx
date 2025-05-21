import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { FaCreditCard, FaUser, FaUsers } from 'react-icons/fa';
import fraud from '../../assets/icons/fraud.png';
import contact from '../../assets/icons/contact-person.png';

const Contact = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-left">
          <img src={logo} alt="Nana Logo" className="nav-logo" />
        </div>
        <div className="nav-center">
          <Link to="/how-it-works">How it works</Link>
          <Link to="/benefits">Benefits</Link>
          <Link to="/contact" className="active">Contact Us</Link>
        </div>
        <div className="nav-right">
          <Link to="/login" className="login-btn">Log in</Link>
          <Link to="/signup" className="signup-btn">Sign up</Link>
        </div>
      </nav>

      <div className="main-content contact-content">
        <div className="contact-form-section">
          <h2 className="contact-title">CONTACT US</h2>
          <p className="contact-desc">Please send us an email by filling the form</p>
          <form className="contact-form">
            <label>Email Address:</label>
            <input type="email" required />
            <label>Subject:</label>
            <input type="text" required />
            <label>Message:</label>
            <textarea rows="3" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div className="contact-info-section">
          <div className="fraud-card">
            <div className="fraud-content">
              <div className="fraud-header">
                <img src={fraud} alt="contact person" className="contact-person-icon" />
                <h2>Reduction in Fraud</h2>
              </div>
              <div>
                <p>By restricting the use of funds to specific categories</p>
                <p>and stores, there's a built-in mechanism to reduce</p>
                <p>fraudulent activities</p>
                <div className="contact-icons">
                  <img src={contact} alt="contact person" className="contact-person-icon" />
                  <span className="contact-numbers">01234567890 / 014523685674</span>
                </div>
              </div>
            </div>
          </div>
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
          <p>Ensures all financial transactions are encrypted and securely processed to protect user data.</p>
        </div>
        <div className="feature-item">
          <p className="feature-number">04</p>
          <p className="feature-title">Multi-Platform Accessibility</p>
          <p>Users can manage financial transactions seamlessly across both web and mobile applications.</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .landing-page {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
        }
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          padding: 1rem 4%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .main-content.contact-content {
          margin-top: 110px;
          padding: 0 4%;
          display: flex;
          gap: 1.2rem;
          min-height: calc(100vh - 110px - 180px); /* navbar + features section height */
          align-items: center;
          justify-content: center;
        }
        .contact-form-section {
          flex: 1;
          max-width: 270px;
        }
        .contact-title {
          color: #14532d;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.3rem;
        }
        .contact-desc {
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        .contact-form {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          padding: 0.7rem 0.7rem 0.5rem 0.7rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .contact-form label {
          font-size: 0.85rem;
          color: #14532d;
          font-weight: 500;
        }
        .contact-form input, .contact-form textarea {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 0.3rem;
          font-size: 0.85rem;
          font-family: inherit;
        }
        .contact-form button {
          margin-top: 0.4rem;
          background: #222;
          color: #fff;
          border: none;
          border-radius: 20px;
          padding: 0.4rem 1rem;
          font-size: 0.85rem;
          cursor: pointer;
          align-self: flex-end;
        }
        .contact-info-section {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }
        .fraud-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          padding: 1rem 1.2rem;
          margin-top: 1.2rem;
          width: 100%;
        }
        .fraud-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .fraud-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .fraud-card h2 {
          font-size: 1.1rem;
          color: #14532d;
          font-weight: 700;
          margin: 0;
        }
        .fraud-card p {
          color: #666;
          font-size: 0.95rem;
          margin: 0 0 0.5rem 0;
        }
        .fraud-card img.contact-person-icon {
          width: 24px;
          height: 24px;
          margin-right: 0.5rem;
        }
        .contact-icons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .contact-person-icon {
          width: 24px;
          height: 24px;
        }
        .contact-numbers {
          font-size: 0.95rem;
          color: #14532d;
          font-weight: 500;
        }
        .features-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 1.2rem;
          width: 95%;
          margin-left: auto;
          margin-right: auto;
        }
        .feature-item { padding: 0.5rem; }
        .feature-item .feature-number { font-size: 16px; color: black; margin-bottom: 0.15rem; }
        .feature-item .feature-title { font-size: 13px; color: #FFA500EE; margin-bottom: 0.15rem; }
        .feature-item p:last-child { color: #666; font-size: 0.7rem; line-height: 1.2; }
        @media (max-width: 1024px) {
          .main-content.contact-content { flex-direction: column; min-height: unset; }
          .features-section { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .main-content.contact-content { flex-direction: column; gap: 0.7rem; min-height: unset; }
          .features-section { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Contact; 