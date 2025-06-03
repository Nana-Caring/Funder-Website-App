import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import logo from '../../assets/logo.jpg';

const LandingNav = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHamburgerClick = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="landing-nav">
      <div className="nav-left">
        <img src={logo} alt="Nana Logo" className="nav-logo" />
      </div>

      <div className="nav-center">
        <Link to="/how-it-works" className={location.pathname === '/how-it-works' ? 'active' : ''}>
          How it works
        </Link>
        <Link to="/benefits" className={location.pathname === '/benefits' ? 'active' : ''}>
          Benefits
        </Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
          Contact Us
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/login" className="login-btn">Log in</Link>
        <Link to="/signup" className="signup-btn">Sign up</Link>
        <Link to="/profile" className="profile-btn">
          <FaUser />
        </Link>
      </div>

      {/* Hamburger icon for mobile */}
      <button
        className="hamburger"
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        onClick={handleHamburgerClick}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile navigation menu */}
      <div className={`mobile-nav${menuOpen ? ' open' : ' closed'}`}>
        <Link to="/how-it-works" onClick={closeMenu} className={location.pathname === '/how-it-works' ? 'active' : ''}>
          How it works
        </Link>
        <Link to="/benefits" onClick={closeMenu} className={location.pathname === '/benefits' ? 'active' : ''}>
          Benefits
        </Link>
        <Link to="/contact" onClick={closeMenu} className={location.pathname === '/contact' ? 'active' : ''}>
          Contact Us
        </Link>
        <Link to="/login" onClick={closeMenu} className="login-btn">Log in</Link>
        <Link to="/signup" onClick={closeMenu} className="signup-btn">Sign up</Link>
        <Link to="/profile" onClick={closeMenu} className="profile-btn">
          <FaUser />
        </Link>
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
        .nav-left {
          display: flex;
          align-items: center;
        }
        .nav-logo {
          height: 40px;
          width: auto;
        }
        .nav-center {
          display: flex;
          gap: 2rem;
        }
        .nav-center a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .nav-center a:hover {
          color:rgb(231, 122, 20);
        }
        .nav-center a.active {
          color: #14532d;
          font-weight: 600;
        }
        .nav-right {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .nav-right a {
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .login-btn {
          color: #14532d;
          font-weight: 500;
        }
        .signup-btn {
          color: black;
        }
        .signup-btn:hover {
          background:rgb(240, 170, 19);
        }
        .profile-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          padding: 0.5rem;
          border-radius: 50%;
          background: #f0f0f0;
          transition: all 0.2s;
        }
        .profile-btn:hover {
          background: #e0e0e0;
          transform: scale(1.05);
        }
        .profile-btn svg {
          width: 20px;
          height: 20px;
        }
        /* Hamburger styles */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1100;
        }
        .hamburger span {
          display: block;
          height: 4px;
          width: 28px;
          margin: 4px 0;
          background: #333;
          border-radius: 2px;
          transition: 0.3s;
        }
        /* Mobile nav menu */
        .mobile-nav {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 100%;
          left: 0;
          width: 100vw;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          z-index: 1050;
          padding: 1rem 0;
        }
        .mobile-nav a {
          color: #333;
          text-decoration: none;
          font-size: 1.1rem;
          padding: 1rem 2vw;
          font-weight: 500;
          transition: background 0.2s;
        }
        .mobile-nav a:hover {
          background: #FFA50011;
          color: #FFA500EE;
        }
        .mobile-nav.closed {
          display: none;
        }
        .mobile-nav.open {
          display: flex;
        }
        /* Responsive styles */
        @media (max-width: 768px) {
          .nav-center {
            display: none;
          }
          .nav-right {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .mobile-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default LandingNav;