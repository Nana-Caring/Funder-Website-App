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
  z-index: 1000;
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
    width: 100%;
    margin-left: 0;
    padding: 0px 16px;
    
    h2 {
      font-size: 16px;
      
      .label {
        font-size: 14px;
      }
    }
    
    .dep-hamburger {
      display: flex !important;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    padding: 0px 12px;
    
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
    
    .dep-hamburger {
      display: flex !important;
    }
  }
`;

const DependentHeader = ({ title, onToggleSidebar, isSidebarOpen = false }) => {
  const navigate = useNavigate();
  const surname = localStorage.getItem('surname') || 'Dependent';

  return (
    <DependentHeaderContainer>
      <button 
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        onClick={onToggleSidebar}
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.15)',
          background: 'transparent',
          marginRight: 12,
          padding: 0,
          display: 'none', /* Hide by default, will be shown via media query */
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        className="dep-hamburger"
      >
        {isSidebarOpen ? (
          <span style={{display:'block',position:'relative',width:24,height:24}}>
            <span style={{position:'absolute',top:10,left:0,right:0,height:3,background:'#185c37',transform:'rotate(45deg)',borderRadius:2}}></span>
            <span style={{position:'absolute',top:10,left:0,right:0,height:3,background:'#185c37',transform:'rotate(-45deg)',borderRadius:2}}></span>
          </span>
        ) : (
          <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:24,height:24,gap:4}}>
            <span style={{display:'block',height:3,width:24,background:'#185c37',borderRadius:2}}></span>
            <span style={{display:'block',height:3,width:24,background:'#185c37',borderRadius:2}}></span>
            <span style={{display:'block',height:3,width:24,background:'#185c37',borderRadius:2}}></span>
          </div>
        )}
      </button>
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