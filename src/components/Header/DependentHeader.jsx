import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import personIcon from '../../assets/icons/person.png';
import notificationIcon from '../../assets/icons/notifications.png';
import notificationIndicatorIcon from '../../assets/icons/notification-icon.png';
import settingsIcon from '../../assets/icons/settings.png';

const DependentHeaderContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 40px 0px 40px;
  width: 85%;
  margin-left: 280px;
  box-sizing: border-box;
  background: white;
  border-bottom: 1px solid #eee;
  font-family: 'Poppins', sans-serif;
  height: 60px;
//   z-index: 99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

  h2 {
    font-size: 18px;
    color: #185c37;
    margin: 0;
    padding-right: 24px;

    .label {
      font-weight: normal;
      font-size: 15px;
      color: #666;
    }

    .name {
      font-weight: 600;
    }
  }

  .icons {
    margin-left: auto;
    display: flex;
   gap: 2px;
    align-items: center;

    .icon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      position: relative;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f0f0f0;
      }

      img {
        width: 22px;
        height: 22px;
        object-fit: contain;
      }

      .notification-indicator {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 8px;
        height: 8px;
      }
    }
  }

  @media (max-width: 1024px) {
    width: calc(100% - 240px);
    padding: 0px 30px;
    
    h2 {
      font-size: 16px;
      
      .label {
        font-size: 14px;
      }
    }
  }

  @media (max-width: 768px) {
    width: calc(100% - 200px);
    padding: 0px 20px;
    
    .icons {
      gap: 12px;
      
      .icon-container {
        padding: 6px;
        
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
`;

const DependentHeader = ({ title }) => {
  const navigate = useNavigate();
  const surname = localStorage.getItem('surname') || 'Dependent';

  return (
    <DependentHeaderContainer>
      <h2>
        {title ? (
          title
        ) : (
          <>
            <span className="label">Dependent Account - </span>
            <span className="name">{surname}</span>
          </>
        )}
      </h2>
      <div className="icons">
        <div className="icon-container" onClick={() => navigate('/profile')}>
          <img src={personIcon} alt="Profile" />
        </div>
      
        <div className="icon-container" onClick={() => navigate('/settings')}>
          <img src={settingsIcon} alt="Settings" />
        </div>
      </div>
    </DependentHeaderContainer>
  );
};

export default DependentHeader;