import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import homeIcon from '../../assets/icons/home-icon.png';
import depositIcon from '../../assets/icons/deposit-icon.png';
import myAccountIcon from '../../assets/icons/my-account-icon.png';
import sendMoneyIcon from '../../assets/icons/send-money-icon.png';
import beneficiaryIcon from '../../assets/icons/beneficiary-icon.png';
import statementsIcon from '../../assets/icons/statements-icon.png';
import messagesIcon from '../../assets/icons/messages.png';

const SidebarContainer = styled.div`
  width: 250px; /* Fixed width */
  min-width: 250px; /* Prevent shrinking */
  height: 100vh; /* Changed from 150vh to viewport height */
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid gray;
  font-family: 'Poppins', sans-serif;
  position: fixed; /* Keep sidebar fixed */
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto; /* Allow scrolling if content is too long */

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;

const Logo = styled.img`
  width: 90px;
  height: 90px;
  margin-bottom: 40px;
  object-fit: cover;
  border-radius: 50%;
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
  margin: 4px 0;
  width: calc(100% - 24px); /* Account for padding */
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

  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Sidebar = () => {
  const location = useLocation();
  return (
    <SidebarContainer>
      <Logo src={logo} alt="Nana" />

      <MenuItem to="/dashboard" active={location.pathname === "/dashboard" ? 1 : 0}>
        <img src={homeIcon} alt="Home" />
        Home
      </MenuItem>

      <MenuItem to="/messages" active={location.pathname === "/messages" ? 1 : 0}>
        <img src={messagesIcon} alt="Messages" />
        Messages 
      </MenuItem>

      <MenuItem to="/my-accounts" active={location.pathname === "/my-accounts" ? 1 : 0}>
        <img src={myAccountIcon} alt="My Card" />
        My Card
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