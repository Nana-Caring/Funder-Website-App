import React from 'react';

const FeaturesSection = () => (
  <div className="features-section">
    <div className="feature-item">
      <p className="feature-number">01</p>
      <p className="feature-title">Account Setup</p>
      <p>Create specific accounts for different needs (nutrition, medical, clothing, school, baby care, etc.).</p>
    </div>
    <div className="feature-item">
      <p className="feature-number">02</p>
      <p className="feature-title">Funding Mechanism</p>
      <p>Allow funders to deposit money via bank transfer, card, or direct deposit from organizations.</p>
    </div>
    <div className="feature-item">
      <p className="feature-number">03</p>
      <p className="feature-title">Spending Controls</p>
      <p>Funds can only be spent on approved categories and at approved merchants.</p>
    </div>
    <div className="feature-item">
      <p className="feature-number">04</p>
      <p className="feature-title">Tracking & Reporting</p>
      <p>Track spending and generate reports for transparency and accountability.</p>
    </div>
    <style>{`
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
      @media (max-width: 1024px) { .features-section { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 768px) { .features-section { grid-template-columns: 1fr; } }
    `}</style>
  </div>
);

export default FeaturesSection; 