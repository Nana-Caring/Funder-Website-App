import React from 'react';
import { BsPersonGear } from 'react-icons/bs';
import { BiCreditCard } from 'react-icons/bi';
import { FaLongArrowAltRight } from 'react-icons/fa';
import LandingNav from '../LandingNav/LandingNav';
import FeaturesSection from '../common/FeaturesSection';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="landing-page">
      <LandingNav />
      <div className="main-content">
        <div className="steps-container">
          <div className="step-card">
            <h2>
              <span className="step-icon">
                <BsPersonGear />
              </span>
              Account Setup Management
            </h2>
            <div className="content-row">
              <p>Create specific accounts for different needs (main account for nutrition, medical account, clothing account, school account, baby care...</p>
              <FaLongArrowAltRight className="arrow forward-arrow" />
            </div>
          </div>

          <div className="step-card">
            <h2>
              <span className="step-icon">
                <BiCreditCard />
              </span>
              Funding Mechanism
            </h2>
            <div className="content-row">
              <p>Allow funders to deposit money via bank transfer, credit/debit card, or direct deposit from government or organizational funds.</p>
              <FaLongArrowAltRight className="arrow forward-arrow" />
            </div>
          </div>
        </div>
        
        <div className="dots-container">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      <FeaturesSection />
    </div>
  );
};

export default HowItWorks;