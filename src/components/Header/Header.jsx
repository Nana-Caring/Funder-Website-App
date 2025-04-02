import React from 'react';
import styled from 'styled-components';
import { Settings, Notifications, Person } from '@mui/icons-material';

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

      svg {
        cursor: pointer;
        color: #666;
        font-size: 20px;
      }

      span {
        font-size: 12px;
        color: #666;
      }
    }
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <h2><span style={{ fontWeight: 'normal' }}>Welcome Back, </span><span style={{ fontWeight: 'bold' }}>Mr Prince</span></h2>
      <div className="icons">
        <div className="icon-container">
          <Notifications />
          <span>Notifications</span>
        </div>
        <div className="icon-container">
          <Settings />
          <span>Settings</span>
        </div>
        <div className="icon-container">
          <Person />
          <span>Profile</span>
        </div>
      </div>
    </HeaderContainer>
  );
};

export default Header;