import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import personIcon from '../../assets/icons/person.png';
import notificationIcon from '../../assets/icons/notifications.png';
import notificationIndicatorIcon from '../../assets/icons/notification-icon.png';
import settingsIcon from '../../assets/icons/settings.png';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  background: white;
  border-bottom: 1px solid #eee;
  z-index: 1000;
  font-family: 'Poppins', sans-serif;

  h2 {
    font-size: 20px;
    color: #333;
    margin: 0;
  }

  .icons {
    display: flex;
    gap: 15px;
    align-items: center;

    .icon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      position: relative;

      img {
        cursor: pointer;
        width: 24px;
        height: 24px;
        object-fit: contain;
      }

      .notification-indicator {
        position: absolute;
        top: -4px;
        right: -2px;
        width: 12px;
        height: 12px;
      }

      span {
        font-size: 12px;
        color: #666;
      }
    }
  }
`;

const Header = () => {
  const surname = localStorage.getItem('surname') || 'User';

  return (
    <HeaderContainer>
      <h2>
        <span style={{ fontWeight: 'normal' }}>Welcome Back, </span>
        <span style={{ fontWeight: 'bold' }}>Mr {surname}</span>
      </h2>
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