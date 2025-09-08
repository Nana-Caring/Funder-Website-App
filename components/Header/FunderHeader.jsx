import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer } from './BaseHeader';
import personIcon from '../../assets/icons/person.png';
import notificationIcon from '../../assets/icons/notifications.png';
import notificationIndicatorIcon from '../../assets/icons/notification-icon.png';
import settingsIcon from '../../assets/icons/settings.png';

const FunderHeader = ({ title }) => {
  const navigate = useNavigate();
  const surname = localStorage.getItem('surname') || 'Funder';

  return (
    <HeaderContainer>
      {title ? (
        <h2>{title}</h2>
      ) : (
        <h2>
          <span style={{ fontWeight: 'normal', fontSize: '14px' }}> Welcome, </span>
          <span style={{ fontWeight: 'bold' }}>{surname}</span>
        </h2>
      )}
      <div className="icons">
        <div className="icon-container" onClick={() => navigate('/profile')}>
          <img src={personIcon} alt="Profile" />
        </div>
      
        <div className="icon-container" onClick={() => navigate('/settings')}>
          <img src={settingsIcon} alt="Settings" />
        </div>
      </div>
    </HeaderContainer>
  );
};

export default FunderHeader;