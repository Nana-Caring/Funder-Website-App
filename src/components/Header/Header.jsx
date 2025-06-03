import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
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
  padding: 0px 40px 0px 60px; /* Increased left padding from 30px to 60px */
  width: calc(100% - 250px); /* Adjust width based on sidebar */
  margin-left: auto;
  box-sizing: border-box;
  background: white;
  border-bottom: 1px solid #eee;
  font-family: 'Poppins', sans-serif;
  height: 60px;
 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04); /* Subtle shadow for elevation */

  h2 {
    font-size: 16px; /* Reduced font size */
    color: #333;
    margin: 0;
  }

  .icons {
    display: flex;
    gap: 12px; /* Reduced gap */
    align-items: center;

    .icon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px; /* Reduced gap */
      position: relative;

      img {
        cursor: pointer;
        width: 20px; /* Reduced icon size */
        height: 20px; /* Reduced icon size */
        object-fit: contain;
      }

      .notification-indicator {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px; /* Reduced indicator size */
        height: 8px; /* Reduced indicator size */
      }

      span {
        font-size: 11px; /* Reduced font size */
        color: #666;
      }
    }
  }

  @media (max-width: 1024px) {
    width: calc(100% - 200px); /* Adjust for smaller screens */
    padding: 8px 30px 8px 40px; /* Adjusted padding for smaller screens */
    
    h2 {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    width: calc(100% - 180px); /* Further adjust for mobile */
    padding: 8px 20px 8px 30px; /* Further adjusted for mobile */
    
    .icons {
      gap: 8px;
      
      .icon-container img {
        width: 18px;
        height: 18px;
      }
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

const Header = ({ title }) => {
  const surname = localStorage.getItem('surname') || 'User';

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
      <div className="icons">
        <div className="icon-container">
          <img src={personIcon} alt="Profile" />
        </div>
        <div className="icon-container">
          <img src={notificationIcon} alt="Notifications" />
          <img src={notificationIndicatorIcon} alt="Notification Indicator" className="notification-indicator" />
        </div>
        <div className="icon-container">
          <img src={settingsIcon} alt="Settings" />
        </div>
      </div>
    </HeaderContainer>
  );
};

export default Header;