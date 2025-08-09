import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import personIcon from '../../assets/icons/person.png';
import notificationIcon from '../../assets/icons/notifications.png';
import notificationIndicatorIcon from '../../assets/icons/notification-icon.png';
import settingsIcon from '../../assets/icons/settings.png';

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px 0px 60px;
  width: calc(100% - 250px);
  margin-left: auto;
  box-sizing: border-box;
  background: white;
  border-bottom: 1px solid #eee;
  font-family: 'Poppins', sans-serif;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  z-index: 2000;

  h2 {
    font-size: 16px;
    color: #333;
    margin: 0;
  }

  .icons {
    display: flex;
    gap: 12px;
    align-items: center;

    .icon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      position: relative;
      img {
        cursor: pointer;
        width: 20px;
        height: 20px;
        object-fit: contain;
      }
      .notification-indicator {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
      }
      span {
        font-size: 11px;
        color: #666;
      }
    }
  }

  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 2100;
    margin-left: 12px;
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

  @media (max-width: 1024px) {
    width: 100vw;
    min-width: 0;
    padding: 8px 20px 8px 20px;
    h2 {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    width: 100vw;
    min-width: 0;
    padding: 8px 10px 8px 10px;
    .icons {
      gap: 8px;
      .icon-container img {
        width: 18px;
        height: 18px;
      }
    }
    .hamburger {
      display: flex;
    }
  }
`;

const MainContent = styled.div`
  margin-top: 60px; /* Same as header height */
  padding: 16px;
  width: calc(100% - 250px);
  margin-left: auto;
  box-sizing: border-box;
  
  @media (max-width: 1024px) {
    width: calc(100% - 200px);
  }

  @media (max-width: 768px) {
    width: calc(100% - 180px);
  }
`;


import { useState } from 'react';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const surname = localStorage.getItem('surname') || 'User';
  const [menuOpen, setMenuOpen] = useState(false);

  // Responsive: show icons as hamburger menu on mobile
  return (
    <HeaderContainer>
      {title ? (
        <h2>{title}</h2>
      ) : (
        <h2>
          <span style={{ fontWeight: 'normal', fontSize: '14px' }}>Welcome Back, </span>
          <span style={{ fontWeight: 'bold' }}>Mr {surname}</span>
        </h2>
      )}
      {/* Hamburger for mobile */}
      <button
        className="hamburger"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        style={{ display: 'none' }}
      >
        <span style={{ background: menuOpen ? '#FFA500EE' : '#333', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
        <span style={{ opacity: menuOpen ? 0 : 1 }} />
        <span style={{ background: menuOpen ? '#FFA500EE' : '#333', transform: menuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none' }} />
      </button>
      {/* Desktop icons */}
      <div className="icons" style={{ display: menuOpen ? 'none' : 'flex' }}>
        <div className="icon-container" onClick={() => navigate('/profile')}>
          <img src={personIcon} alt="Profile" />
        </div>
        <div className="icon-container" onClick={() => navigate('/settings')}>
          <img src={settingsIcon} alt="Settings" />
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: 0,
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderRadius: '0 0 0 12px',
            zIndex: 2200,
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            minWidth: '140px',
            alignItems: 'flex-end',
          }}
        >
          <div className="icon-container" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>
            <img src={personIcon} alt="Profile" />
            <span>Profile</span>
          </div>
          <div className="icon-container" onClick={() => { setMenuOpen(false); navigate('/settings'); }}>
            <img src={settingsIcon} alt="Settings" />
            <span>Settings</span>
          </div>
        </div>
      )}
    </HeaderContainer>
  );
};

export default Header;