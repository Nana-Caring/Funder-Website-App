import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import landingCard from '../../assets/images/landingCard.png';
import FeaturesSection from '../common/FeaturesSection';
import LandingNav from '../LandingNav/LandingNav';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <LandingNav />

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