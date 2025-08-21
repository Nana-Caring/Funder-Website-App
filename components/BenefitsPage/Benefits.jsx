import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCreditCard, FaChartBar } from 'react-icons/fa';
import needsIcon from '../../assets/icons/needs.png';
import benefits from '../../assets/icons/benefits.png';
import fraud from '../../assets/icons/fraud.png';
import policy from '../../assets/icons/policy.png';
import LandingNav from '../LandingNav/LandingNav';
import FeaturesSection from '../common/FeaturesSection';

const Benefits = () => {
  return (
    <div className="landing-page">
      <LandingNav />
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

        <FeaturesSection />
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

        .main-content {
          margin-top: 110px;
          padding: 0 4%;
        }

        .benefits-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
          margin-bottom: 1rem;
          margin-top: 1rem;
          align-items: start;
        }

        .benefit-card {
          background-color: #f9f9f9;
          padding: 1rem;
          border-radius: 10px;
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: auto;
          min-height: 100px;
        }

        .benefit-content {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          width: 100%;
          height: 100%;
        }

        .benefit-icon {
          width: 2rem;
          height: 2rem;
          color: #FFA500EE;
          flex-shrink: 0;
          margin-top: 0.1rem;
          object-fit: contain;
          align-self: flex-start;
        }

        .benefit-content h2 {
          font-size: 1.1rem;
          margin: 0 0 0.4rem 0;
          color: #14532d;
          font-weight: 700;
          word-wrap: break-word;
        }

        .benefit-content p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.3;
          word-wrap: break-word;
        }

        .features-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
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
