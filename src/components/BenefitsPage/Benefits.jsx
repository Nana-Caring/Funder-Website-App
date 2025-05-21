import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { FaUsers, FaCreditCard, FaChartBar } from 'react-icons/fa';
import needsIcon from '../../assets/icons/needs.png';
import benefits from '../../assets/icons/benefits.png';
import fraud from '../../assets/icons/fraud.png';
import policy from '../../assets/icons/policy.png';

const Benefits = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-left">
          <img src={logo} alt="Nana Logo" className="nav-logo" />
        </div>
        <div className="nav-center">
          <Link to="/service">Service</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/benefits" className="active">Benefits</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="nav-right">
          <Link to="/login" className="login-btn">Log in</Link>
          <Link to="/signup" className="signup-btn">Sign up</Link>
        </div>
      </nav>

      <div className="main-content">
        <div className="benefits-section">
          <div className="benefit-card">
            <div className="benefit-content">
              <img src={needsIcon} alt="basic needs" className="benefit-icon" />
              <div>
                <h2>Guaranteed Basic Needs</h2>
                <p>Ensures that essential needs like food, clothing, education, and healthcare are met, potentially improving health, educational outcomes.</p>
              </div>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-content">
              <img src={benefits} alt="social responsibility" className="benefit-icon" />
              <div>
                <h2>Social Responsibility and Trust</h2>
                <p>Addressing child welfare through financial security can appeal to socially conscious consumers, investors, and institutions.</p>
              </div>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-content">
              <img src={fraud} alt="fraud reduction" className="benefit-icon" />
              <div>
                <h2>Reduction in Fraud</h2>
                <p>By restricting the use of funds to specific categories and stores, there's a built-in mechanism to reduce fraudulent activities.</p>
              </div>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-content">
              <img src={policy} alt="data policy" className="benefit-icon" />
              <div>
                <h2>Data for Policy Making</h2>
                <p>Aggregated data from the app could inform policy decisions regarding child welfare, education, and health, leading to more targeted interventions.</p>
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

        .main-content {
          margin-top: 110px;
          padding: 0 4%;
        }

        .benefits-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          margin-top: 2rem;
          align-items: stretch;
        }

        .benefit-card {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 10px;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: 100%;
        }

        .benefit-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          width: 100%;
        }

        .benefit-icon {
          width: 2.2rem;
          height: 2.2rem;
          color: #FFA500EE;
          flex-shrink: 0;
          margin-top: 0.1rem;
          object-fit: contain;
          align-self: flex-start;
        }

        .benefit-content > div {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .benefit-content h2 {
          font-size: 1.25rem;
          margin: 0 0 0.5rem 0;
          color: #14532d;
          font-weight: 700;
          word-wrap: break-word;
        }

        .benefit-content p {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .features-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 2rem;
        }
        .feature-item { padding: 0.75rem; }
        .feature-item .feature-number { font-size: 20px; color: black; margin-bottom: 0.25rem; }
        .feature-item .feature-title { font-size: 16px; color: #FFA500EE; margin-bottom: 0.25rem; }
        .feature-item p:last-child { color: #666; font-size: 0.8rem; line-height: 1.3; }
        @media (max-width: 1024px) { .benefits-section { grid-template-columns: 1fr; } .features-section { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .benefits-section { grid-template-columns: 1fr; } .features-section { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Benefits;
