import React, { useState } from 'react';
import { BsPersonGear, BsPeople, BsShield } from 'react-icons/bs';
import { BiCreditCard, BiTransfer, BiMoney, BiSupport } from 'react-icons/bi';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
import { MdSecurity, MdAccountBalance } from 'react-icons/md';
import LandingNav from '../LandingNav/LandingNav';
import FeaturesSection from '../common/FeaturesSection';
import './HowItWorks.css';

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Account Setup & Management",
      icon: <BsPersonGear />,
      content: [
        {
          subtitle: "Multi-Account Creation",
          description: "Create specific accounts for different needs: nutrition, medical, clothing, school, baby care, and more.",
          icon: <MdAccountBalance />
        },
        {
          subtitle: "User Role Management", 
          description: "Assign roles to caregivers, dependents, and funders with appropriate access levels.",
          icon: <BsPeople />
        }
      ]
    },
    {
      title: "Funding Mechanism",
      icon: <BiCreditCard />,
      content: [
        {
          subtitle: "Multiple Payment Options",
          description: "Accept funds via bank transfer, credit/debit cards, or direct deposits from organizations.",
          icon: <BiMoney />
        },
        {
          subtitle: "Secure Transactions",
          description: "All transactions are encrypted and secure, ensuring your financial data is protected.",
          icon: <MdSecurity />
        }
      ]
    },
    {
      title: "Money Management & Transfer",
      icon: <BiTransfer />,
      content: [
        {
          subtitle: "Smart Fund Allocation",
          description: "Automatically distribute funds to appropriate accounts based on preset rules and priorities.",
          icon: <BiTransfer />
        },
        {
          subtitle: "Real-time Tracking",
          description: "Monitor spending and account balances in real-time with detailed transaction history.",
          icon: <BsShield />
        }
      ]
    },
    {
      title: "Support & Monitoring",
      icon: <BiSupport />,
      content: [
        {
          subtitle: "24/7 Customer Support",
          description: "Get help whenever you need it with our dedicated support team available around the clock.",
          icon: <BiSupport />
        },
        {
          subtitle: "Activity Monitoring",
          description: "Keep track of all account activities with detailed reports and notifications for peace of mind.",
          icon: <BsShield />
        }
      ]
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="how-it-works-page">
      {/* Navigation */}
      <nav className="page-nav">
        <LandingNav />
      </nav>

      {/* Body Content */}
      <main className="page-body">
        <div className="content-wrapper">
          
            <div className="step-card">
              <h2>
                <span className="step-icon">
                  {steps[currentStep].icon}
                </span>
                {steps[currentStep].title}
              </h2>
              
              {steps[currentStep].content.map((item, index) => (
                <div key={index} className="content-row">
                  <div className="content-item">
                    <span className="content-icon">
                      {item.icon}
                    </span>
                    <div className="content-text">
                      <h3>{item.subtitle}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            
          </div>
          
          <div className="dots-container">
            {steps.map((_, index) => (
              <span 
                key={index}
                className={`dot ${index === currentStep ? 'active' : ''}`}
                onClick={() => goToStep(index)}
              />
            ))}
          </div>
       
      </main>

    </div>
  );
};

export default HowItWorks;