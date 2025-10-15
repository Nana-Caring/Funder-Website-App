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
    <>
      <div className="benefits-page">
        {/* Navigation */}
        <nav className="page-nav">
          <LandingNav />
        </nav>

        {/* Body Content */}
        <main className="page-body">
          <div className="content-wrapper">
            <div className="benefits-container">
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-content">
                    <div className="benefit-icon-wrapper">
                      <img src={needsIcon} alt="basic needs" className="benefit-icon" />
                    </div>
                    <div className="benefit-text">
                      <h2>Guaranteed Basic Needs</h2>
                      <p>Ensures that essential needs like food, clothing, education, and healthcare are met, potentially improving health, educational outcomes.</p>
                    </div>
                  </div>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-content">
                    <div className="benefit-icon-wrapper">
                      <img src={benefits} alt="social responsibility" className="benefit-icon" />
                    </div>
                    <div className="benefit-text">
                      <h2>Social Responsibility and Trust</h2>
                      <p>Addressing child welfare through financial security can appeal to socially conscious consumers, investors, and institutions.</p>
                    </div>
                  </div>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-content">
                    <div className="benefit-icon-wrapper">
                      <img src={fraud} alt="fraud reduction" className="benefit-icon" />
                    </div>
                    <div className="benefit-text">
                      <h2>Reduction in Fraud</h2>
                      <p>By restricting the use of funds to specific categories and stores, there's a built-in mechanism to reduce fraudulent activities.</p>
                    </div>
                  </div>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-content">
                    <div className="benefit-icon-wrapper">
                      <img src={policy} alt="data policy" className="benefit-icon" />
                    </div>
                    <div className="benefit-text">
                      <h2>Data for Policy Making</h2>
                      <p>Aggregated data from the app could inform policy decisions regarding child welfare, education, and health, leading to more targeted interventions.</p>
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
        .benefits-page {
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
          margin-top: 40px;
          padding: 2rem 1rem;
          min-height: calc(100vh - 110px);
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-footer {
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
          padding: 2rem 0;
          margin-top: auto;
        }

        /* Benefits Container */
        .benefits-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 2rem 0;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          width: 100%;
          width: 100%;
        }

        /* Benefit Cards with Modern Styling */
        .benefit-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 165, 0, 0.05));
          padding: 3rem;
          border-radius: 20px;
          position: relative;
          border: 1px solid rgba(255, 165, 0, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
         height: 150px;
          width: auto;
        }

        .benefit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #FFA500EE, #14532d, #FFA500EE);
          border-radius: 20px 20px 0 0;
        }

        .benefit-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.12),
            0 16px 32px rgba(255, 165, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-color: rgba(255, 165, 0, 0.25);
        }

        .benefit-content {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          width: 100%;
        }

        .benefit-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #14532d, #0f4023);
          border-radius: 18px;
          flex-shrink: 0;
          box-shadow: 
            0 6px 12px rgba(20, 83, 45, 0.3),
            0 2px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .benefit-icon-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .benefit-card:hover .benefit-icon-wrapper::before {
          left: 100%;
        }

        .benefit-card:hover .benefit-icon-wrapper {
          transform: rotate(5deg) scale(1.05);
          box-shadow: 
            0 8px 16px rgba(20, 83, 45, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .benefit-icon {
          width: 2.5rem;
          height: 2.5rem;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .benefit-text {
          flex: 1;
        }

        .benefit-text h2 {
          font-size: 1.5rem;
          margin: 0 0 1rem 0;
          color: #14532d;
          font-weight: 700;
          line-height: 1.3;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .benefit-text p {
          margin: 0;
          color: #666;
          font-size: 1rem;
          line-height: 1.6;
        }

        /* Features Section Styling */
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
        }

        .feature-number {
          font-size: 1.2rem;
          font-weight: 600;
          color: #14532d;
          margin-bottom: 0.5rem;
        }

        .feature-title {
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-body {
            padding: 1rem 2%;
            margin-top: 90px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .benefit-card {
            padding: 1.5rem;
          }

          .benefit-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .benefit-icon-wrapper {
            align-self: center;
          }

          .features-section {
            grid-template-columns: 1fr;
            padding: 1rem 2%;
          }

          .content-wrapper {
            padding: 0;
          }
        }

        @media (max-width: 1024px) {
          .benefits-grid {
            max-width: 600px;
          }

          .features-section {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
};

export default Benefits;
