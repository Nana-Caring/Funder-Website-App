import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCreditCard, 
  FaUser, 
  FaUsers, 
  FaEnvelope, 
  FaTag, 
  FaComment, 
  FaPaperPlane,
  FaPhone,
  FaShieldAlt,
  FaHeadset
} from 'react-icons/fa';
import fraud from '../../assets/icons/fraud.png';
import contact from '../../assets/icons/contact-person.png';
import LandingNav from '../LandingNav/LandingNav';

const Contact = () => {
  return (
    <>
      <div className="contact-page">
        {/* Navigation */}
        <nav className="page-nav">
          <LandingNav />
        </nav>
        
        {/* Body Content */}
        <main className="page-body">
          <div className="main-content contact-content">
        <div className="contact-form-section">
          <div className="contact-header">
            <FaHeadset className="contact-header-icon" />
            <div>
              <h2 className="contact-title">CONTACT US</h2>
              <p className="contact-desc">Please send us an email by filling the form</p>
            </div>
          </div>
          <form className="contact-form">
            <div className="form-field">
              <label>
                <FaEnvelope className="field-icon" />
                Email:
              </label>
              <input type="email" required placeholder="your.email2@gmail.com" />
            </div>
            <div className="form-field">
              <label>
                <FaTag className="field-icon" />
                Subject:
              </label>
              <input type="text" required placeholder="Enter your subject" />
            </div>
            <div className="form-field">
              <label>
                <FaComment className="field-icon" />
                Message:
              </label>
              <textarea rows="3" required placeholder="Type your message here..."></textarea>
            </div>
            <button type="submit">
              <FaPaperPlane className="button-icon" />
              Send Message
            </button>
          </form>
        </div>
        <div className="contact-info-section">
          <div className="fraud-card">
            <div className="fraud-content">
              <div className="fraud-header">
                <div className="fraud-icon-wrapper">
                  <FaShieldAlt className="fraud-icon" />
                </div>
                <h2>Reduction in Fraud</h2>
              </div>
              <div>
                <p>By restricting the use of funds to specific categories</p>
                <p>and stores, there's a built-in mechanism to reduce</p>
                <p>fraudulent activities</p>
                <div className="contact-icons">
                  <div className="phone-icon-wrapper">
                    <FaPhone className="phone-icon" />
                  </div>
                  <span className="contact-numbers">01234567890 / 014523685674</span>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </main>
      </div>
        

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        /* Main Layout Structure */
        .contact-page {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
        }

        .page-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .page-body {
          flex: 1;
          margin-top: 0px;
          padding: 2rem 1rem;
          min-height: calc(100vh - 200px);
          display: flex;
          flex-direction: column;
          width: 100%;
        }



        .main-content.contact-content {
          margin-top: 0;
          padding: 0;
          display: flex;
          gap: 1.2rem;
          flex: 1;
          align-items: center;
          justify-content: center;
        }
        .contact-form-section {
          flex: 1;
        width: 700px;
        }

        .contact-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .contact-header-icon {
          font-size: 2rem;
          color: #FFA500EE;
          background: linear-gradient(135deg, #14532d, #0f4023);
          color: white;
          padding: 0.8rem;
          border-radius: 16px;
          box-shadow: 
            0 6px 12px rgba(20, 83, 45, 0.3),
            0 2px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .contact-header:hover .contact-header-icon {
          transform: rotate(5deg) scale(1.05);
          box-shadow: 
            0 8px 16px rgba(20, 83, 45, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .contact-title {
          color: #14532d;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.3rem;
        }
        
        .contact-desc {
          margin-bottom: 0;
          font-size: 0.95rem;
          color: #666;
        }
        .contact-form {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 165, 0, 0.05));
          border-radius: 20px;
          border: 1px solid rgba(255, 165, 0, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .contact-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #FFA500EE, #14532d, #FFA500EE);
          border-radius: 20px 20px 0 0;
        }

        .contact-form:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 16px 48px rgba(0, 0, 0, 0.12),
            0 8px 24px rgba(255, 165, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .form-field {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .contact-form label {
          font-size: 0.85rem;
          color: #14532d;
          font-weight: 500;
          width: 120px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .field-icon {
          font-size: 1rem;
          color: #FFA500EE;
          flex-shrink: 0;
        }
        .contact-form input, .contact-form textarea {
          border: 1px solid rgba(255, 165, 0, 0.2);
          border-radius: 12px;
          padding: 0.8rem;
          font-size: 0.9rem;
          font-family: inherit;
          flex: 1;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .contact-form input::placeholder, .contact-form textarea::placeholder {
          color: #999;
          font-style: italic;
        }

        .contact-form input:focus, .contact-form textarea:focus {
          outline: none;
          border-color: #14532d;
          box-shadow: 
            0 0 0 3px rgba(20, 83, 45, 0.1),
            0 4px 12px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .contact-form button {
          margin-top: 0.8rem;
          background: linear-gradient(135deg, #14532d, #0f4023);
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 0.8rem 2rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          align-self: flex-end;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 6px 12px rgba(20, 83, 45, 0.3),
            0 2px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .button-icon {
          font-size: 0.9rem;
          transition: transform 0.3s ease;
        }

        .contact-form button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .contact-form button:hover::before {
          left: 100%;
        }

        .contact-form button:hover {
          background: linear-gradient(135deg, #FFA500EE, #FF8C00);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 8px 16px rgba(255, 165, 0, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .contact-form button:hover .button-icon {
          transform: translateX(3px);
        }
        .contact-info-section {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }
        .fraud-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 165, 0, 0.05));
          border-radius: 20px;
          border: 1px solid rgba(255, 165, 0, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 2rem;
          margin-top: 1.2rem;
          width: 100%;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fraud-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #FFA500EE, #14532d, #FFA500EE);
          border-radius: 20px 20px 0 0;
        }

        .fraud-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.12),
            0 16px 32px rgba(255, 165, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .fraud-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .fraud-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fraud-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #14532d, #0f4023);
          border-radius: 16px;
          box-shadow: 
            0 6px 12px rgba(20, 83, 45, 0.3),
            0 2px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .fraud-icon {
          font-size: 1.5rem;
          color: white;
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
          width: 48px;
          height: 48px;
          margin-right: 0.8rem;
          background: linear-gradient(135deg, #14532d, #0f4023);
          border-radius: 14px;
          padding: 8px;
          filter: brightness(0) invert(1);
          box-shadow: 
            0 6px 12px rgba(20, 83, 45, 0.3),
            0 2px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .fraud-card:hover .fraud-icon-wrapper {
          transform: rotate(5deg) scale(1.05);
          box-shadow: 
            0 8px 16px rgba(20, 83, 45, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .contact-icons {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
          border-radius: 16px;
          border: 1px solid rgba(255, 165, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .contact-icons:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
          transform: translateY(-2px);
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.1),
            0 4px 8px rgba(255, 165, 0, 0.1);
        }
        
        .phone-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #FFA500EE, #FF8C00);
          border-radius: 12px;
          box-shadow: 
            0 4px 8px rgba(255, 165, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .phone-icon {
          font-size: 1rem;
          color: white;
        }
        
        .contact-icons:hover .phone-icon-wrapper {
          transform: rotate(-5deg) scale(1.05);
        }
        .contact-numbers {
          font-size: 0.95rem;
          color: #14532d;
          font-weight: 500;
        }
        .features-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 2rem 4%;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-item {
          text-align: left;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
          border-radius: 16px;
          border: 1px solid rgba(255, 165, 0, 0.1);
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }
        
        .feature-item:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 12px 24px rgba(0, 0, 0, 0.1),
            0 6px 16px rgba(255, 165, 0, 0.1);
        }
        
        .feature-item .feature-number { 
          font-size: 1.2rem; 
          font-weight: 600;
          color: #14532d; 
          margin-bottom: 0.5rem; 
        }
        
        .feature-item .feature-title { 
          font-size: 1.1rem; 
          font-weight: 500;
          color: #FFA500EE; 
          margin-bottom: 0.5rem; 
        }
        
        .feature-item p:last-child { 
          color: #666; 
          font-size: 0.9rem; 
          line-height: 1.5; 
        }
        @media (max-width: 1024px) {
          .main-content.contact-content { flex-direction: column; min-height: unset; }
          .features-section { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .main-content.contact-content { flex-direction: column; gap: 0.7rem; min-height: unset; }
          .features-section { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default Contact;