import React from 'react';
import LandingNavbar from '../common/LandingNavbar';
import FeaturesSection from '../common/FeaturesSection';
import setupIcon from '../../assets/icons/setup.png';
import fundingIcon from '../../assets/icons/funding.png';

const HowItWorksPage = () => {
  return (
    <div className="landing-page">
      <LandingNavbar active="how-it-works" />
      <div className="main-content">
        {/* Carousel Section Centered */}
        <div className="carousel-section">
          <div className="carousel-features">
          {/* Feature 1 */}
            <div className="carousel-feature-card">
              <h3>
                <img src={setupIcon} alt="setup" style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
                Account Setup Management
              </h3>
              <p>
              Create specific accounts for different needs (main account for nutrition, medical account, clothing account, school account, baby care...)
            </p>
              <div className="arrow">→</div>
          </div>
          {/* Feature 2 */}
            <div className="carousel-feature-card">
              <h3>
                <img src={fundingIcon} alt="funding" style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
                Funding Mechanism
              </h3>
              <p>
              Allow funders to deposit money via bank transfer, credit/debit card, or direct deposit from government or organizational funds.
            </p>
              <div className="arrow">→</div>
            </div>
          </div>
          {/* Carousel Dots Centered Below */}
          <div className="carousel-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <FeaturesSection />
        </div>

      {/* Styles */}
      <style>
        {`
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

        .carousel-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin: 0 auto;
        }

        .carousel-features {
          display: flex;
          gap: 1rem;
          border: 2px dashed #D8B4FE;
          padding: 1.5rem 2rem;
          border-radius: 12px;
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
        }

        .carousel-feature-card {
          background-color: #FECF65;
          padding: 1rem;
          border-radius: 20px;
          width: 250px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .carousel-feature-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #064e3b;
          margin-bottom: 0.5rem;
        }
        .carousel-feature-card p {
          font-size: 13px;
          margin-top: 8px;
          color: #1f2937;
        }
        .arrow {
          text-align: right;
          font-size: 20px;
          width: 100%;
          color: #333;
        }
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.2rem;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid orange;
          background: transparent;
          display: inline-block;
        }
        .dot.active {
          background-color: #065f46;
          border: none;
        }
        @media (max-width: 700px) {
          .carousel-features {
            flex-direction: column;
            max-width: 100%;
            padding: 1rem;
          }
          .carousel-feature-card {
            width: 100%;
          }
        }
        `}
      </style>
    </div>
  );
};

export default HowItWorksPage;
