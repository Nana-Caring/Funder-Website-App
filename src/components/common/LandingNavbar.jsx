import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

const LandingNavbar = ({ active }) => (
  <nav className="landing-nav">
    <div className="nav-left">
      <img src={logo} alt="Nana Logo" className="nav-logo" />
    </div>
    <div className="nav-center">
      <Link to="/service" className={active === 'service' ? 'active' : ''}>Service</Link>
      <Link to="/how-it-works" className={active === 'how-it-works' ? 'active' : ''}>How it works</Link>
      <Link to="/benefits" className={active === 'benefits' ? 'active' : ''}>Benefits</Link>
      <Link to="/contact" className={active === 'contact' ? 'active' : ''}>Contact Us</Link>
    </div>
    <div className="nav-right">
      <Link to="/login" className="login-btn">Log in</Link>
      <Link to="/signup" className="signup-btn">Sign up</Link>
    </div>
    <style>{`
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
      .nav-logo { height: 60px; }
      .nav-center { display: flex; gap: 2rem; }
      .nav-center a { text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s; }
      .nav-center a.active, .nav-center a:hover { color: #FFA500EE; }
      .nav-right { display: flex; gap: 1rem; align-items: center; }
      .login-btn, .signup-btn { text-decoration: none; font-weight: 500; padding: 0.8rem 1.8rem; border-radius: 25px; transition: all 0.3s; }
      .login-btn { color: #333; }
      .signup-btn { background: #fff; color: #000; border: 2px solid #FFA500EE; }
      .signup-btn:hover { background: #FFA500EE; color: #fff; }
      @media (max-width: 768px) { .landing-nav { padding: 0.5rem 0; } .nav-logo { height: 40px; } .nav-center { display: none; } .nav-right { gap: 0.5rem; } .login-btn, .signup-btn { padding: 0.5rem 1rem; font-size: 0.85rem; } }
    `}</style>
  </nav>
);

export default LandingNavbar; 