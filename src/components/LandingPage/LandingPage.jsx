import React from 'react';
import LandingNavbar from '../common/LandingNavbar';
import FeaturesSection from '../common/FeaturesSection';
import landingCard from '../../assets/images/landingCard.png';
import logo from '../../assets/logo.jpg';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <LandingNavbar active="home" />
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
        <div className="hero-image">
          <img src={landingCard} alt="Nana Card" className="card-image" />
        </div>
      </div>
      <FeaturesSection />
    </div>
  );
};

export default LandingPage;