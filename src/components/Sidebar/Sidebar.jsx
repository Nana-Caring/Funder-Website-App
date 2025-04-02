import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import homeIcon from '../../assets/icons/home-icon.png';
import depositIcon from '../../assets/icons/deposit-icon.png';
import myAccountIcon from '../../assets/icons/my-account-icon.png';
import sendMoneyIcon from '../../assets/icons/send-money-icon.png';
import beneficiaryIcon from '../../assets/icons/beneficiary-icon.png';
import statementsIcon from '../../assets/icons/statements-icon.png';
import messagesIcon from '../../assets/icons/messages.png';

const SidebarContainer = styled.div`
  width: 235px;
  height: 150vh;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid gray;
`;

const Logo = styled.div`
  color: #FD3E6E;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MenuItem = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  color: ${props => props.active ? 'black' : '#666'};
  background-color: ${props => props.active ? '#FD3E6E' : 'transparent'};
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fff0f4;
    color: #ff4081;
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

const Sidebar = () => {
  const location = useLocation();
  return (
    <SidebarContainer>
      <Logo>
        <img src={logo} alt="Nana" width="118" height="101" />
        
      </Logo>

      <MenuItem to="/" active={location.pathname === "/" ? 1 : 0}>
        <img src={homeIcon} alt="Home" />
        Home
      </MenuItem>

      <MenuItem to="/messages" active={location.pathname === "/messages" ? 1 : 0}>
        <img src={messagesIcon} alt="Messages" />
        Messages 
      </MenuItem>

      <MenuItem to="/my-accounts" active={location.pathname === "/my-accounts" ? 1 : 0}>
        <img src={myAccountIcon} alt="My Accounts" />
        My Accounts
      </MenuItem>

      <MenuItem to="/send-money" active={location.pathname === "/send-money" ? 1 : 0}>
        <img src={sendMoneyIcon} alt="Send Money" />
        Send Money
      </MenuItem>

      <MenuItem to="/beneficiary" active={location.pathname === "/beneficiary" ? 1 : 0}>
        <img src={beneficiaryIcon} alt="Beneficiary" />
        Beneficiary
      </MenuItem>

      <MenuItem to="/statements" active={location.pathname === "/statements" ? 1 : 0}>
        <img src={statementsIcon} alt="Statements" />
        Statements
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;